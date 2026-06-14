import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ROUTES } from '../../utils/constants';
import { productApi } from '../../api/product.api';
import { ProductCard } from '../../components/product/ProductCard';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { CountUp } from '../../components/ui/CountUp';
import { MagneticButton } from '../../components/ui/MagneticButton';
import { Typewriter } from '../../components/ui/Typewriter';
import type { Product } from '../../types/product.type';

const CATEGORIES = [
  {
    name: 'Audio',
    count: 120,
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
  },
  {
    name: 'Footwear',
    count: 85,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
  },
  {
    name: 'Bags',
    count: 45,
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop',
  },
  {
    name: 'Accessories',
    count: 200,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6b3c4d?w=600&h=400&fit=crop',
  },
];

const WHY_CHOOSE_US = [
  { icon: 'local_shipping', title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: 'verified_user', title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: 'bolt', title: 'Fast Delivery', desc: '2–3 business days' },
  { icon: 'sync', title: 'Easy Returns', desc: '30-day return policy' },
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], [0, 100]);
  const heroTextY = useTransform(scrollY, [0, 600], [0, -40]);
  const blobScale = useTransform(scrollY, [0, 600], [1, 1.3]);
  const blobOpacity = useTransform(scrollY, [0, 600], [0.06, 0.02]);

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
        <motion.div
          className="absolute top-[-160px] right-[-160px] w-[700px] h-[700px] rounded-full bg-primary pointer-events-none"
          style={{ scale: blobScale, opacity: blobOpacity, filter: 'blur(80px)' }}
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-gutter w-full grid grid-cols-1 md:grid-cols-2 gap-3xl items-center py-[80px]">
          {/* Left: Text */}
          <motion.div className="flex flex-col gap-lg" style={{ y: heroTextY }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-sm w-fit px-[14px] py-[6px] bg-primary/8 text-primary rounded-full text-[13px] font-medium font-heading"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-primary animate-pulse" />
              New Collection 2024
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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
              <span className="text-primary">
                <Typewriter
                  texts={['for Modern Life.', 'for You.', 'Redefined.']}
                  speed={80}
                  deleteSpeed={40}
                  pauseTime={2500}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-[460px]"
            >
              Discover our curated selection of premium products designed to elevate your everyday
              experience with uncompromised quality and timeless design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-sm pt-sm"
            >
              <MagneticButton>
                <Link to={ROUTES.PRODUCTS}>
                  <button className="h-[52px] px-xl bg-primary text-white rounded-xl text-[15px] font-semibold font-heading hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-[0px_4px_24px_rgba(0,74,198,0.28)] flex items-center gap-sm">
                    Shop Now
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to={ROUTES.PRODUCTS}>
                  <button className="h-[52px] px-xl bg-surface-container-lowest text-on-surface border border-outline-variant rounded-xl text-[15px] font-semibold font-heading hover:bg-surface-container-low transition-all duration-200 active:scale-[0.98]">
                    Explore Collection
                  </button>
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex items-center gap-xl pt-sm"
            >
              <div className="flex -space-x-[10px]">
                {[
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face',
                ].map((src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt="customer"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + i * 0.1, type: 'spring', stiffness: 200 }}
                    className="w-[36px] h-[36px] rounded-full border-2 border-surface-container-lowest object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-[2px] mb-[2px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + s * 0.05, type: 'spring', stiffness: 300 }}
                      className="material-symbols-outlined text-[14px] text-secondary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </motion.span>
                  ))}
                </div>
                <p className="font-caption text-caption text-on-surface-variant">
                  <strong className="text-on-surface font-semibold">4.9</strong> from 12,000+ reviews
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <div className="relative hidden md:block h-[520px]">
            <motion.div
              initial={{ opacity: 0, scale: 1.1, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ y: heroImageY }}
              className="absolute inset-0 rounded-[28px] overflow-hidden shadow-[0px_24px_64px_rgba(15,23,42,0.15)]"
            >
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=900&fit=crop"
                alt="Premium lifestyle"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating badge: Premium Quality */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
              className="absolute -left-[24px] top-[80px] glass-effect rounded-[16px] px-md py-sm shadow-[0px_8px_32px_rgba(15,23,42,0.12)] flex items-center gap-md animate-float"
            >
              <div className="w-[40px] h-[40px] rounded-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-on-surface font-heading">Premium Quality</p>
                <p className="font-caption text-caption text-on-surface-variant">Guaranteed</p>
              </div>
            </motion.div>

            {/* Floating badge: Trending */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6, type: 'spring' }}
              className="absolute -right-[24px] bottom-[100px] glass-effect rounded-[16px] px-md py-sm shadow-[0px_8px_32px_rgba(15,23,42,0.12)] w-[200px] animate-float-delayed"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Featured Categories ───────────────── */}
      <section className="py-[80px] bg-surface">
        <div className="max-w-[1280px] mx-auto px-gutter">
          <ScrollReveal>
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
          </ScrollReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]"
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="group relative h-[320px] rounded-[20px] overflow-hidden block shadow-[0px_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0px_12px_40px_rgba(15,23,42,0.14)] transition-shadow duration-300"
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-[20px] w-full">
                    <h3 className="text-[22px] font-semibold text-white mb-[4px] font-heading">
                      {cat.name}
                    </h3>
                    <p className="font-caption text-caption text-white/75">
                      <CountUp end={cat.count} suffix="+ Products" duration={1.5} />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 3: Best Sellers ───────────────────────── */}
      <section className="py-[80px] bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-gutter">
          <ScrollReveal>
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
          </ScrollReveal>

          {isLoadingProducts || bestSellers.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-[20px] border border-outline-variant/20 overflow-hidden"
                >
                  <div className="aspect-[4/5] skeleton-shimmer" />
                  <div className="p-md space-y-[10px]">
                    <div className="h-3 skeleton-shimmer rounded-full w-1/3" />
                    <div className="h-4 skeleton-shimmer rounded-full w-2/3" />
                    <div className="h-4 skeleton-shimmer rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]"
            >
              {bestSellers.slice(0, 4).map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-2xl">
              <MagneticButton>
                <Link to={ROUTES.PRODUCTS}>
                  <button className="h-[52px] px-[40px] border-2 border-primary text-primary rounded-xl text-[15px] font-semibold font-heading hover:bg-primary hover:text-white transition-all duration-200 active:scale-[0.98]">
                    View All Products
                  </button>
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 4: Why Choose Us ──────────────────────── */}
      <section className="py-3xl bg-surface-container">
        <div className="max-w-[1280px] mx-auto px-gutter">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-lg"
          >
            {WHY_CHOOSE_US.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="flex flex-col items-center text-center p-lg rounded-[20px] hover:bg-surface-container-lowest/60 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
                  className="w-[64px] h-[64px] rounded-[20px] bg-surface-container-lowest flex items-center justify-center mb-md shadow-[0px_4px_20px_rgba(15,23,42,0.06)]"
                >
                  <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </motion.div>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface mb-[6px] font-heading">
                  {item.title}
                </h4>
                <p className="font-caption text-caption text-on-surface-variant">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 5: Newsletter CTA ─────────────────────── */}
      <section className="py-[80px] bg-on-surface relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-on-surface via-[#1a2744] to-on-surface animate-gradient opacity-50" />

        <div className="relative z-10 max-w-[640px] mx-auto px-gutter text-center">
          <ScrollReveal>
            <h2 className="text-surface-bright mb-sm font-heading text-[32px] font-semibold leading-[40px] tracking-tight">
              Stay in the loop
            </h2>
            <p className="font-body-md text-body-md text-outline-variant mb-xl">
              Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex gap-sm max-w-[480px] mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-[52px] px-md rounded-xl bg-on-surface-variant/20 border border-on-surface-variant/30 text-surface-bright placeholder:text-outline-variant font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60 focus:bg-on-surface-variant/30 transition-all duration-300"
              />
              <MagneticButton>
                <button className="h-[52px] px-lg bg-primary text-white rounded-xl font-label-md text-label-md font-semibold font-heading hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] whitespace-nowrap">
                  Subscribe
                </button>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
