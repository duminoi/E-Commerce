import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export function Typewriter({
  texts,
  speed = 80,
  deleteSpeed = 40,
  pauseTime = 2000,
  className = '',
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length + 1));

          if (currentText === fullText) {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          setCurrentText(fullText.substring(0, currentText.length - 1));

          if (currentText === '') {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-[2px] align-middle"
      />
    </span>
  );
}
