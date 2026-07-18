import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from "../../../shared/ui/badge";
import type { Collation } from '../../../entities/collations/Collation';

interface IDiscrepancyListInfo {
    collation: Collation;
}

const FIELD_FILTERS = [
  { key: 'all', label: 'Все поля' },
  { key: 'amount', label: 'По сумме' },
  { key: 'date', label: 'По дате' },
  { key: 'none', label: 'Отсутствующие' },
  { key: 'docNumber', label: 'По номеру документа' },
];

const FIELD_MAP: Record<string, string[]> = {
  amount: ['сумма', 'дебет', 'кредит'],
  date: ['дата'],
  docNumber: ['документ'],
  none: ['отсутствует']
};

interface SeverityItem {
  label: string;
  classes: string;
  icon: string;
  iconColor: string;
  diff: string;
}

const severityConfig: Record<string, SeverityItem> = {
  high: { label: 'Критично', classes: 'bg-red-50 text-red-700 border-red-200', icon: 'bg-red-50', iconColor: 'text-red-500', diff: 'text-red-600' },
  medium: { label: 'Средне', classes: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'bg-amber-50', iconColor: 'text-amber-500', diff: 'text-amber-600' },
  low: { label: 'Низкая', classes: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'bg-blue-50', iconColor: 'text-blue-500', diff: 'text-blue-600' },
};

export default function DiscrepancyList({ collation }: IDiscrepancyListInfo) {
  const [fieldFilter, setFieldFilter] = useState('all');

  const visibleItems = collation.collationErrors.filter((d) => {
    return fieldFilter === 'all' || FIELD_MAP[fieldFilter]?.includes(d.field.toLowerCase());
  });

  return (
    <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-5">
            {FIELD_FILTERS.map((f) => {
                const count = f.key === 'all'
                ? collation.collationErrors.length
                : collation.collationErrors.filter((d) =>
                    FIELD_MAP[f.key]?.includes(d.field)
                    ).length;
                return (
                <button
                    key={f.key}
                    onClick={() => setFieldFilter(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                    fieldFilter === f.key
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {f.label} <span className="ml-1 opacity-70">{count}</span>
                </button>
                );
            })}
        </div>

        {visibleItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-400">
            Нет расхождений в этой категории
            </div>
        ) : (
            <div className="space-y-3">
                {visibleItems.map((item, i) => {
                    const sev = severityConfig[item.severity];
                    
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:shadow-slate-100 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${sev.icon}`}>
                                        <AlertTriangle className={`w-4 h-4 ${sev.iconColor}`} />
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 max-w-[180px] truncate min-w-0" title={collation.act1Name}>{collation.act1Name}</span>
                                            {item.act1Row ? (
                                            <span className="text-sm font-semibold text-slate-800">стр. {item.act1Row}</span>
                                            ) : (
                                            <span className="text-sm font-semibold text-red-500">нет записи</span>
                                            )}
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-violet-50 text-violet-700 max-w-[180px] truncate min-w-0" title={collation.act2Name}>{collation.act2Name}</span>
                                            {item.act2Row ? (
                                            <span className="text-sm font-semibold text-slate-800">стр. {item.act2Row}</span>
                                            ) : (
                                            <span className="text-sm font-semibold text-red-500">нет записи</span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400 mt-0.5">Поле: {item.field}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`${sev.classes} border text-xs font-medium w-fit`}>{sev.label}</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 rounded-lg p-4">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">
                                        {item.act1Row ? `${collation.act1Name} (стр. ${item.act1Row})` : collation.act1Name}
                                    </p>

                                    <p className={`text-sm font-semibold ${!item.act1Row ? 'text-red-500' : 'text-slate-700'}`}>{item.act1Value}</p>
                                </div>

                                <div className="flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-slate-300" />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 mb-1">
                                        {item.act2Row ? `${collation.act2Name} (стр. ${item.act2Row})` : collation.act2Name}
                                    </p>

                                    <p className={`text-sm font-semibold ${!item.act2Row ? 'text-red-500' : 'text-slate-700'}`}>{item.act2Value}</p>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Расхождение:</span>
                                    <span className={`text-xs font-bold ${sev.diff}`}>{item.difference}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        )}
    </div>
  );
}