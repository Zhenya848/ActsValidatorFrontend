import { motion } from 'framer-motion';
import { FileCheck, AlertTriangle, FileSpreadsheet, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Всего загрузок', value: '48', change: '+12 за месяц', icon: FileSpreadsheet, color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Успешных сверок', value: '39', change: '81% от общего', icon: FileCheck, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'С расхождениями', value: '9', change: '19% от общего', icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
  { label: 'Средняя точность', value: '97.2%', change: '+1.3% за месяц', icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
];

export default function HistoryStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:shadow-slate-100 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}