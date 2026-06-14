import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
          className="fixed bottom-[32px] right-[32px] w-[48px] h-[48px] rounded-full bg-primary text-white shadow-[0px_8px_32px_rgba(0,74,198,0.35)] flex items-center justify-center z-50 hover:shadow-[0px_12px_40px_rgba(0,74,198,0.5)] transition-shadow"
        >
          <span className="material-symbols-outlined text-[22px]">keyboard_arrow_up</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
