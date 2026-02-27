import { CreditCard, LogOut, Settings, User, Zap } from "lucide-react";
import { createPageUrl } from "../../../shared/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { User as UserEntity } from "../../../entities/accounts/User";
import { Link } from "react-router-dom";

interface IUserDropdownParameters {
  user: UserEntity
}

export function UserDropdown({ user }: IUserDropdownParameters) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-800 leading-tight">{user.displayName}</p>
          <p className="text-xs text-slate-400 leading-tight">{0} кредитов</p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden"
          >
            <div className="px-4 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{user.displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-medium text-indigo-700">Кредиты</span>
                </div>
                <span className="text-sm font-bold text-indigo-700">{0}</span>
              </div>
            </div>

            <div className="py-2 px-2">
              <Link to={createPageUrl('Settings')} onClick={() => setOpen(false)}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Настройки
                </button>
              </Link>
              <Link to={createPageUrl('Pricing')} onClick={() => setOpen(false)}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Купить кредиты
                </button>
              </Link>
            </div>

            <div className="py-2 px-2 border-t border-slate-100">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition-colors">
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}