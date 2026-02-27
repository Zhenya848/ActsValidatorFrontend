import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Bell } from 'lucide-react';
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/auth.slice';

export default function Settings() {
  const user = useSelector(selectUser);

  const [name, setName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [emailVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savedSection, setSavedSection] = useState(null);

  const save = (section) => {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
            <SaveButton saved={savedSection === 'profile'} onClick={() => save('profile')} />
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
            {!emailVerified && (
              <div className="mt-3 flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-700">Почта не подтверждена</span>
                </div>
                <button className="text-xs font-semibold text-amber-700 hover:underline">
                  Отправить письмо
                </button>
              </div>
            )}
            <SaveButton saved={savedSection === 'email'} onClick={() => save('email')} />
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
            <SaveButton label="Изменить пароль" saved={savedSection === 'password'} onClick={() => save('password')} />
          </Section>

          <Section icon={Bell} title="Уведомления" iconColor="bg-rose-100 text-rose-600">
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
          </Section>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, iconColor, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SaveButton({ label = 'Сохранить', saved, onClick }) {
  return (
    <Button
      onClick={onClick}
      className={`mt-4 h-10 rounded-xl text-sm px-5 transition-all ${
        saved ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {saved ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Сохранено
        </>
      ) : label}
    </Button>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}