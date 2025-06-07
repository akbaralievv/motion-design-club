'use client';

import { useEffect, useState } from 'react';

const AnimatedLine = ({
  delay,
  duration,
  top,
  left,
  width,
  rotate = 0,
}: {
  delay: number;
  duration: number;
  top: string;
  left: string;
  width: string;
  rotate?: number;
}) => (
  <div
    className="absolute bg-primary/60 h-[2px]"
    style={{
      top,
      left,
      width,
      transform: `rotate(${rotate}deg)`,
      animation: `moveIn ${duration}s ease-in-out ${delay}s infinite`,
      opacity: 0,
    }}
  />
);

const AnimatedShape = ({
  delay,
  duration,
  top,
  left,
  size,
  color,
  shape = 'circle',
}: {
  delay: number;
  duration: number;
  top: string;
  left: string;
  size: string;
  color: string;
  shape?: 'circle' | 'square' | 'triangle';
}) => {
  let ShapeComponent;

  if (shape === 'circle') {
    ShapeComponent = (
      <div
        className={`absolute ${color} rounded-full`}
        style={{
          top,
          left,
          width: size,
          height: size,
          animation: `fadeInOut ${duration}s ease-in-out ${delay}s infinite`,
          opacity: 0,
        }}
      />
    );
  } else if (shape === 'square') {
    ShapeComponent = (
      <div
        className={`absolute ${color} rounded-md`}
        style={{
          top,
          left,
          width: size,
          height: size,
          animation: `fadeInOut ${duration}s ease-in-out ${delay}s infinite`,
          opacity: 0,
        }}
      />
    );
  } else if (shape === 'triangle') {
    ShapeComponent = (
      <div
        className={`absolute ${color}`}
        style={{
          top,
          left,
          width: '0',
          height: '0',
          borderLeft: `calc(${size} / 2) solid transparent`,
          borderRight: `calc(${size} / 2) solid transparent`,
          borderBottom: `${size} solid currentColor`,
          animation: `fadeInOut ${duration}s ease-in-out ${delay}s infinite`,
          opacity: 0,
        }}
      />
    );
  }

  return ShapeComponent;
};

export default function HeroReel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add the keyframes to the document
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes moveIn {
        0% {
          opacity: 0;
          transform: translateY(20px) rotate(var(--tw-rotate));
        }
        20%, 80% {
          opacity: 0.8;
        }
        100% {
          opacity: 0;
          transform: translateY(-20px) rotate(var(--tw-rotate));
        }
      }

      @keyframes fadeInOut {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        20%, 80% {
          opacity: 0.7;
        }
        100% {
          opacity: 0;
          transform: scale(1.2);
        }
      }

      @keyframes gridLines {
        0% {
          opacity: 0;
        }
        25% {
          opacity: 0.3;
        }
        50% {
          opacity: 0.1;
        }
        75% {
          opacity: 0.2;
        }
        100% {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    setMounted(true);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="relative w-full h-full overflow-hidden 
  bg-gradient-to-br from-rose-100 via-sky-100 to-amber-100 
  dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-800 dark:to-neutral-900
">
      {/* Grid background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          animation: 'gridLines 8s ease-in-out infinite',
        }}
      />

      {/* Animated lines */}
      <AnimatedLine delay={0.5} duration={4} top="20%" left="10%" width="30%" rotate={45} />
      <AnimatedLine delay={1.5} duration={5} top="70%" left="60%" width="25%" rotate={-30} />
      <AnimatedLine delay={2.5} duration={4.5} top="40%" left="70%" width="15%" rotate={15} />
      <AnimatedLine delay={3.5} duration={3.5} top="85%" left="5%" width="20%" rotate={0} />
      <AnimatedLine delay={4.5} duration={6} top="10%" left="50%" width="40%" rotate={-60} />

      {/* Colorful shapes */}
      <AnimatedShape
        delay={0.8}
        duration={4.2}
        top="15%"
        left="25%"
        size="40px"
        color="bg-rose-400/80 dark:bg-rose-600/80 drop-shadow-xl"
        shape="circle"
      />
      <AnimatedShape
        delay={1.8}
        duration={3.8}
        top="65%"
        left="15%"
        size="30px"
        color="bg-sky-400/80 dark:bg-sky-600/80 drop-shadow-xl"
        shape="square"
      />
      <AnimatedShape
        delay={2.2}
        duration={5.2}
        top="30%"
        left="80%"
        size="25px"
        color="bg-fuchsia-500/80 dark:bg-fuchsia-700/80 drop-shadow-xl"
        shape="triangle"
      />
      <AnimatedShape
        delay={3.2}
        duration={4.6}
        top="80%"
        left="40%"
        size="50px"
        color="bg-violet-500/80 dark:bg-violet-700/80 drop-shadow-xl"
        shape="circle"
      />
      <AnimatedShape
        delay={4.2}
        duration={3.2}
        top="50%"
        left="60%"
        size="35px"
        color="bg-amber-400/80 dark:bg-amber-600/80 drop-shadow-xl"
        shape="square"
      />

      {/* Center title with adaptive gradient */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: 'fadeInOut 8s ease-in-out infinite',
        }}>
        <h1
          className="text-5xl text-center font-extrabold bg-gradient-to-r 
      from-fuchsia-600 via-sky-500 to-rose-500 
      dark:from-fuchsia-400 dark:via-sky-400 dark:to-rose-400 
      text-transparent bg-clip-text">
          Motion Design Club
        </h1>
      </div>
    </div>
  );
}
