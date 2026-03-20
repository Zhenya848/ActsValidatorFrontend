import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { createPageUrl } from "../../../shared/utils";
import { Button } from "../../../shared/ui/button";
import { useVerifyEmailMutation } from "../../../features/accounts/api";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { showError } from "../../../shared/helpers/showError";

export function EmailVerifiedLabel() {
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [searchParams] = useSearchParams();
    
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        const fetch = async () => {
            try {
                if (!userId || !token)
                    return;

                await verifyEmail({ userId: userId, token: token}).unwrap();
            }
            catch(error: unknown) {
                showError(error);
            }
        }

        fetch();
    }, [])

    if (isLoading || !userId || !token)
        return;

    return (
        <div>
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 text-center">
                <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-200"
                >
                <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
    
                <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-slate-900 mb-3"
                >
                Почта подтверждена!
                </motion.h1>
    
                <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-500 mb-8"
                >
                Ваш email успешно подтверждён. Теперь у вас есть полный доступ ко всем функциям платформы.
                </motion.p>
    
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
                >
                    <Link to={createPageUrl('Upload')} className="block">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 shadow-lg shadow-indigo-200">
                        <Mail className="w-4 h-4 mr-2" />
                        Загрузить документы
                        <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
        
                    <Link to={createPageUrl('')} className="block">
                        <Button variant="outline" className="w-full rounded-xl h-12 border-slate-200">
                        На главную
                        </Button>
                    </Link>
                </motion.div>
            </div>
    
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Верификация завершена
            </div>
        </div>
    )
}