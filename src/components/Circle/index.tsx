import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CircleProps {
  number: number;
  x: number;
  y: number;
  zIndex: number;
  forceClick?: boolean;
  disabled: boolean;
  isNext: boolean;
  onCorrect: (number: number) => void;
  onWrong: () => void;
}

const Circle = ({
  number,
  x,
  y,
  zIndex,
  disabled,
  isNext,
  onCorrect,
  onWrong,
  forceClick,
}: CircleProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(2.0);

  const handleClick = () => {
    if (isClicked || disabled) return;

    if (isNext) {
      setIsClicked(true);
      onCorrect(number);
    } else {
      onWrong();
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isClicked && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 0.1));
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isClicked, timeLeft]);

  useEffect(() => {
    if (forceClick && !isClicked && !disabled) {
      handleClick();
    }
  }, [disabled, forceClick, handleClick, isClicked]);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: zIndex,
      }}
    >
      <AnimatePresence>
        {(!isClicked || timeLeft > 0) && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: isClicked ? 0 : 1 }}
            transition={{
              opacity: { duration: isClicked ? 2 : 0.5 },
              scale: { duration: 0.3 },
            }}
            exit={{ opacity: 0 }}
            className={cn(
              "relative flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer transition-color duration-200",
              isClicked
                ? "bg-orange-500 border-orange-600 text-white shadow-sm"
                : "bg-white border-zinc-400 hover:border-zinc-800 shadow-sm",
            )}
            onClick={handleClick}
          >
            <span>{number}</span>
            {isClicked && (
              <span className="absolute -bottom-6 text-[10px] text-orange-500">
                {timeLeft.toFixed(1)}s
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Circle;
