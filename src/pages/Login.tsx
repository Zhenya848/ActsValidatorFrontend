import { motion } from "framer-motion";
import { LoginLayout } from "../widgets/components/auth/LoginLayout";

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <LoginLayout />
            </motion.div>
        </div>
    )
}