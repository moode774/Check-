import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Phone, Building2, Shield, UserCircle, Briefcase, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { UserRole } from "../types";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<UserRole>((searchParams.get("role") as UserRole) || "tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.auth.register({ name, email, password, role, phone });
      await api.auth.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("حدث خطأ أثناء إنشاء الحساب. تأكد من صحة البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full luxury-card p-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="text-accent w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">إنشاء حساب جديد</h1>
          <p className="text-primary/60">انضم إلى مجتمع سكن يمن اليوم</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { id: "tenant", label: "مستأجر", icon: <UserCircle size={20} /> },
            { id: "owner", label: "مالك عقار", icon: <Shield size={20} /> },
            { id: "agent", label: "مندوب", icon: <Briefcase size={20} /> },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id as UserRole)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === r.id ? "border-accent bg-accent/5 text-primary" : "border-black/5 text-primary/40 hover:border-black/10"
              }`}
            >
              {r.icon}
              <span className="font-bold text-sm">{r.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-primary mb-2">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="text" 
                required
                className="w-full pr-12 pl-4 py-4 bg-surface border border-black/5 rounded-xl focus:outline-none focus:border-accent font-medium"
                placeholder="الاسم الثلاثي"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
            <label className="block text-sm font-bold text-primary mb-2">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="tel" 
                required
                className="w-full pr-12 pl-4 py-4 bg-surface border border-black/5 rounded-xl focus:outline-none focus:border-accent font-medium"
                placeholder="777 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
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

          <div className="md:col-span-2">
            <p className="text-sm text-primary/60 mb-6">
              بالنقر على "إنشاء حساب"، فإنك توافق على <Link to="/terms" className="text-accent font-bold">شروط الاستخدام</Link> و <Link to="/privacy" className="text-accent font-bold">سياسة الخصوصية</Link>.
            </p>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full luxury-button py-4 text-lg bg-primary text-white hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? "جاري التحميل..." : "إنشاء حساب"}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-10 border-t border-black/5 text-center">
          <p className="text-primary/60">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-accent font-bold hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
