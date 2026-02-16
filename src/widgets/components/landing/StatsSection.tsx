import React from 'react';
import { motion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '10,000+', label: 'Документов обработано' },
  { value: '99.8%', label: 'Точность анализа' },
  { value: '< 5 сек', label: 'Время обработки' },
  { value: '500+', label: 'Активных пользователей' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-indigo-200 text-sm sm:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}