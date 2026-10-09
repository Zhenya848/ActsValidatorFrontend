import { motion } from 'framer-motion';
import { Check, Gift } from 'lucide-react';

const perks = [
  '3 бесплатные сверки сразу после регистрации',
  'Без привязки карты — пробуйте без рисков'
];

export default function RegisterCta() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-6">
          <Gift className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Что вы получите при регистрации</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {perks.map((perk, i) => (
            <motion.div
              key={perk}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-2xl bg-white border border-slate-200 px-4 py-3.5"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{perk}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}