"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import "./hero-shutter-text.css";

interface HeroTextProps {
  text?: string;
  className?: string;
}

export default function HeroText({ text = "NEW ARRIVAL", className = "" }: HeroTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { amount: 0.8 });
  const reduced = useReducedMotion();
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const running = visible && pageVisible && !reduced;
  let characterIndex = 0;

  return (
    <span ref={ref} aria-label={text} className={`hero-shutter-text ${className}`}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden="true" className="hero-shutter-text__word">
          {[...word].map((char, index) => {
            const delay = characterIndex++ * 0.04;
            return (
              <span key={index} className="hero-shutter-text__character">
                <motion.span
                  className="hero-shutter-text__base"
                  initial={false}
                  animate={running ? { opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"] } : { opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: running ? delay + 0.3 : 0, duration: running ? 0.8 : 0, repeat: running ? Infinity : 0, repeatDelay: 2.2 }}
                >{char}</motion.span>
                {!reduced && ["top", "middle", "bottom"].map((slice, sliceIndex) => (
                  <motion.span
                    key={slice}
                    className={`hero-shutter-text__slice hero-shutter-text__slice--${slice}`}
                    initial={false}
                    animate={running ? {
                      transform: slice === "middle" ? ["translateX(100%)", "translateX(-100%)"] : ["translateX(-100%)", "translateX(100%)"],
                      opacity: [0, 1, 0],
                    } : { opacity: 0 }}
                    transition={{ duration: running ? 0.7 : 0, delay: running ? delay + sliceIndex * 0.1 : 0, ease: "easeInOut", repeat: running ? Infinity : 0, repeatDelay: 2.3 }}
                  >{char}</motion.span>
                ))}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
