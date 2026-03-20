import { motion } from 'framer-motion';
import { UploadLabel } from '../widgets/components/upload/UploadLable';

export default function Upload() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <UploadLabel />
        </motion.div>
      </div>
    </div>
  );
}