"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Truck, Shield, Crown, Gem, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    api.get("/banners/active").then((res) => {
      const b = res.data.data.banners;
      setBanners(b);
    }).catch(() => {});
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentBanner];

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-gray-800/60 via-gray-900 to-black border-b border-gray-700/50 overflow-hidden">
        {activeBanner && activeBanner.image_url ? (
          <>
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeBanner.image_url}
                alt={activeBanner.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-28">
              <div className="max-w-2xl">
                {activeBanner.title && (
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4">
                    {activeBanner.title}
                  </h1>
                )}
                {activeBanner.subtitle && (
                  <p className="text-gray-300 mt-2 max-w-md text-lg md:text-xl">
                    {activeBanner.subtitle}
                  </p>
                )}
                <Link
                  href={activeBanner.link_url || "/products"}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary shadow-lg"
                >
                  <Gem className="w-4 h-4" /> Shop Now
                </Link>
              </div>
            </div>
            {/* Banner navigation dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentBanner(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentBanner ? "bg-purple-500 w-6" : "bg-gray-600 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Arrow controls */}
            {banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </>
        ) : (
          /* Fallback when no banners */
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-xs font-medium mb-4">
                  <Crown className="w-3.5 h-3.5" /> India&rsquo;s Royal Fashion Store
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold max-w-xl leading-tight text-gray-100">
                  Ethnic wear & lifestyle at{" "}
                  <span className="gradient-brand bg-clip-text text-transparent">
                    royal prices
                  </span>
                </h1>
                <p className="text-gray-400 mt-4 max-w-md text-lg">
                  Premium sarees, kurtis, dupattas & more — delivered across
                  India. Free delivery on orders above ₹299.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-primary shadow-lg"
                  >
                    <Gem className="w-4 h-4" /> Shop Now
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm text-purple-400 hover:text-purple-300 border-b border-purple-700 hover:border-purple-500 pb-0.5"
                  >
                    Sign up for royal deals
                  </Link>
                </div>
                <div className="flex flex-wrap gap-6 mt-8 text-sm text-purple-300">
                  <span className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 px-3 py-1.5 rounded-lg">
                    <Truck className="w-4 h-4 text-purple-400" /> Free delivery ₹299+
                  </span>
                  <span className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 px-3 py-1.5 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-400" /> Easy returns
                  </span>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="w-full max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-xl shadow-purple-900/30 border border-gray-700/50">
                  <Image
                    src="/banner.svg"
                    alt="Ethnic wear banner"
                    width={500}
                    height={384}
                    className="w-full h-80 md:h-96 object-cover block"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full gradient-brand" />
          <h2 className="font-display text-2xl font-semibold text-gray-100">
            Shop by Category
          </h2>
        </div>
        <CategoryChips selected={category} onSelect={setCategory} />
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full gradient-brand" />
          <h2 className="font-display text-2xl font-semibold text-gray-100">
            Trending Deals
          </h2>
        </div>
        <ProductGrid category={category} page={1} />
      </section>

      {/* Footer decorative banner */}
      <section className="bg-gradient-to-r from-purple-800 via-violet-700 to-fuchsia-700 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/80 text-sm font-medium">
            ✦ Royalty assured • Premium quality • Free delivery ✦
          </p>
        </div>
      </section>
    </div>
  );
}