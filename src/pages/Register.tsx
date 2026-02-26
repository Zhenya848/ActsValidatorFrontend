import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../shared/utils';
import { Button } from '../shared/ui/button';
import { Input } from '../shared/ui/input';
import { FileSpreadsheet, Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { YandexIcon } from '../shared/ui/icons/YandexIcon';
import { useRegistration } from '../features/accounts/hooks/useRegister';

const requirements = [
  { label: 'Не менее 8 символов', check: (p) => p.length >= 8 },
  { label: 'Заглавная буква', check: (p) => /[A-ZА-Я]/.test(p) },
  { label: 'Цифра', check: (p) => /\d/.test(p) },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const isNameValid = name.trim() !== '';
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = requirements.every(req => req.check(password));
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && agreed;

  const { handleRegister, isLoading } = useRegistration();

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
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">СверкаПро</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Создать аккаунт</h1>
          <p className="text-slate-500 mt-1.5 text-sm">Начните работу бесплатно</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 p-8">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm mb-6"
          >
            <YandexIcon />
            Зарегистрироваться через Яндекс
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">или</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Имя и фамилия"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200"
                required
              />
            </div>

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
              onClick={() => handleRegister({ userName: name, email: email, password: password})}
            >
              Создать аккаунт
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Уже есть аккаунт?{' '}
          <Link to={createPageUrl('login')} className="text-indigo-600 hover:text-indigo-700 font-medium">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  );
}