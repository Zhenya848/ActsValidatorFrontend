import { useState } from "react";
import { useResetPasswordMutation } from "../../../../features/accounts/api";
import { showError } from "../../../../shared/helpers/showError";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "../../../../shared/ui/input";
import { Button } from "../../../../shared/ui/button";
import { Lock, EyeOff, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export function ResetPasswordLabel() {
    const requirements = [
        { label: 'Не менее 8 символов', check: (p: string) => p.length >= 8 },
        { label: 'Заглавная буква', check: (p: string) => /[A-ZА-Я]/.test(p) },
        { label: 'Цифра', check: (p: string) => /\d/.test(p) },
    ];

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const isPasswordValid = requirements.every(req => req.check(password)) && password === repeatPassword;

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handle = async () => {
        try {
            if (!userId || !token)
                return;

            await resetPassword({ userId: userId, token: token, newPassword: password }).unwrap();
            navigate("/login");
        } 
        catch (e: unknown) {
            showError(e);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Восстановление пароля</h1>
                <p className="text-slate-500 mt-1.5 text-sm">Придумайте новый пароль</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Повторите пароль"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="pl-10 pr-10 h-11 rounded-xl border-slate-200"
                            required
                        />
                    </div>

                    {password.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2.5 space-y-1.5">
                        {requirements.map((req) => {
                        const ok = req.check(password);
                        return (
                            <div key={req.label} className="flex items-center gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${ok ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className={`text-xs transition-colors ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>{req.label}</span>
                            </div>
                        );
                        })}
                    </motion.div>
                    )}

                    <Button
                        type="submit"
                        disabled={!isPasswordValid || isLoading}
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm shadow-md shadow-indigo-200 gap-2 disabled:opacity-50"
                        onClick={handle}
                    >
                        Восстановить
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}