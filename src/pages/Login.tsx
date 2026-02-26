import { motion } from "framer-motion";
import { useState } from "react";
import { YandexIcon } from "../shared/ui/icons/YandexIcon";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Link, Lock, Mail, User } from "lucide-react";
import { Input } from "../shared/ui/input";
import { Button } from "../shared/ui/button";
import { useLogin } from "../features/accounts/hooks/useLogin";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const { handleLogin, isLoading } = useLogin();

    const isFormValid = email.trim() !== '' && password.trim() !== '' && agreed;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Войти в аккаунт</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Добро пожаловать!</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 p-8">
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm mb-6"
                    >
                        <YandexIcon />
                        Войти через Яндекс
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400 font-medium">или</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="email"
                                placeholder="Электронная почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-11 rounded-xl border-slate-200"
                                required
                            />
                        </div>

                        <div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-11 rounded-xl border-slate-200"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <div
                                onClick={() => setAgreed(!agreed)}
                                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                                agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                                }`}
                            >
                                {agreed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-xs text-slate-500 leading-relaxed">
                                Я принимаю{' '}
                                <a href="#" className="text-indigo-600 hover:underline">Условия использования</a>{' '}
                                и{' '}
                                <a href="#" className="text-indigo-600 hover:underline">Политику конфиденциальности</a>
                            </span>
                        </label>

                        <Button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm shadow-md shadow-indigo-200 gap-2 disabled:opacity-50"
                            onClick={() => handleLogin({ email: email, password: password })}
                        >
                            Войти
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}