"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Truck, Shield, Crown, Gem, ChevronLeft, ChevronRight, ArrowRight, Star, Zap, Package } from "lucide-react";
import { CategoryChips } from "@/components/products/CategoryChips";
import { ProductGrid } from "@/components/products/ProductGrid";
import { api } from "@/lib/api";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  sort_order: number;
}

const FEATURES = [
  { icon: Truck, label: "Free Delivery", sub: "On orders above ₹299", color: "from-violet-500 to-purple-600" },
  { icon: Shield, label: "100% Authentic", sub: "Verified quality products", color: "from-pink-500 to-rose-600" },
  { icon: Star, label: "Top Rated", sub: "4.8★ customer satisfaction", color: "from-amber-500 to-orange-500" },
  { icon: Zap, label: "Fast Dispatch", sub: "Ships within 24 hours", color: "from-emerald-500 to-teal-500" },
];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&q=80",
  "https://images.unsplash.com/photo-1610030469983-98e55059c310?w=1400&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059ce29ef?w=1400&q=80",
];

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    api.get("/banners/active").then((res) => {
      setBanners(res.data.data.banners);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrentBanner((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % HERO_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const activeBanner = banners[currentBanner];

  return (
    <div className="mesh-bg min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Background image carousel */}
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover scale-105" style={{ filter: 'brightness(0.25) saturate(1.2)' }} />
          </div>
        ))}

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full float" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full float" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(40px)', animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full float" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', filter: 'blur(40px)', animationDelay: '-1.5s' }} />

        {/* Banner content */}
        <div className="relative max-w-7xl mx-auto px-5 py-24 w-full">
          {activeBanner ? (
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
                <Sparkles className="w-3 h-3" /> New Collection
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] text-white mb-6" style={{ letterSpacing: '-0.03em' }}>
                {activeBanner.title}
              </h1>
              {activeBanner.subtitle && (
                <p className="text-white/50 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
                  {activeBanner.subtitle}
                </p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <Link href={activeBanner.link_url || "/products"} className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl btn-primary text-sm font-semibold">
                  <span>Shop the Collection</span>
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl btn-glass text-sm font-medium">
                  <Crown className="w-4 h-4 text-purple-400" /> Join Sastika
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
                <Crown className="w-3 h-3" /> India&apos;s Royal Fashion Store
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                Ethnic Wear<br />
                <span className="gradient-brand-text">Redefined.</span>
              </h1>
              <p className="text-white/50 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
                Premium sarees, kurtis, dupattas & more — delivered across India. Free delivery on orders above ₹299.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link href="/products" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl btn-primary text-sm font-semibold">
                  <Gem className="w-4 h-4 relative z-10" />
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </Link>
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl btn-glass text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Sign up free
                </Link>
              </div>
            </div>
          )}

          {/* Banner dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-8 left-5 flex items-center gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentBanner(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === currentBanner ? '28px' : '8px',
                    height: '8px',
                    background: i === currentBanner ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.25)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Arrow controls */}
          {banners.length > 1 && (
            <>
              <button type="button" onClick={() => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length)} className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:scale-110 transition-transform">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => setCurrentBanner((p) => (p + 1) % banners.length)} className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:scale-110 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="glass-card p-5 text-center group cursor-default">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-sm text-white/90">{label}</p>
              <p className="text-xs text-white/40 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-7xl mx-auto px-5">
        <div className="divider-glow" />
      </div>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-5 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-purple-400/70 mb-1">Browse</p>
            <h2 className="font-display text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
              Shop by Category
            </h2>
          </div>
          <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium group">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <CategoryChips selected={category} onSelect={setCategory} />
      </section>

      {/* ── PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-5 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-pink-400/70 mb-1">Featured</p>
            <h2 className="font-display text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
              Trending Deals
            </h2>
          </div>
          <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium group">
            See all products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid category={category} page={1} />
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 40%, #0f0f23 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(168,85,247,0.2) 0%, transparent 70%)' }} />
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.6 + 0.1,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
        <div className="relative max-w-4xl mx-auto px-5 text-center">
          <div className="w-16 h-16 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-6 glow-purple logo-shine">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Royalty assured.<br />
            <span className="gradient-brand-text">Every purchase.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
            Premium quality • Free delivery on ₹299+ • Easy returns • Trusted by 10,000+ customers
          </p>
          <Link href="/register" className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl btn-primary text-sm font-semibold">
            <Package className="w-4 h-4 relative z-10" />
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4 relative z-10" />
          </Link>
        </div>
      </section>

    </div>
  );
}
