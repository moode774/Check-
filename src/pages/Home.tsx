import { useState, useEffect } from "react";
import { Search, MapPin, Building2, ShieldCheck, CreditCard, FileText, Star, ChevronLeft, ArrowRight, Users, Home as HomeIcon, Briefcase, Landmark } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Property } from "../types";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?city=${searchQuery}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Real Estate"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-transparent md:hidden" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto md:mx-0 text-center md:text-right">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-accent/20 text-accent font-bold text-sm mb-6 uppercase tracking-widest border border-accent/30"
            >
              المنصة الأولى في اليمن
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-8 leading-[1.1] tracking-tight">
              جد منزلك المثالي في <br />
              <span className="text-accent underline decoration-white/10 underline-offset-8">اليمن</span> بكل سهولة
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto md:mr-0 md:ml-auto">
              حماية كاملة لحقوق المالك والمستأجر، دفع إلكتروني عبر المحافظ المحلية، وعقود موثقة رسمياً.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-3 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 max-w-2xl mx-auto md:mr-0 group shadow-2xl shadow-black/40">
              <div className="flex-grow flex items-center gap-3 px-6 py-5 bg-white rounded-[24px] focus-within:ring-2 ring-accent/50 transition-all shadow-inner">
                <MapPin className="text-accent" size={24} />
                <input
                  type="text"
                  placeholder="المدينة أو الحي (صنعاء، عدن...)"
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-primary font-bold text-lg placeholder:text-primary/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="luxury-button py-5 px-12 text-xl bg-accent text-primary hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20">
                <Search size={24} strokeWidth={3} />
                ابحث الآن
              </button>
            </form>

            <div className="mt-16 flex flex-wrap justify-center md:justify-start gap-10 md:gap-16">
              {[
                { label: "عقود موثقة", val: "100%", icon: <ShieldCheck /> },
                { label: "دفع رقمي", val: "آمن", icon: <CreditCard /> },
                { label: "مستخدم نشط", val: "+5k", icon: <Users /> }
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent/20 group-hover:border-accent transition-all duration-500 transform group-hover:rotate-6">
                    <div className="text-accent">{stat.icon}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-2xl group-hover:text-accent transition-colors">{stat.val}</div>
                    <div className="text-white/40 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      title: "عقود رقمية موثقة",
      desc: "نظام عقود متكامل يضمن حقوق الطرفين قانونياً مع إمكانية التوقيع الرقمي.",
      icon: <FileText className="w-10 h-10 text-accent" />,
    },
    {
      title: "دفع إلكتروني محلي",
      desc: "ادفع إيجارك عبر المحافظ الإلكترونية اليمنية (كاش، وان كاش) بكل سهولة.",
      icon: <CreditCard className="w-10 h-10 text-accent" />,
    },
    {
      title: "إدارة شاملة للملاك",
      desc: "لوحة تحكم متطورة لمتابعة العقارات، المستأجرين، والتحصيلات المالية.",
      icon: <Building2 className="w-10 h-10 text-accent" />,
    },
    {
      title: "نظام وساطة معتمد",
      desc: "مناديب ووسطاء عقاريين معتمدين لضمان أفضل خدمة ومعاينة للعقارات.",
      icon: <Users className="w-10 h-10 text-accent" />,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-black text-primary mb-6"
          >
            لماذا تختار <span className="text-accent">سكن يمن</span>؟
          </motion.h2>
          <p className="text-primary/60 max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            نحن ندمج التراث العقاري اليمني مع أحدث تقنيات الإدارة والأمان الرقمي لتوفير تجربة لا مثيل لها.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="p-10 luxury-card text-center group border-2 border-transparent hover:border-accent/10 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-surface rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:bg-accent ring-8 ring-transparent group-hover:ring-accent/10 transition-all duration-500">
                <div className="group-hover:text-white transition-colors duration-500">{f.icon}</div>
              </div>
              <h3 className="text-2xl font-display font-black mb-4 group-hover:text-accent transition-colors">{f.title}</h3>
              <p className="text-primary/60 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.properties.getAll({ limit: 6 }).then(data => {
      setProperties(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 sm:py-32 bg-surface relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center sm:items-end gap-8 mb-16">
          <div className="text-center md:text-right">
            <h2 className="text-4xl md:text-6xl font-display font-black text-primary mb-6 text-gradient">عقارات مميزة</h2>
            <p className="text-primary/60 text-lg md:text-xl font-medium max-w-2xl">تصفح مجموعة مختارة من أرقى العقارات المتاحة للإيجار في المدن الرئيسية.</p>
          </div>
          <Link to="/search" className="luxury-button-outline px-10 border-accent/20 text-accent-700 hover:border-accent hover:shadow-xl hover:shadow-accent/10 transition-all font-black text-lg">
            عرض كل العقارات
            <ChevronLeft size={24} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {properties.length > 0 ? properties.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/property/${p.id}`} className="luxury-card group block h-full flex flex-col">
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={p.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-primary/90 backdrop-blur-md text-accent font-black rounded-[14px] text-sm uppercase tracking-wider border border-white/10">
                    {p.type === 'apartment' ? 'شقة' : p.type === 'villa' ? 'فيلا' : 'عقار'}
                  </div>
                  <div className="absolute bottom-6 left-6 luxury-button text-sm py-2 px-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 bg-white text-primary">
                    عرض التفاصيل
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-2xl font-display font-black text-primary leading-tight group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-primary/60 font-bold mb-8">
                    <MapPin size={20} className="text-accent" />
                    <span>{p.city} - {p.district}</span>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-black/5 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-accent font-black text-2xl tracking-tight">{p.price.toLocaleString()}</span>
                      <span className="text-primary/40 text-xs font-bold uppercase tracking-widest">ريال يمني / شهرياً</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-xl text-primary/70 font-bold text-sm">
                        <HomeIcon size={18} />
                        <span>{p.rooms}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-xl text-primary/70 font-bold text-sm">
                        <Landmark size={18} />
                        <span>{p.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) : (
            [1, 2, 3].map(i => (
              <div key={i} className="luxury-card h-[550px] animate-pulse bg-white/50" />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 sm:py-32 bg-primary relative overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-2/3 h-full bg-accent/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] md:rounded-[80px] p-12 md:p-24 text-center overflow-hidden relative group transition-all duration-700 hover:bg-white/10"
        >
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-display font-black text-white mb-10 leading-tight"
            >
              هل أنت صاحب عقار <br />
              <span className="text-accent">أو وسيط عقاري؟</span>
            </motion.h2>
            <p className="text-xl md:text-2xl text-white/60 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
              انضم إلى المنصة الأكثر ثقة وأماناً في اليمن. ابدأ بإدراج عقارك اليوم واستقبل الطلبات فوراً.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/register?role=owner" className="luxury-button bg-accent text-primary text-2xl font-black px-12 py-6 rounded-[24px] shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                سجل كمالك عقار
              </Link>
              <Link to="/register?role=agent" className="luxury-button-outline border-white/20 text-white hover:bg-white hover:text-primary text-2xl font-black px-12 py-6 rounded-[24px] hover:scale-105 active:scale-95 transition-all backdrop-blur-md">
                انضم كمندوب معتمد
              </Link>
            </div>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-accent/20 rounded-tl-[40px] transition-all group-hover:scale-110" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-accent/20 rounded-br-[40px] transition-all group-hover:scale-110" />
        </motion.div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <div className="bg-surface">
      <Hero />
      <Features />
      <FeaturedProperties />
      <CTA />
    </div>
  );
}
