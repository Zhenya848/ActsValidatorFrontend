import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AiStatusBannerParameters {
  aiReady: boolean,
  aiOnlyCount: number
}

export default function AIStatusBanner({ aiReady, aiOnlyCount }: AiStatusBannerParameters) {
  return (
    <motion.div
      key={aiReady ? 'ready' : 'loading'}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
        aiReady
          ? 'bg-violet-50 border-violet-200 text-violet-800'
          : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}
    >
      {aiReady ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
          <span>
            <span className="font-semibold">ИИ-проверка завершена.</span>{' '}
            {aiOnlyCount > 0
              ? `Дополнительно найдено ${aiOnlyCount} расхождения, которые пропустил алгоритм.`
              : 'ИИ не нашёл дополнительных расхождений.'}
          </span>
        </>
      ) : (
        <>
          <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin flex-shrink-0" />
          <span>
            <span className="font-semibold">ИИ-анализ в процессе...</span>{' '}
            Результаты алгоритма уже доступны. ИИ-проверка займёт ещё несколько секунд.
          </span>
          <Sparkles className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0" />
        </>
      )}
    </motion.div>
  );
}