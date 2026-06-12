import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { productApi } from '../../api/product.api';
import { ProductCard } from '../../components/product/ProductCard';
import type { Product } from '../../types/product.type';

const CATEGORIES = [
  {
    name: 'Audio',
    count: '120+ Products',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
  },
  {
    name: 'Footwear',
    count: '85+ Products',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
  },
  {
    name: 'Bags',
    count: '45+ Products',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop',
  },
  {
    name: 'Accessories',
    count: '200+ Products',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6b3c4d?w=600&h=400&fit=crop',
  },
];

const WHY_CHOOSE_US = [
  { icon: 'local_shipping', title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: 'verified_user', title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: 'bolt', title: 'Fast Delivery', desc: '2–3 business days' },
  { icon: 'sync', title: 'Easy Returns', desc: '30-day return policy' },
];

export function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    productApi
      .getAll({ sort: 'sold', limit: 4 })
      .then(({ data }) => setBestSellers(data.data?.items || []))
      .catch(() => {})
      .finally(() => setIsLoadingProducts(false));
  }, []);

  return (
    <div className="pt-[72px]">
      {/* ── Section 1: Hero ───────────────────────────────── */}
      <section className="relative min-h-[640px] lg:min-h-[760px] flex items-center overflow-hidden bg-surface-container-lowest">
        {/* Dot-grid background */}
        <div className="absolute inset-0 hero-pattern opacity-40 pointer-events-none" />
        {/* Soft gradient blob */}
        <div className="absolute top-[-160px] right-[-160px] w-[700px] h-[700px] rounded-full bg-primary/6 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-gutter w-full grid grid-cols-1 md:grid-cols-2 gap-3xl items-center py-[80px]">
          {/* Left: Text */}
          <div className="flex flex-col gap-lg">
            <span className="inline-flex items-center gap-sm w-fit px-[14px] py-[6px] bg-primary/8 text-primary rounded-full text-[13px] font-medium font-heading">
              <span className="w-[6px] h-[6px] rounded-full bg-primary animate-pulse" />
              New Collection 2024
            </span>

            <h1
              className="text-on-surface leading-[1.12] tracking-tight font-heading"
              style={{
                fontSize: 'clamp(36px, 5vw, 62px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
              }}
            >
              Effortless
              <br />
              Sophistication
              <br />
              <span className="text-primary">for Modern Life.</span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[460px]">
              Discover our curated selection of premium products designed to elevate your everyday
              experience with uncompromised quality and timeless design.
            </p>

            <div className="flex flex-wrap gap-sm pt-sm">
              <Link to={ROUTES.PRODUCTS}>
                <button className="h-[52px] px-xl bg-primary text-white rounded-xl text-[15px] font-semibold font-heading hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-[0px_4px_24px_rgba(0,74,198,0.28)] flex items-center gap-sm">
                  Shop Now
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <button className="h-[52px] px-xl bg-surface-container-lowest text-on-surface border border-outline-variant rounded-xl text-[15px] font-semibold font-heading hover:bg-surface-container-low transition-all duration-200 active:scale-[0.98]">
                  Explore Collection
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-xl pt-sm">
              <div className="flex -space-x-[10px]">
                {[
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="customer"
                    className="w-[36px] h-[36px] rounded-full border-2 border-surface-container-lowest object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-[2px] mb-[2px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-[14px] text-secondary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-caption text-caption text-on-surface-variant">
                  <strong className="text-on-surface font-semibold">4.9</strong> from 12,000+ reviews
                </p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative hidden md:block h-[520px]">
            <div className="absolute inset-0 rounded-[28px] overflow-hidden shadow-[0px_24px_64px_rgba(15,23,42,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=900&fit=crop"
                alt="Premium lifestyle"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge: Premium Quality */}
            <div className="absolute -left-[24px] top-[80px] glass-effect rounded-[16px] px-md py-sm shadow-[0px_8px_32px_rgba(15,23,42,0.12)] flex items-center gap-md">
              <div className="w-[40px] h-[40px] rounded-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-on-surface font-heading">Premium Quality</p>
                <p className="font-caption text-caption text-on-surface-variant">Guaranteed</p>
              </div>
            </div>

            {/* Floating badge: Trending */}
            <div className="absolute -right-[24px] bottom-[100px] glass-effect rounded-[16px] px-md py-sm shadow-[0px_8px_32px_rgba(15,23,42,0.12)] w-[200px]">
              <div className="flex items-center justify-between mb-sm">
                <p className="text-[13px] font-semibold text-on-surface font-heading">Trending Now</p>
                <span className="material-symbols-outlined text-secondary-container text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  trending_up
                </span>
              </div>
              <div className="flex items-center gap-[10px]">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6b3c4d?w=60&h=60&fit=crop"
                  alt="Watch"
                  className="w-[40px] h-[40px] rounded-[8px] object-cover"
                />
                <div>
                  <p className="font-caption text-caption font-medium text-on-surface">Aero Watch Pro</p>
                  <p className="font-caption text-caption font-semibold text-primary">$299</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Featured Categories ───────────────── */}
      <section className="py-[80px] bg-surface">
        <div className="max-w-[1280px] mx-auto px-gutter">
          {/* Section heading */}
          <div className="flex items-end justify-between mb-[40px]">
            <div>
              <p className="font-label-md text-label-md text-primary uppercase tracking-[0.1em] mb-sm">
                Collections
              </p>
              <h2 className="font-h2 text-h2 text-on-surface">
                Curated Categories
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                Explore our carefully selected ranges for your lifestyle.
              </p>
            </div>
            <Link
              to={ROUTES.PRODUCTS}
              className="hidden sm:flex items-center gap-[6px] font-label-md text-label-md text-primary hover:underline"
            >
              View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={ROUTES.PRODUCTS}
                className="group relative h-[320px] rounded-[20px] overflow-hidden block shadow-[0px_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0px_12px_40px_rgba(15,23,42,0.14)] transition-shadow duration-300"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-[20px] w-full">
                  <h3 className="text-[22px] font-semibold text-white mb-[4px] font-heading">
                    {cat.name}
                  </h3>
                  <p className="font-caption text-caption text-white/75">
                    {cat.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Best Sellers ───────────────────────── */}
      <section className="py-[80px] bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-gutter">
          {/* Section heading */}
          <div className="text-center mb-2xl">
            <p className="font-label-md text-label-md text-primary uppercase tracking-[0.1em] mb-sm">
              Most Loved
            </p>
            <h2 className="font-h2 text-h2 text-on-surface mb-sm">
              Best Sellers
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[520px] mx-auto">
              Our most loved products, chosen by customers who appreciate uncompromising quality.
            </p>
          </div>

          {/* Product grid */}
          {isLoadingProducts || bestSellers.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-[20px] border border-outline-variant/20 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/5] bg-surface-container-low" />
                  <div className="p-md space-y-[10px]">
                    <div className="h-3 bg-surface-container rounded-full w-1/3" />
                    <div className="h-4 bg-surface-container rounded-full w-2/3" />
                    <div className="h-4 bg-surface-container rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {bestSellers.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* View all CTA */}
          <div className="text-center mt-2xl">
            <Link to={ROUTES.PRODUCTS}>
              <button className="h-[52px] px-[40px] border-2 border-primary text-primary rounded-xl text-[15px] font-semibold font-heading hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.98]">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Why Choose Us ──────────────────────── */}
      <section className="py-3xl bg-surface-container">
        <div className="max-w-[1280px] mx-auto px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center p-lg">
                <div className="w-[64px] h-[64px] rounded-[20px] bg-surface-container-lowest flex items-center justify-center mb-md shadow-[0px_4px_20px_rgba(15,23,42,0.06)]">
                  <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface mb-[6px] font-heading">
                  {item.title}
                </h4>
                <p className="font-caption text-caption text-on-surface-variant">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Newsletter CTA ─────────────────────── */}
      <section className="py-[80px] bg-on-surface">
        <div className="max-w-[640px] mx-auto px-gutter text-center">
          <h2 className="text-surface-bright mb-sm font-heading text-[32px] font-semibold leading-[40px] tracking-tight">
            Stay in the loop
          </h2>
          <p className="font-body-md text-body-md text-outline-variant mb-xl">
            Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
          </p>
          <div className="flex gap-sm max-w-[480px] mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-[52px] px-md rounded-xl bg-on-surface-variant/20 border border-on-surface-variant/30 text-surface-bright placeholder:text-outline-variant font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
            />
            <button className="h-[52px] px-lg bg-primary text-white rounded-xl font-label-md text-label-md font-semibold font-heading hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
