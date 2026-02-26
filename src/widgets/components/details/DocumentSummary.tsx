import { motion } from 'framer-motion';
import { FileSpreadsheet, Calendar, Building2, Rows3, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DocumentSummary() {
  const info = {
    fileName: 'Сверка_ООО_Лютик.xlsx',
    counterparty: 'ООО "Лютик"',
    uploadDate: '05 фев 2026, 10:15',
    period: 'Q4 2025',
    totalRows: 856,
    matchedRows: 853,
    discrepancies: 3,
  };

  const items = [
    { icon: FileSpreadsheet, label: 'Файл', value: info.fileName, color: 'text-indigo-500 bg-indigo-50' },
    { icon: Building2, label: 'Контрагент', value: info.counterparty, color: 'text-violet-500 bg-violet-50' },
    { icon: Calendar, label: 'Дата загрузки', value: info.uploadDate, color: 'text-slate-500 bg-slate-100' },
    { icon: Rows3, label: 'Всего строк', value: info.totalRows.toLocaleString(), color: 'text-cyan-500 bg-cyan-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white border border-slate-200 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-slate-800 truncate">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Результат сверки</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-indigo-700">Алгоритм</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-100">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-xs font-medium text-violet-700">ИИ</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
              style={{ width: `${(info.matchedRows / info.totalRows * 100).toFixed(1)}%` }} />
          </div>
          <span className="text-sm font-bold text-emerald-600">{(info.matchedRows / info.totalRows * 100).toFixed(1)}%</span>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600"><span className="font-semibold">{info.matchedRows}</span> совпадений</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-600"><span className="font-semibold">{info.discrepancies}</span> расхождений</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}