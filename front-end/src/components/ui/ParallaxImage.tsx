import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  children?: ReactNode;
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export function ParallaxImage({ src, alt, className = '', speed = 30, children }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useParallax(scrollYProgress, speed);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
      {children}
    </div>
  );
}
