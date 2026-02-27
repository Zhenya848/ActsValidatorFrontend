import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { createPageUrl } from "./shared/utils"
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, Upload, Clock, Zap, Home, Menu, X, LogIn, Loader2 } from 'lucide-react';
import { Button } from './shared/ui/button';
import { Bounce, ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux';
import { selectUser } from './app/auth.slice';
import { UserDropdown } from './widgets/components/layout/UserDropdown';
import { useSetUser } from './features/accounts/hooks/useSetUser';

const navItems = [
  { name: 'Главная', page: '', icon: Home },
  { name: 'Загрузка', page: 'upload', icon: Upload },
  { name: 'История', page: 'history', icon: Clock },
  { name: 'Цены', page: 'pricing', icon: Zap }
];

interface IRootLayoutParameters {
  currentPageName: string
}

export default function RootLayout({ currentPageName = "" }: IRootLayoutParameters) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = currentPageName === 'home';
  const user = useSelector(selectUser);
  const { setUser, isLoading } = useSetUser();

  useEffect(() => {
    setUser();
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isLanding ? 'bg-white/80 border-slate-100' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl("")} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <FileSpreadsheet className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">СверкаПро</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link key={item.page} to={createPageUrl(item.page)}>
                    <button className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'text-indigo-700 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}>
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {
                isLoading
                ? 
                (
                  <div className="flex items-center gap-2 px-3 py-1.5 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                    <span className="text-sm font-medium">Загрузка профиля...</span>
                  </div>
                )
                :
                user
                ? 
                (
                  <UserDropdown user={user} />
                ) 
                : 
                (
                  <>
                    <Link to={createPageUrl("login")}>
                      <Button variant="ghost" className="text-sm text-slate-500 hover:text-slate-700 rounded-lg">
                        <LogIn className="w-4 h-4 mr-2" />
                        Войти
                      </Button>
                    </Link>

                    <Link to={createPageUrl("register")}>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm shadow-md shadow-indigo-200">
                        Регистрация
                      </Button>
                    </Link>
                  </>
                )
              }
            </div>

            <button
              className="md:hidden w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = currentPageName === item.page;
                  return (
                    <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <Button variant="outline" className="w-full rounded-xl justify-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl justify-center">
                    Регистрация
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <Outlet />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Bounce}
        />
      </main>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-600">СверкаПро</span>
            </div>
            <p className="text-xs text-slate-400">© 2026 СверкаПро. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}