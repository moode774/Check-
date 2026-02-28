import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Building2, FileText, CreditCard, Users, Settings, 
  PlusCircle, Home, LogOut, ChevronLeft, Bell, Search, Filter, 
  CheckCircle2, Clock, AlertCircle, TrendingUp, DollarSign, Briefcase, Star
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { User, Property, Contract, Payment } from "../types";

const Sidebar = ({ user }: { user: User }) => {
  const location = useLocation();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "الرئيسية", path: "/dashboard" },
    ...(user.role === 'owner' || user.role === 'agent' ? [
      { icon: <Building2 size={20} />, label: "عقاراتي", path: "/dashboard/properties" },
      { icon: <PlusCircle size={20} />, label: "إضافة عقار", path: "/dashboard/add-property" },
    ] : []),
    { icon: <FileText size={20} />, label: "عقودي", path: "/dashboard/contracts" },
    { icon: <CreditCard size={20} />, label: "المدفوعات", path: "/dashboard/payments" },
    ...(user.role === 'admin' ? [
      { icon: <Users size={20} />, label: "المستخدمين", path: "/dashboard/users" },
      { icon: <Settings size={20} />, label: "الإعدادات", path: "/dashboard/settings" },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-primary text-white hidden lg:flex flex-col sticky top-20 h-[calc(100vh-5rem)]">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold">
            {user.name[0]}
          </div>
          <div>
            <div className="font-bold text-sm truncate w-32">{user.name}</div>
            <div className="text-xs text-white/50">{user.role === 'owner' ? 'مالك' : user.role === 'tenant' ? 'مستأجر' : user.role === 'agent' ? 'مندوب' : 'مدير'}</div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? "bg-accent text-primary font-bold" 
                : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/10">
        <button 
          onClick={() => { api.auth.logout(); window.location.href = "/"; }}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

const Overview = ({ user }: { user: User }) => {
  const [aiTip, setAiTip] = useState("جاري تحميل النصيحة الذكية...");
  const stats = [
    { label: "عقود نشطة", value: "3", icon: <FileText className="text-blue-500" />, trend: "+12%" },
    { label: "إجمالي المدفوعات", value: "450,000 ريال", icon: <DollarSign className="text-green-500" />, trend: "+5%" },
    { label: "عقارات معروضة", value: "5", icon: <Building2 className="text-purple-500" />, trend: "0%" },
    { label: "طلبات معلقة", value: "2", icon: <Clock className="text-orange-500" />, trend: "-2%" },
  ];

  useEffect(() => {
    fetch("/api/ai/tips", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => res.json())
    .then(data => setAiTip(data.tip))
    .catch(() => setAiTip("العقارات في حي حدة تشهد طلباً متزايداً بنسبة 15% هذا الشهر. فكر في تحديث أسعارك."));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-primary">لوحة التحكم</h1>
        <div className="flex gap-4">
          <button className="p-2 bg-white border border-black/5 rounded-lg text-primary/60 hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          <div className="text-sm text-primary/60">
            آخر تحديث: {new Date().toLocaleDateString('ar-YE')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="luxury-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surface rounded-xl">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 
                stat.trend.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {stat.trend}
              </span>
            </div>
            <div className="text-2xl font-display font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-primary/60">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 luxury-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-bold">آخر النشاطات</h3>
            <button className="text-accent font-bold text-sm hover:underline">عرض الكل</button>
          </div>
          <div className="space-y-6">
            {[
              { type: 'payment', title: 'تم استلام دفعة إيجار', desc: 'شقة حي حدة - شهر فبراير', time: 'منذ ساعتين', status: 'success' },
              { type: 'contract', title: 'عقد جديد بانتظار التوقيع', desc: 'فيلا مدينة الأصبحي', time: 'منذ 5 ساعات', status: 'pending' },
              { type: 'review', title: 'تقييم جديد لعقارك', desc: '5 نجوم من المستأجر أحمد', time: 'أمس', status: 'info' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start p-4 hover:bg-surface rounded-xl transition-colors cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.status === 'success' ? 'bg-green-100 text-green-600' :
                  activity.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'payment' ? <CreditCard size={18} /> : activity.type === 'contract' ? <FileText size={18} /> : <Star size={18} />}
                </div>
                <div className="flex-grow">
                  <div className="font-bold text-primary">{activity.title}</div>
                  <div className="text-sm text-primary/60">{activity.desc}</div>
                </div>
                <div className="text-xs text-primary/40 whitespace-nowrap">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="luxury-card p-8">
          <h3 className="text-xl font-display font-bold mb-8">توزيع العقارات</h3>
          <div className="space-y-6">
            {[
              { label: 'شقق', count: 12, color: 'bg-blue-500' },
              { label: 'فيلات', count: 4, color: 'bg-purple-500' },
              { label: 'مكاتب', count: 8, color: 'bg-accent' },
              { label: 'أراضي', count: 2, color: 'bg-green-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-primary">{item.label}</span>
                  <span className="text-primary/60">{item.count} عقار</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 26) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 bg-primary rounded-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-accent" />
              <span className="font-bold">نصيحة ذكية</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {aiTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertiesManager = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.properties.getAll().then(data => {
      setProperties(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-primary">إدارة العقارات</h1>
        <Link to="/dashboard/add-property" className="luxury-button flex items-center gap-2">
          <PlusCircle size={20} />
          إضافة عقار جديد
        </Link>
      </div>

      <div className="luxury-card overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
            <input type="text" placeholder="ابحث في عقاراتك..." className="w-full pr-12 pl-4 py-3 bg-surface border border-black/5 rounded-xl focus:outline-none" />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-black/5 rounded-xl hover:bg-surface transition-colors">
              <Filter size={18} />
              تصفية
            </button>
            <select className="flex-grow md:flex-none px-4 py-3 border border-black/5 rounded-xl bg-white focus:outline-none">
              <option>الأحدث أولاً</option>
              <option>الأعلى سعراً</option>
              <option>الأقل سعراً</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface text-primary/60 text-sm font-bold">
              <tr>
                <th className="p-6">العقار</th>
                <th className="p-6">النوع</th>
                <th className="p-6">السعر</th>
                <th className="p-6">الموقع</th>
                <th className="p-6">الحالة</th>
                <th className="p-6">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="p-10 bg-white/50" />
                  </tr>
                ))
              ) : properties.map((p) => (
                <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-bold text-primary">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-6 text-primary/60">{p.type}</td>
                  <td className="p-6 font-bold text-primary">{p.price.toLocaleString()} ريال</td>
                  <td className="p-6 text-primary/60">{p.city}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.status === 'available' ? 'bg-green-100 text-green-700' :
                      p.status === 'rented' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {p.status === 'available' ? 'متاح' : p.status === 'rented' ? 'مؤجر' : 'محجوز'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-primary/40 hover:text-primary transition-colors"><Settings size={18} /></button>
                      <button className="p-2 text-primary/40 hover:text-red-500 transition-colors"><LogOut size={18} className="rotate-180" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(api.auth.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar user={user} />
      <main className="flex-grow p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Overview user={user} />} />
          <Route path="/properties" element={<PropertiesManager />} />
          <Route path="/add-property" element={<div className="luxury-card p-10">قريباً: نموذج إضافة عقار متطور</div>} />
          <Route path="/contracts" element={<div className="luxury-card p-10">قريباً: إدارة العقود الرقمية</div>} />
          <Route path="/payments" element={<div className="luxury-card p-10">قريباً: سجل المدفوعات والتحصيل</div>} />
        </Routes>
      </main>
    </div>
  );
}
