import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../../shared/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../../shared/utils';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 min-h-[90vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-violet-100/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-50/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-sm font-medium text-indigo-700">Автоматизация сверки документов</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Акты сверки
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                без головной боли
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-lg">
              Двойная проверка ИИ и алгоритмом по дебету, кредиту и датам. Находите несостыковки мгновенно в одном удобном интерфейсе.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to={createPageUrl('Upload')}>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-base px-8 py-6 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5">
                  Загрузить документ
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('History')}>
                <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl border-slate-200 hover:bg-slate-50">
                  История сверок
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }} className="hidden lg:block">
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-3 text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
                    <span>Документ</span>
                    <span>Дата</span>
                    <span>Статус</span>
                    <span>Расхождения</span>
                  </div>
                  {[
                    { name: 'Акт_Q3_2025.xlsx', date: '12 янв', status: 'success', count: 0 },
                    { name: 'Сверка_ООО.xlsx', date: '10 янв', status: 'warning', count: 3 },
                    { name: 'Баланс_дек.xlsx', date: '08 янв', status: 'error', count: 7 },
                  ].map((row, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
                      className="grid grid-cols-4 gap-3 items-center py-3 border-b border-slate-50 last:border-0">
                      <span className="text-sm font-medium text-slate-700 truncate">{row.name}</span>
                      <span className="text-sm text-slate-400">{row.date}</span>
                      <span>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.status === 'success' ? 'bg-emerald-50 text-emerald-700' : row.status === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {row.status === 'success' ? 'Ок' : row.status === 'warning' ? 'Есть' : 'Критично'}
                        </span>
                      </span>
                      <span className={`text-sm font-semibold ${row.count === 0 ? 'text-emerald-600' : row.count <= 3 ? 'text-amber-600' : 'text-red-600'}`}>{row.count}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">142 документа</p>
                  <p className="text-xs text-slate-400">Проверено за месяц</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}