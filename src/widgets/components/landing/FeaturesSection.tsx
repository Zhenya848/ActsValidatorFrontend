import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, BarChart3, Clock, Shield, FileCheck } from 'lucide-react';

const features = [
  { icon: Upload, title: 'Быстрая загрузка', description: 'Перетащите Excel-файл или выберите из папки — загрузка занимает секунды.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Search, title: 'Двойная проверка ИИ + Алгоритм', description: 'Сверка документов двумя методами: нейросеть и классический алгоритм для максимальной точности.', color: 'bg-violet-50 text-violet-600' },
  { icon: BarChart3, title: 'Наглядные отчёты', description: 'Визуализация результатов сверки с детализацией по каждой строке.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Clock, title: 'История операций', description: 'Полный журнал загрузок с возможностью просмотра предыдущих сверок.', color: 'bg-amber-50 text-amber-600' },
  { icon: Shield, title: 'Безопасность данных', description: 'Все документы защищены шифрованием и доступны только вам.', color: 'bg-rose-50 text-rose-600' },
  { icon: FileCheck, title: 'Поддержка форматов', description: 'Работа с XLS, XLSX и CSV файлами любой структуры.', color: 'bg-cyan-50 text-cyan-600' },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Возможности</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Всё для удобной сверки</h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Инструменты, которые экономят часы работы бухгалтера</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100">
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}