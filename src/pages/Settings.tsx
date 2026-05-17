import { motion } from 'framer-motion';
import { SettingsLayout } from '../widgets/components/settings/SettingsLayout';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SettingsLayout />
        </motion.div>
      </div>
    </div>
  );
}