"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Truck, Shield } from "lucide-react";
import { CategoryChips } from "@/components/products/CategoryChips";
import { ProductGrid } from "@/components/products/ProductGrid";

export default function HomePage() {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <section className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-fuchsia-400 text-sm font-medium mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> India&apos;s Value Fashion
                Store
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold max-w-xl leading-tight">
                Ethnic wear & lifestyle at{" "}
                <span className="gradient-brand bg-clip-text text-transparent">
                  wholesale prices
                </span>
              </h1>
              <p className="text-slate-400 mt-4 max-w-md">
                Sarees, kurtis, dupattas & more — delivered across India. Free
                delivery on orders above ₹299.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/products"
                  className="inline-block px-5 py-3 rounded-lg gradient-brand text-white font-medium shadow-md"
                >
                  Shop Now
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-slate-300 underline-offset-4 underline"
                >
                  Sign up to get deals
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" /> Free delivery
                  ₹299+
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" /> Easy returns
                </span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-md md:max-w-lg rounded-lg overflow-hidden shadow-xl">
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
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          Shop by Category
        </h2>
        <CategoryChips selected={category} onSelect={setCategory} />
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="font-display text-xl font-semibold mb-4">
          Trending Deals
        </h2>
        <ProductGrid category={category} page={1} />
      </section>
    </div>
  );
}
