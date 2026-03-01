import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, Search, LayoutDashboard, LogIn, UserPlus, Building2, MapPin, Phone, Mail, Menu, X, LogOut, ChevronRight, Star, ShieldCheck, CreditCard, FileText, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "./lib/api";
import { User } from "./types";

// Pages
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import PropertyDetailsPage from "./pages/PropertyDetails";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(api.auth.getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    setUser(api.auth.getCurrentUser());
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-black/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-primary/20">
                <Building2 className="text-accent w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-display font-bold tracking-tight text-primary leading-none">سكن يمن</span>
                <span className="text-[10px] md:text-xs font-medium text-accent uppercase tracking-[0.2em] leading-none mt-1">Real Estate</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className={`font-medium transition-all hover:text-accent ${location.pathname === '/' ? 'text-accent' : 'text-primary/70'}`}>الرئيسية</Link>
            <Link to="/search" className={`font-medium transition-all hover:text-accent ${location.pathname === '/search' ? 'text-accent' : 'text-primary/70'}`}>ابحث عن عقار</Link>
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="luxury-button flex items-center gap-2 py-3 px-6 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95">
                  <LayoutDashboard size={18} />
                  لوحة التحكم
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1 transition-colors px-2 py-1">
                  <LogOut size={18} />
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-primary font-bold hover:text-accent transition-colors">تسجيل الدخول</Link>
                <Link to="/register" className="luxury-button py-3 px-8 shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95">إنشاء حساب</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-primary hover:bg-surface rounded-xl transition-colors active:scale-90"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={30} strokeWidth={2.5} /> : <Menu size={30} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[-1]"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-[32px] border-t border-black/5 overflow-hidden z-[50]"
            >
              <div className="px-6 py-8 space-y-4">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-4 text-xl font-bold text-primary hover:bg-surface rounded-2xl transition-all active:scale-95">
                  الرئيسية
                  <ChevronRight size={20} className="text-accent" />
                </Link>
                <Link to="/search" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-5 py-4 text-xl font-bold text-primary hover:bg-surface rounded-2xl transition-all active:scale-95">
                  ابحث عن عقار
                  <ChevronRight size={20} className="text-accent" />
                </Link>

                <div className="pt-6 border-t border-black/5 mt-4 space-y-4">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-3 w-full luxury-button py-5 text-lg rounded-2xl shadow-xl shadow-primary/10">
                        <LayoutDashboard size={22} />
                        لوحة التحكم
                      </Link>
                      <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 py-4 text-lg font-bold text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                        <LogOut size={22} />
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full py-5 text-xl font-bold text-primary border-2 border-primary/10 rounded-2xl hover:bg-surface transition-all">
                        تسجيل الدخول
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full luxury-button py-5 text-xl rounded-2xl shadow-xl shadow-primary/10">
                        إنشاء حساب مجاني
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Building2 className="text-primary w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight text-white">سكن يمن</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              المنصة الرقمية الأولى لإدارة وإيجار العقارات في اليمن. نهدف إلى حماية حقوق الجميع وتوفير تجربة تأجير آمنة وشفافة.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-accent">روابط سريعة</h4>
            <ul className="space-y-4 text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">البحث عن عقار</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">انضم كمندوب</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">عن المنصة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-accent">تواصل معنا</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-3"><MapPin size={18} className="text-accent" /> صنعاء، اليمن</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-accent" /> +967 777 000 000</li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-accent" /> info@sakanyemen.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-accent">النشرة الإخبارية</h4>
            <p className="text-white/60 mb-4">اشترك ليصلك جديد العقارات والعروض.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="بريدك الإلكتروني" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-accent" />
              <button className="bg-accent text-primary px-4 py-2 rounded-lg font-bold">اشترك</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2026 سكن يمن. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-white">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const basename = import.meta.env.PROD ? '/Check-' : '';

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard/*" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
