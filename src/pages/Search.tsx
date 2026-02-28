import { useState, useEffect } from "react";
import { Search as SearchIcon, MapPin, Filter, ChevronDown, Home, Landmark, Star, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Property } from "../types";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await api.properties.getAll({ city, type, minPrice, maxPrice });
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const params: any = {};
    if (city) params.city = city;
    if (type) params.type = type;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-primary mb-6">ابحث عن عقارك القادم</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
              <input 
                type="text" 
                placeholder="ابحث بالمدينة، الحي، أو اسم العقار..." 
                className="w-full pr-12 pl-4 py-4 bg-white border border-black/5 rounded-2xl focus:outline-none focus:border-accent font-medium shadow-sm"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="luxury-button-outline flex items-center justify-center gap-2 px-8 bg-white"
            >
              <SlidersHorizontal size={20} />
              تصفية النتائج
            </button>
            <button 
              onClick={handleApplyFilters}
              className="luxury-button px-12 bg-primary text-white hover:bg-black"
            >
              بحث
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="luxury-card p-8 mb-12 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">نوع العقار</label>
                  <select 
                    className="w-full p-4 bg-surface border border-black/5 rounded-xl focus:outline-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">الكل</option>
                    <option value="apartment">شقة</option>
                    <option value="house">بيت</option>
                    <option value="villa">فيلا</option>
                    <option value="office">مكتب</option>
                    <option value="shop">محل تجاري</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">السعر الأدنى</label>
                  <input 
                    type="number" 
                    placeholder="0 ريال"
                    className="w-full p-4 bg-surface border border-black/5 rounded-xl focus:outline-none"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-3">السعر الأعلى</label>
                  <input 
                    type="number" 
                    placeholder="لا يوجد حد"
                    className="w-full p-4 bg-surface border border-black/5 rounded-xl focus:outline-none"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleApplyFilters}
                    className="w-full luxury-button bg-accent text-primary"
                  >
                    تطبيق الفلاتر
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="luxury-card h-[450px] animate-pulse bg-white/50" />
            ))
          ) : properties.length > 0 ? (
            properties.map((p) => (
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
                        <Home size={16} />
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
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon size={40} className="text-primary/20" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-2">لا توجد نتائج</h3>
              <p className="text-primary/60">جرب تغيير معايير البحث أو البحث في مدينة أخرى.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
