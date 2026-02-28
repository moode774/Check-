import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Home, Landmark, Star, ShieldCheck, CreditCard, 
  FileText, Phone, Mail, Share2, Heart, ChevronRight, 
  ChevronLeft, Users, CheckCircle2, Info, AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "../lib/api";
import { Property, User } from "../types";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [user, setUser] = useState<User | null>(api.auth.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.properties.getOne(parseInt(id)).then(data => {
        setProperty(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleRentRequest = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Logic for rent request
    alert("تم إرسال طلب الإيجار بنجاح. سيقوم المالك بالتواصل معك قريباً.");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">العقار غير موجود</div>;

  return (
    <div className="bg-surface pb-24">
      {/* Image Gallery */}
      <section className="h-[60vh] md:h-[75vh] relative overflow-hidden bg-primary">
        <img 
          src={property.images[activeImage] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"} 
          alt={property.title} 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-8 right-8 left-8 flex justify-between items-end">
          <div className="flex gap-4">
            {property.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-accent scale-110' : 'border-white/20 opacity-60'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
              <Share2 size={20} />
            </button>
            <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="luxury-card p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-accent font-bold mb-2">
                    <Star size={18} fill="currentColor" />
                    <span>4.8 (24 تقييم)</span>
                  </div>
                  <h1 className="text-4xl font-display font-bold text-primary mb-4">{property.title}</h1>
                  <div className="flex items-center gap-2 text-primary/60">
                    <MapPin size={18} />
                    <span className="text-lg">{property.city} - {property.district}</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-display font-bold text-accent mb-1">{property.price.toLocaleString()} ريال</div>
                  <div className="text-primary/40 font-bold">شهرياً</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-black/5 my-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-primary">
                    <Home size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-primary/40 font-bold">الغرف</div>
                    <div className="font-bold">{property.rooms} غرف</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-primary">
                    <Landmark size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-primary/40 font-bold">المساحة</div>
                    <div className="font-bold">{property.area} م²</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-primary">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-primary/40 font-bold">الحمامات</div>
                    <div className="font-bold">{property.bathrooms} حمامات</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-primary">
                    <ChevronRight className="rotate-90" size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-primary/40 font-bold">الطابق</div>
                    <div className="font-bold">{property.floor}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold">الوصف</h3>
                <p className="text-primary/70 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              <div className="mt-12 space-y-6">
                <h3 className="text-2xl font-display font-bold">المميزات</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="luxury-card p-10">
              <h3 className="text-2xl font-display font-bold mb-8">الموقع على الخريطة</h3>
              <div className="h-96 bg-surface rounded-2xl flex items-center justify-center border border-black/5">
                <div className="text-center">
                  <MapPin size={48} className="text-primary/20 mx-auto mb-4" />
                  <p className="text-primary/40 font-bold">خريطة تفاعلية قريباً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-8">
            <div className="luxury-card p-8 sticky top-32">
              <h3 className="text-xl font-display font-bold mb-6">طلب إيجار</h3>
              <div className="space-y-6">
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-4">
                  <ShieldCheck size={24} className="text-accent" />
                  <div className="text-sm">
                    <div className="font-bold text-primary">حماية سكن يمن</div>
                    <div className="text-primary/60">عقود موثقة ودفع آمن</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">الإيجار الشهري</span>
                    <span className="font-bold">{property.price.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">التأمين (مسترد)</span>
                    <span className="font-bold">{(property.price * 0.5).toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">رسوم المنصة</span>
                    <span className="font-bold">5,000 ريال</span>
                  </div>
                  <div className="pt-4 border-t border-black/5 flex justify-between">
                    <span className="font-bold text-lg">الإجمالي</span>
                    <span className="font-bold text-lg text-accent">{(property.price * 1.5 + 5000).toLocaleString()} ريال</span>
                  </div>
                </div>

                <button 
                  onClick={handleRentRequest}
                  className="w-full luxury-button py-4 text-lg bg-primary text-white hover:bg-black"
                >
                  إرسال طلب إيجار
                </button>
                <p className="text-center text-xs text-primary/40">لن يتم خصم أي مبالغ حتى يتم توقيع العقد</p>
              </div>
            </div>

            <div className="luxury-card p-8">
              <h3 className="text-xl font-display font-bold mb-6">صاحب العقار</h3>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                  م
                </div>
                <div>
                  <div className="font-bold text-lg">محمد اليماني</div>
                  <div className="text-sm text-primary/60">مالك موثق منذ 2024</div>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full luxury-button-outline flex items-center justify-center gap-2">
                  <Phone size={18} />
                  اتصال
                </button>
                <button className="w-full luxury-button-outline flex items-center justify-center gap-2">
                  <Mail size={18} />
                  مراسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
