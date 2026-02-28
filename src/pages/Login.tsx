import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Building2, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.auth.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full luxury-card p-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="text-accent w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">تسجيل الدخول</h1>
          <p className="text-primary/60">مرحباً بك مجدداً في سكن يمن</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="email" 
                required
                className="w-full pr-12 pl-4 py-4 bg-surface border border-black/5 rounded-xl focus:outline-none focus:border-accent font-medium"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="password" 
                required
                className="w-full pr-12 pl-4 py-4 bg-surface border border-black/5 rounded-xl focus:outline-none focus:border-accent font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-black/5 text-accent focus:ring-accent" />
              <span className="text-primary/60">تذكرني</span>
            </label>
            <Link to="/forgot-password" className="text-accent font-bold hover:underline">نسيت كلمة المرور؟</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full luxury-button py-4 text-lg bg-primary text-white hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? "جاري التحميل..." : "دخول"}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-black/5 text-center">
          <p className="text-primary/60">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-accent font-bold hover:underline">إنشاء حساب جديد</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
