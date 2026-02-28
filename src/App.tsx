import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="text-accent w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight text-primary">سكن يمن</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-primary/70 hover:text-primary font-medium transition-colors">الرئيسية</Link>
            <Link to="/search" className="text-primary/70 hover:text-primary font-medium transition-colors">ابحث عن عقار</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="luxury-button flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  لوحة التحكم
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  <LogOut size={18} />
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-primary font-medium hover:text-accent transition-colors">تسجيل الدخول</Link>
                <Link to="/register" className="luxury-button">إنشاء حساب</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-primary hover:bg-surface rounded-lg">الرئيسية</Link>
              <Link to="/search" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-primary hover:bg-surface rounded-lg">ابحث عن عقار</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-primary hover:bg-surface rounded-lg">لوحة التحكم</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-right px-3 py-4 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg">خروج</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-primary hover:bg-surface rounded-lg">تسجيل الدخول</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-lg font-medium text-primary bg-primary text-white rounded-lg">إنشاء حساب</Link>
                </>
              )}
            </div>
          </motion.div>
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
