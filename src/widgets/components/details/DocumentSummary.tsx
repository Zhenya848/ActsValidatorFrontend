import { motion } from 'framer-motion';
import { FileSpreadsheet, Calendar, Building2, Rows3, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Collation } from '../../../entities/collations/Collation';
import { formatDate } from '../../../shared/helpers/formatDate';

interface IDocumentSummaryInfo {
    collation: Collation;
}

export default function DocumentSummary({ collation }: IDocumentSummaryInfo) {
  const items = [
    { icon: FileSpreadsheet, label: 'Файл', value: collation.act1Name, color: 'text-indigo-500 bg-indigo-50' },
    { icon: Building2, label: 'Контрагент', value: collation.act2Name, color: 'text-violet-500 bg-violet-50' },
    { icon: Calendar, label: 'Дата загрузки', value: formatDate(collation.createdAt), color: 'text-slate-500 bg-slate-100' },
    { icon: Rows3, label: 'Всего строк', value: collation.rowsProcessed, color: 'text-cyan-500 bg-cyan-50' },
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
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
              style={{ width: `${(collation.coincidencesCount * 2 / collation.rowsProcessed * 100).toFixed(1)}%` }} />
          </div>
          <span className="text-sm font-bold text-emerald-600">{(collation.coincidencesCount * 2 / collation.rowsProcessed * 100).toFixed(1)}%</span>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600"><span className="font-semibold">{collation.coincidencesCount}</span> совпадений</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-600"><span className="font-semibold">{collation.collationErrors.length}</span> расхождений</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}