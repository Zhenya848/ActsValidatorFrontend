import { useSelector } from "react-redux";
import { selectUser } from "../../../app/auth.slice";
import { useSendVerificationCodeMutation } from "../../../features/accounts/api";
import { showError } from "../../../shared/helpers/showError";
import { motion } from "framer-motion";
import { CheckCircle2, FileSpreadsheet, Info, MailWarning } from "lucide-react";
import UploadZone from "./UploadZone";

export function UploadLabel() {
    const user = useSelector(selectUser);
    const [sendVerificationCode, { isLoading: isSendVerificationCodeLoading, isSuccess: isSendVerificationCodeSuccess }] = useSendVerificationCodeMutation();

    const send = async () => {
        try {
            await sendVerificationCode().unwrap();
        }
        catch (error: unknown) {
            showError(error);
        }
    }

    return (
        <div>
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-medium text-indigo-700">Загрузка документов</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Загрузите акт сверки</h1>
                <p className="mt-3 text-lg text-slate-500 max-w-xl">
                    Выберите или перетащите файлы Excel для автоматического анализа и поиска расхождений
                </p>
            </div>

            {!user?.emailVerified && (
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 flex items-start gap-3 border rounded-xl px-5 py-4 ${
                isSendVerificationCodeSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                }`}
            >
                {isSendVerificationCodeSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                <MailWarning className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="text-sm">
                    {isSendVerificationCodeSuccess ? (
                        <>
                        <p className="font-semibold text-emerald-800">Письмо отправлено</p>
                        <p className="text-emerald-700 mt-0.5">
                            Проверьте почту и перейдите по ссылке для подтверждения email.
                        </p>
                        </>
                    ) : (
                        <>
                        <p className="font-semibold text-amber-800">Email не подтверждён</p>
                        <p className="text-amber-700 mt-0.5">
                            Для загрузки актов сверки необходимо подтвердить email. Проверьте почту и перейдите по ссылке в письме.{' '}
                            <button
                            onClick={send}
                            disabled={isSendVerificationCodeLoading}
                            className="underline font-medium hover:text-amber-900 transition-colors"
                            >
                            Отправить повторно
                            </button>
                        </p>
                        </>
                    )}
                </div>
            </motion.div>
            )}
            <UploadZone emailVerified={user?.emailVerified} />

            <div className="mt-8 bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-700/80 space-y-1">
                <p className="font-medium text-indigo-800">Как это работает?</p>
                <p>Загрузите файл акта сверки в формате Excel. Система использует двойную проверку: ИИ и классический алгоритм сравнят дебет, кредит и даты операций. Если оба метода совпадают — сверка успешна, при расхождениях покажем детальный отчёт.</p>
            </div>
            </div>
        </div>
    )
}