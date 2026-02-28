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
    <section className="relative h-[85vh] flex items-center overflow-hidden bg-primary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Real Estate"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              جد منزلك المثالي في <span className="text-accent">اليمن</span> بكل سهولة وأمان
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              المنصة الرقمية الأولى لإدارة وإيجار العقارات في اليمن. حماية كاملة لحقوق المالك والمستأجر، دفع إلكتروني، وعقود موثقة.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-white rounded-xl">
                <MapPin className="text-primary/40" />
                <input
                  type="text"
                  placeholder="المدينة أو الحي (صنعاء، عدن، تعز...)"
                  className="w-full bg-transparent border-none focus:ring-0 text-primary font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="luxury-button flex items-center justify-center gap-2 text-lg px-10 bg-accent text-primary hover:bg-accent/90">
                <Search size={20} />
                ابحث الآن
              </button>
            </form>

            <div className="mt-12 flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <ShieldCheck className="text-accent" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">100%</div>
                  <div className="text-white/50 text-sm">عقود موثقة</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <CreditCard className="text-accent" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">دفع رقمي</div>
                  <div className="text-white/50 text-sm">آمن وسريع</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Users className="text-accent" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">+5,000</div>
                  <div className="text-white/50 text-sm">مستخدم نشط</div>
                </div>
              </div>
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
      icon: <FileText className="w-8 h-8 text-accent" />,
    },
    {
      title: "دفع إلكتروني محلي",
      desc: "ادفع إيجارك عبر المحافظ الإلكترونية اليمنية (كاش، وان كاش) بكل سهولة.",
      icon: <CreditCard className="w-8 h-8 text-accent" />,
    },
    {
      title: "إدارة شاملة للملاك",
      desc: "لوحة تحكم متطورة لمتابعة العقارات، المستأجرين، والتحصيلات المالية.",
      icon: <Building2 className="w-8 h-8 text-accent" />,
    },
    {
      title: "نظام وساطة معتمد",
      desc: "مناديب ووسطاء عقاريين معتمدين لضمان أفضل خدمة ومعاينة للعقارات.",
      icon: <Users className="w-8 h-8 text-accent" />,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-primary mb-4">لماذا تختار سكن يمن؟</h2>
          <p className="text-primary/60 max-w-2xl mx-auto text-lg">نحن نعيد صياغة مفهوم التأجير العقاري في اليمن من خلال التكنولوجيا والأمان.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 luxury-card text-center"
            >
              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-4">{f.title}</h3>
              <p className="text-primary/60 leading-relaxed">{f.desc}</p>
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
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold text-primary mb-4">عقارات مميزة</h2>
            <p className="text-primary/60 text-lg">اكتشف أفضل العروض المتاحة حالياً في مختلف المدن اليمنية.</p>
          </div>
          <Link to="/search" className="luxury-button-outline flex items-center gap-2">
            عرض الكل
            <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? properties.map((p) => (
            <Link key={p.id} to={`/property/${p.id}`} className="luxury-card group overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={p.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-accent text-primary font-bold px-3 py-1 rounded-lg text-sm">
                  {p.type === 'apartment' ? 'شقة' : p.type === 'villa' ? 'فيلا' : 'عقار'}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-display font-bold text-primary group-hover:text-accent transition-colors">{p.title}</h3>
                  <div className="text-accent font-bold text-lg">{p.price.toLocaleString()} ريال</div>
                </div>
                <div className="flex items-center gap-2 text-primary/60 mb-6">
                  <MapPin size={16} />
                  <span>{p.city} - {p.district}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-black/5">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-primary/60 text-sm">
                      <HomeIcon size={16} />
                      <span>{p.rooms} غرف</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary/60 text-sm">
                      <Landmark size={16} />
                      <span>{p.area} م²</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={16} fill="currentColor" />
                    <span className="font-bold">4.8</span>
                  </div>
                </div>
              </div>
            </Link>
          )) : (
            // Placeholder cards if no data
            [1, 2, 3].map(i => (
              <div key={i} className="luxury-card h-[450px] animate-pulse bg-white/50" />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">هل أنت صاحب عقار أو وسيط؟</h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            انضم إلى مئات الملاك والوسطاء الذين يستخدمون سكن يمن لإدارة عقاراتهم وزيادة دخلهم بكل احترافية وأمان.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/register?role=owner" className="luxury-button bg-accent text-primary text-xl px-12 py-5">
              سجل كمالك عقار
            </Link>
            <Link to="/register?role=agent" className="luxury-button-outline border-white text-white hover:bg-white hover:text-primary text-xl px-12 py-5">
              انضم كمندوب معتمد
            </Link>
          </div>
        </div>
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
