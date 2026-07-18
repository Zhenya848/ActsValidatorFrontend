import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../shared/utils';
import { Sparkles, X, ArrowRight, Gift } from 'lucide-react';

interface IWelcomeBannerInfo {
    visible: boolean;
}

export default function WelcomeBanner({ visible }: IWelcomeBannerInfo) {
    const [isVisible, setIsVisible] = useState(visible);

    const handleDisable = () => setIsVisible(false);

    if (!isVisible)
        return;

    return (
    <AnimatePresence>
        <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="max-w-7xl mx-auto px-6 pt-4"
        >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-5 shadow-lg shadow-indigo-200">
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute right-16 bottom-0 w-20 h-20 rounded-full bg-white/10" />
            <button onClick={handleDisable} className="absolute top-3 right-3 w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/80" />
            </button>
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Добро пожаловать!
                </h3>
                <p className="text-sm text-white/80 mt-1">
                Вам бесплатно доступно <span className="font-semibold text-white">3 сверки</span>. Загрузите документы и начните работу прямо сейчас.
                </p>
            </div>
            <Link to={createPageUrl('upload')} onClick={handleDisable} className="flex-shrink-0">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm">
                Начать сверку
                <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
            </div>
        </div>
        </motion.div>
    </AnimatePresence>
    );
}