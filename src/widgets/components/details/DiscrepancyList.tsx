import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from "../../../shared/ui/badge";

const mockDiscrepancies = [
  { id: 1, ourDocumentRow: 45, theirDocumentRow: 125, field: 'Дебет', ourValue: '125 400,00 ₽', theirValue: '124 500,00 ₽', difference: '900,00 ₽', severity: 'high', detectedBy: ['algorithm', 'ai'], date: '15.01.2026' },
  { id: 2, ourDocumentRow: 128, theirDocumentRow: 130, field: 'Дата операции', ourValue: '15.12.2025', theirValue: '16.12.2025', difference: '1 день', severity: 'low', detectedBy: ['algorithm', 'ai'], date: '15.12.2025' },
  { id: 3, ourDocumentRow: 256, theirDocumentRow: 248, field: 'Кредит', ourValue: '78 400,00 ₽', theirValue: '78 200,00 ₽', difference: '200,00 ₽', severity: 'medium', detectedBy: ['ai'], date: '20.12.2025' },
  { id: 4, ourDocumentRow: 312, theirDocumentRow: 315, field: 'Дебет', ourValue: '45 000,00 ₽', theirValue: '44 800,00 ₽', difference: '200,00 ₽', severity: 'medium', detectedBy: ['algorithm'], date: '22.12.2025' },
  { id: 5, ourDocumentRow: 489, theirDocumentRow: 492, field: 'Кредит', ourValue: '20 900,00 ₽', theirValue: '19 166,67 ₽', difference: '1 733,33 ₽', severity: 'high', detectedBy: ['algorithm', 'ai'], date: '28.12.2025' },
];

type severityType = {
    label: string,
    classes: string
}

const severityConfig: Record<string, severityType> = {
  high: { label: 'Критично', classes: 'bg-red-50 text-red-700 border-red-200' },
  medium: { label: 'Средне', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  low: { label: 'Низкая', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
};

export default function DiscrepancyList() {
  return (
    <div className="space-y-3">
      {mockDiscrepancies.map((item, i) => {
        const sev = severityConfig[item.severity];
        return (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:shadow-slate-100 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  item.severity === 'high' ? 'bg-red-50' : item.severity === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    item.severity === 'high' ? 'text-red-500' : item.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">Стр. {item.ourDocumentRow} / {item.theirDocumentRow}</p>
                    <span className="text-xs text-slate-300">•</span>
                    <p className="text-xs text-slate-400">{item.date}</p>
                  </div>
                  <p className="text-xs text-slate-400">Поле: {item.field}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${sev.classes} border text-xs font-medium w-fit`}>{sev.label}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Наш документ (стр. {item.ourDocumentRow})</p>
                <p className="text-sm font-semibold text-slate-700">{item.ourValue}</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-slate-300 rotate-0 sm:rotate-0" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Документ контрагента (стр. {item.theirDocumentRow})</p>
                <p className="text-sm font-semibold text-slate-700">{item.theirValue}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Расхождение:</span>
                <span className={`text-xs font-bold ${item.severity === 'high' ? 'text-red-600' : item.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'}`}>
                  {item.difference}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Обнаружено:</span>
                {item.detectedBy.includes('algorithm') && (
                  <div className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                    <span className="text-xs font-medium text-indigo-700">Алгоритм</span>
                  </div>
                )}
                {item.detectedBy.includes('ai') && (
                  <div className="px-2 py-0.5 rounded bg-violet-50 border border-violet-100">
                    <span className="text-xs font-medium text-violet-700">ИИ</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}