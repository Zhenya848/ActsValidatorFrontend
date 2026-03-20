import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../app/auth.slice";
import { useSendVerificationCodeMutation, useUpdateUserMutation } from "../../../features/accounts/api";
import { showError } from "../../../shared/helpers/showError";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Bell } from 'lucide-react';
import { Input } from "../../../shared/ui/input";
import { Section } from "./Section";
import { Toggle } from "./Toggle";
import { SaveButton } from "./SaveButton";

export function SettingsLabel() {
    const user = useSelector(selectUser);
    
    const [name, setName] = useState(user?.displayName ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [savedSection, setSavedSection] = useState('');

    const [updateUser, { isLoading: isUpdateUserLoading, isSuccess: isUpdateUserSuccess }] = useUpdateUserMutation();
    const [sendVerificationCode, { isLoading: isSendVerificationCodeLoading, isSuccess: isSendVerificationCodeSuccess }] = useSendVerificationCodeMutation();

    const send = async () => {
        try {
            await sendVerificationCode().unwrap();
        }
        catch (error: unknown) {
            showError(error);
        }
    }

    const save = async (section: string) => {
        try {
            await updateUser({ userName: name, email: email, password: currentPassword, oldPassword: newPassword }).unwrap();
        }
        catch (error: unknown) {
            showError(error);
        }

        setSavedSection(section);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Настройки</h1>
            <p className="text-slate-500 mb-10">Управляйте данными вашего аккаунта</p>

            <Section icon={User} title="Профиль" iconColor="bg-indigo-100 text-indigo-600">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Имя и фамилия</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="Имя и фамилия"
                />
                <SaveButton saved={savedSection === 'name' && isUpdateUserSuccess} onClick={() => save('name')} disabled={isUpdateUserLoading} />
            </Section>

            <Section icon={Mail} title="Электронная почта" iconColor="bg-violet-100 text-violet-600">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl border-slate-200"
                    placeholder="Email"
                />
                {!user?.emailVerified && (
                    <div className={`mt-3 flex items-center justify-between px-4 py-3 rounded-xl border ${
                    isSendVerificationCodeSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <div className="flex items-center gap-2">
                        {isSendVerificationCodeSuccess ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-emerald-700">Письмо отправлено на {email}</span>
                        </>
                        ) : (
                        <>
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            <span className="text-sm text-amber-700">Почта не подтверждена</span>
                        </>
                        )}
                    </div>
                    {!isSendVerificationCodeSuccess && (
                        <button
                        onClick={send}
                        disabled={isSendVerificationCodeLoading}
                        className="text-xs font-semibold text-amber-700 hover:underline"
                        >
                        Отправить письмо
                        </button>
                    )}
                    </div>
                )}
                <SaveButton saved={savedSection === 'email' && isUpdateUserSuccess} onClick={() => save('email')} disabled={isUpdateUserLoading} />
            </Section>

            <Section icon={Lock} title="Изменить пароль" iconColor="bg-emerald-100 text-emerald-600">
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Текущий пароль</label>
                        <div className="relative">
                            <Input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="pr-10 h-11 rounded-xl border-slate-200"
                            placeholder="Текущий пароль"
                            />
                            <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Новый пароль</label>
                        <div className="relative">
                            <Input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pr-10 h-11 rounded-xl border-slate-200"
                            placeholder="Новый пароль"
                            />
                            <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
                
                <SaveButton label="Изменить пароль" saved={savedSection === 'password' && isUpdateUserSuccess} onClick={() => save('password')} disabled={isUpdateUserLoading} />
            </Section>

            {/*<Section icon={Bell} title="Уведомления" iconColor="bg-rose-100 text-rose-600">
                <div className="space-y-3">
                    {[
                    { label: 'Результаты сверки', desc: 'Получать уведомления после завершения анализа' },
                    { label: 'Остаток кредитов', desc: 'Уведомлять, когда кредитов меньше 5' },
                    ].map((n) => (
                    <div key={n.label} className="flex items-start justify-between gap-4">
                        <div>
                        <p className="text-sm font-medium text-slate-700">{n.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                        </div>
                        <Toggle />
                    </div>
                    ))}
                </div>
            </Section>*/}
        </div>
    )
}