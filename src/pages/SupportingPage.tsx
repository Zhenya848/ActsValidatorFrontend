import { useState, useEffect, useRef, useMemo } from 'react';
import { Send, ArrowLeft, Headphones, Search, User } from 'lucide-react';
import { chatsApi, useGetChatsByPaginationQuery, useSendMessageMutation } from '../features/chats/api';
import { showError } from '../shared/helpers/showError';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { selectAuthStatus } from '../app/auth.slice';
import { selectSignalRStatus } from '../app/signalr.slice';
import { chatConnection } from '../app/signalr';
import type { Message } from '../entities/chats/Message';

const formatTime = (d: Date) => {
  const date = new Date(d);
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

type VisibleMessage = {
  role: "client" | "support";
  text: string;
  time: string;
  status: "sent" | "sending" | "error";
}

export default function SupportingPage() {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chatId');

  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isUserAuthorized = useAppSelector(selectAuthStatus) == "succeeded";
  const signalRStatus = useAppSelector(selectSignalRStatus);

  const dispatch = useAppDispatch();

  const { data: chatsData, isLoading: isGetChatLoading, isError, isSuccess } = useGetChatsByPaginationQuery({ page: page, pageSize: PAGE_SIZE, searchByName: search }, {
    skip: !isUserAuthorized
  });
  const [sendMessage, { isLoading: isSendLoading }] = useSendMessageMutation();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  type PendingMessage = VisibleMessage & { tempId: string };

  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const confirmedMessages: VisibleMessage[] = useMemo(() => {
    if (!chatsData) 
      return [];

    const chat = chatsData.items.find(c => c.id === activeChatId);

    if (!chat)
      return [];
    
    return chat.messages.map((m): VisibleMessage => ({
      role: m.type.toLowerCase() === 'client' ? 'client' : 'support',
      text: m.content,
      time: formatTime(new Date(m.createdAt)),
      status: 'sent',
    }));
  }, [activeChatId, chatsData]);

  const messages = [...confirmedMessages, ...pendingMessages];

  const activeChat = chatsData?.items.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [confirmedMessages]);

  useEffect(() => {
    if (!isSuccess || signalRStatus !== "connected")
      return;

    chatsData.items.forEach((c) => {
      chatConnection
        .invoke("JoinChat", c.id)
        .catch(console.error);
    })
  }, [isSuccess, signalRStatus]);

  useEffect(() => {
    const handler = (message: Message) => {
      dispatch(
        chatsApi.util.updateQueryData(
          'getChatsByPagination',
          { page: page, pageSize: PAGE_SIZE, searchByName: search },
          draft => {
            const chat = draft.items.find((c) => c.id === message.chatId);

            if (!chat)
              return;

            const exists = chat.messages.some(m => m.id === message.id);

            if (!exists) {
              chat.messages.push(message);
            }
          }
        )
      );
    };

    chatConnection.on("MessageReceived", handler);

    return () => {
      chatConnection.off("MessageReceived", handler);
    };
  }, [dispatch, page, search]);

  if (!isUserAuthorized || isError || !chatsData)
    return null;

  const currentPage = Math.min(page, chatsData.totalCount);
  const pagedChats = chatsData.items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const sendReply = async () => {
    const text = input.trim();

    if (!text || !activeChat || isSendLoading) 
      return;

    setInput('');

    const tempId = crypto.randomUUID();

    setPendingMessages(prev => [
      ...prev,
      { tempId, role: 'client', text, time: formatTime(new Date()), status: 'sending' },
    ]);

    try {
      const response = await sendMessage({ message: text, chatId: activeChat.id, connectionId: chatConnection.connectionId ?? undefined }).unwrap();

      dispatch(
        chatsApi.util.updateQueryData(
          "getChatsByPagination",
          { page: page, pageSize: PAGE_SIZE, searchByName: search },
          (draft) => {
            const chat = draft.items.find(c => c.id === response.result!.chatId);

            if (!chat)
              return;

            chat.messages.push(response.result!);
          }
        )
      );

      setPendingMessages(prev => prev.filter(m => m.tempId !== tempId));
    } 
    catch (e: unknown) {
      console.error(e);
      showError(e);

      setPendingMessages(prev =>
        prev.map(m => (m.tempId === tempId ? { ...m, status: 'error' } : m))
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Чат с пользователями</h1>
        <p className="text-sm text-slate-500 mt-1">Панель администратора — отвечайте на сообщения пользователей</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex h-[calc(100vh-220px)] min-h-125">
        {/* Sidebar */}
        <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-slate-100`}>
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Поиск по имени..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isGetChatLoading ? (
              <div className="p-8 text-center text-sm text-slate-400">Загрузка...</div>
            ) : pagedChats.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">Нет активных чатов</div>
            ) : (
              pagedChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 ${activeChatId === c.user.id ? 'bg-indigo-50' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{c.messages[c.messages.length - 1].content}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{formatTime(c.messages[c.messages.length - 1].createdAt)}</span>
                </button>
              ))
            )}
          </div>
          <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              Назад
            </button>
            <span>Стр. {currentPage} из {chatsData.totalCount}</span>
            <button
              onClick={() => setPage((p) => Math.min(chatsData.totalCount, p + 1))}
              disabled={currentPage >= chatsData.totalCount}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              Вперёд
            </button>
          </div>
        </div>

        {/* Chat pane */}
        <div className={`${activeChatId ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
          {activeChatId ? (
            <>
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => setActiveChatId(null)} className="md:hidden w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{activeChat?.user.name || 'Пользователь'}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Онлайн
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
                {messages.map((m, i) => {
                  const isSupport = m.role.toLocaleLowerCase() === 'support';
                  return (
                    <div key={i} className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${isSupport ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'}`}>
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                    placeholder="Ответ пользователю..."
                    className="flex-1 h-10 px-3.5 rounded-xl bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!input.trim() || isSendLoading}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Headphones className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-sm">Выберите диалог слева</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}