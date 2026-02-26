import { motion } from 'framer-motion';
import UploadZone from '../widgets/components/upload/UploadZone';
import { FileSpreadsheet, Info } from 'lucide-react';

export default function Upload() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">Загрузка документов</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Загрузите акт сверки
            </h1>
            <p className="mt-3 text-lg text-slate-500 max-w-xl">
              Выберите или перетащите файлы Excel для автоматического анализа и&nbsp;поиска расхождений
            </p>
          </div>

          <UploadZone />

          <div className="mt-8 bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 flex gap-4">
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-700/80 space-y-1">
              <p className="font-medium text-indigo-800">Как это работает?</p>
              <p>Загрузите файл акта сверки в формате Excel. Система использует двойную проверку: ИИ и классический алгоритм сравнят дебет, кредит и даты операций. Если оба метода совпадают — сверка успешна, при расхождениях покажем детальный отчёт.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}