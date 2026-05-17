import { motion } from 'framer-motion';
import type { Discrepancy } from '../../../entities/collations/Discrepancy';

const SEVERITY_DOT = {
  high: 'bg-rose-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-300',
};

interface DiscrepancyCardParameters {
  item: Discrepancy,
  index: number
}

const getSeverity = (severity: string) => {
  if (severity === "high")
    return "high";
  
  if (severity === "medium")
    return "medium";

  return "low";
}

export default function DiscrepancyCard({ item, index }: DiscrepancyCardParameters) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        className="flex items-start gap-4 p-5 cursor-pointer hover:bg-slate-50/60 transition-colors"
      >
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT[getSeverity(item.severity)]}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-slate-800">
              Строки {item.act1Row ?? 0}/{item.act2Row ?? 0} — {item.field}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-slate-500">Акт 1: <span className="font-medium text-slate-800">{item.act1Value}</span></span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-500">Акт 2: <span className="font-medium text-rose-600">{item.act2Value}</span></span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Разница: {item.difference}</p>
        </div>
      </div>
    </motion.div>
  );
}