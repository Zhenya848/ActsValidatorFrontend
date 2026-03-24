import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Discrepancy } from '../../../entities/collations/Discrepancy';

const SOURCE_CONFIG = {
  both: { label: 'Алгоритм + ИИ', className: 'bg-rose-100 text-rose-700 border-rose-200' },
  algorithm: { label: 'Только алгоритм', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  ai: { label: 'Только ИИ', className: 'bg-violet-100 text-violet-700 border-violet-200' },
};

const SEVERITY_DOT = {
  high: 'bg-rose-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-300',
};

const getSource = (detectedBy: string[]) => {
  const hasAlgo = detectedBy.includes('algorithm');
  const hasAI = detectedBy.includes('ai');
  if (hasAlgo && hasAI) return 'both';
  if (hasAlgo) return 'algorithm';
  return 'ai';
};

interface DiscrepancyCardParameters {
  item: Discrepancy,
  index: number,
  aiReady: boolean
}

const getSeverity = (severity: string) => {
  if (severity === "high")
    return "high";
  
  if (severity === "medium")
    return "medium";

  return "low";
}

export default function DiscrepancyCard({ item, index, aiReady }: DiscrepancyCardParameters) {
  const [expanded, setExpanded] = useState(false);
  const source = getSource(item.detectedBy);
  const badge = SOURCE_CONFIG[source];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        className="flex items-start gap-4 p-5 cursor-pointer hover:bg-slate-50/60 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT[getSeverity(item.severity)]}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-slate-800">
              Строки {item.act1Row}/{item.act2Row} — {item.field}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-slate-500">Акт 1: <span className="font-medium text-slate-800">{item.act1Value}</span></span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">Акт 2: <span className="font-medium text-rose-600">{item.act2Value}</span></span>
          </div>
          {item.difference && (
            <p className="text-xs text-slate-400 mt-1">Разница: {item.difference}</p>
          )}
        </div>
        <button className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && item.detectedBy.includes('ai') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-100 px-5 py-4 bg-slate-50/50"
        >
          {aiReady ? (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">🤖</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-700 mb-0.5">ИИ-комментарий</p>
                <p className="text-sm text-slate-600">{'Расхождение подтверждено ИИ-анализом.'}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 rounded-full border-2 border-violet-300 border-t-transparent animate-spin" />
              ИИ-анализ этой строки в процессе...
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}