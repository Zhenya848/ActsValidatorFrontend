import { motion } from 'framer-motion';
import { EmailVerifiedLabel } from '../widgets/components/emailVerification/EmailVerifiedLabel';

export default function EmailVerified() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <EmailVerifiedLabel />
      </motion.div>
    </div>
  );
}