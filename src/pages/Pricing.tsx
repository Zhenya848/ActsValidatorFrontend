import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { PricesLanding } from '../widgets/components/prices/PricesLanding';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Тарифы</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Простые цены
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Выберите удобный тариф
          </p>
        </motion.div>

        <PricesLanding />
      </div>
    </div>
  );
}