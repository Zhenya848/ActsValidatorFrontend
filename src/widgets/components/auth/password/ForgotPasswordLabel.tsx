import { useState } from "react";
import { useForgotPasswordMutation } from "../../../../features/accounts/api";
import { showError } from "../../../../shared/helpers/showError";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Input } from "../../../../shared/ui/input";
import { Button } from "../../../../shared/ui/button";
import { SaveButton } from "../../settings/SaveButton";

export function ForgotPasswordLabel() {
    const [email, setEmail] = useState('');
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

    const handle = async () => {
        try {
            await forgotPassword({ email: email }).unwrap();
        } 
        catch (e: unknown) {
            showError(e);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Восстановление пароля</h1>
                <p className="text-slate-500 mt-1.5 text-sm">Введите ваш адрес эл. почты для отправки ссылки на восстановление пароля</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 p-8">
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

                    <Button
                        onClick={handle}
                        disabled={!isEmailValid || isLoading}
                        className={`w-full h-11 rounded-xl text-sm shadow-md shadow-indigo-200 gap-2 disabled:opacity-50 ${
                            isSuccess ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                        >
                        {isSuccess 
                        ? 
                        (
                            <>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Отправлено
                            </>
                        ) 
                        : 
                        (
                            <>
                            Отправить
                            <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}