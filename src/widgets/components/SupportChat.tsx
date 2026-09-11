import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Headphones, Check, Loader2 } from 'lucide-react';
import { chatsApi, useGetChatQuery, useSendMessageMutation } from '../../features/chats/api';
import { showError } from '../../shared/helpers/showError';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectAuthStatus } from '../../app/auth.slice';
import { selectSignalRStatus } from '../../app/signalr.slice';
import { chatConnection } from '../../app/signalr';
import type { Message } from '../../entities/chats/Message';

const formatTime = (d: Date) => {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

type VisibleMessage = {
  role: "client" | "support";
  text: string;
  time: string;
  status: "sent" | "sending" | "error";
}

export default function SupportChat() {
  const dispatch = useAppDispatch();

  const isUserAuthorized = useAppSelector(selectAuthStatus) == "succeeded";
  const signalRStatus = useAppSelector(selectSignalRStatus);

  const [open, setOpen] = useState(false);

  const { data: chatData, isSuccess: isGetChatSuccess } = useGetChatQuery(undefined, {
    skip: !isUserAuthorized || !open
  });
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  type PendingMessage = VisibleMessage & { tempId: string };

  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const confirmedMessages: VisibleMessage[] = useMemo(() => {
    if (!isGetChatSuccess || !chatData?.result) 
      return [];
    
    return chatData.result.messages.map((m): VisibleMessage => ({
      role: m.type.toLowerCase() === 'client' ? 'client' : 'support',
      text: m.content,
      time: formatTime(new Date(m.createdAt)),
      status: 'sent',
    }));
  }, [chatData, isGetChatSuccess]);

  const messages = [...confirmedMessages, ...pendingMessages];
  const chatId = chatData?.result?.id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [confirmedMessages, open]);

  useEffect(() => {
    if (!chatId || signalRStatus !== "connected")
      return;

    chatConnection
      .invoke("JoinChat", chatId)
      .catch(console.error);
  }, [chatId, signalRStatus]);

  useEffect(() => {
    const handler = (message: Message) => {
      dispatch(
        chatsApi.util.updateQueryData(
          'getChat',
          undefined,
          draft => {
            const exists = draft.result?.messages.some(
                x => x.id === message.id
            );

            if (!exists) {
              draft.result!.messages.push(message);
            }
          }
        )
      );
    };

    chatConnection.on("MessageReceived", handler);

    return () => {
      chatConnection.off("MessageReceived", handler);
    };
  }, [dispatch]);

  const send = async () => {
    const text = input.trim();

    if (!text || isLoading || !isGetChatSuccess || !chatData?.result) 
      return;

    setInput('');

    const tempId = crypto.randomUUID();

    setPendingMessages(prev => [
      ...prev,
      { tempId, role: 'client', text, time: formatTime(new Date()), status: 'sending' },
    ]);

    try {
      const response = await sendMessage({
        message: text,
        chatId: chatId,
        connectionId: chatConnection.connectionId ?? undefined
      }).unwrap();

      dispatch(
        chatsApi.util.updateQueryData('getChat', undefined, draft => {
          draft.result!.messages.push(response.result!);
        })
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

  /*const retry = async (idx: number) => {
    if (isLoading) 
      return;

    const userMsg = messages[idx];

    if (!userMsg || userMsg.role !== 'user') return;
    setMessages((prev) => prev.map((m, i) => (i === idx ? { ...m, status: 'sending' } : m)));
    setLoading(true);
    try {
      const reply = await callAssistant(buildHistory(messages.slice(0, idx + 1)));
      setMessages((prev) => [
        ...prev.map((m, i) => (i === idx ? { ...m, status: 'sent' } : m)),
        { role: 'assistant', text: reply, time: formatTime(new Date()), status: 'sent' },
      ]);
    } catch (e) {
      setMessages((prev) => prev.map((m, i) => (i === idx ? { ...m, status: 'error' } : m)));
    } finally {
      setLoading(false);
    }
  };*/

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-300 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[28rem] bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Техподдержка</p>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Онлайн
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
              {messages.map((m, i) => {
                const isUser = m.role === 'client';
                return (
                  <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                        isUser
                          ? `bg-indigo-600 text-white rounded-br-md ${m.status === 'error' ? 'opacity-60' : ''}`
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400">
                      <span>{m.time}</span>
                      {isUser && m.status === 'sending' && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                      {isUser && m.status === 'sent' && <Check className="w-3 h-3 text-indigo-500" />}
                      {/*isUser && m.status === 'error' && (
                        <button
                          onClick={() => retry(i)}
                          className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-medium"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Не отправлено
                          <RotateCw className="w-3 h-3" />
                        </button>
                      )*/}
                    </div>
                  </div>
                );
              })}
              {/*isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )*/}
            </div>

            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 h-10 px-3.5 rounded-xl bg-slate-100 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}