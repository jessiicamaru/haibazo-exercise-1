import { useEffect, useRef, useState } from "react";
import GameControl from "./components/GameControl";
import Circle from "./components/Circle";

interface Point {
  number: number;
  x: number;
  y: number;
  zIndex: number;
  isCleared: boolean;
}

function App() {
  const [pointInput, setPointInput] = useState<number>(5);
  const [points, setPoints] = useState<Point[]>([]);
  const [gameStatus, setGameStatus] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");

  const [nextNumber, setNextNumber] = useState<number>(1);

  const [time, setTime] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [autoplayActiveNumber, setAutoplayActiveNumber] = useState<
    number | null
  >(null);

  const timerRef = useRef<number | null>(null);
  const autoplayRef = useRef<number | null>(null);

  const [gameVersion, setGameVersion] = useState(0);

  const initGame = () => {
    const newPoints: Point[] = [];
    for (let i = 1; i <= pointInput; i++) {
      newPoints.push({
        number: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        zIndex: pointInput - i + 1,
        isCleared: false,
      });
    }

    setPoints(newPoints);
    setNextNumber(1);
    setGameStatus("playing");
    setAutoplayActiveNumber(null);
    setGameVersion((v) => v + 1);
    startTimer();
    setTime(0);
  };

  const handleRestart = () => {
    initGame();
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 100);
  };

  const handleCorrect = (number: number) => {
    if (number == pointInput) {
      setGameStatus("won");
      stopTimer();
    } else {
      setNextNumber(number + 1);
    }
  };

  const handleWrong = () => {
    setGameStatus("lost");
    stopTimer();
  };

  useEffect(() => {
    if (autoplay && gameStatus === "playing") {
      const nextPoint = points.find((p) => p.number === nextNumber);
      if (nextPoint) {
        const delay = 1000 + Math.random() * 500;
        autoplayRef.current = setTimeout(() => {
          setAutoplayActiveNumber(nextNumber);
        }, delay);
      }
    }

    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [autoplay, gameStatus, nextNumber, points]);

  return (
    <div className="min-h-screen font-sans bg-white p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
        <div>
          <GameControl
            pointInput={pointInput}
            setPointInput={setPointInput}
            onStart={initGame}
            onRestart={handleRestart}
            gameStatus={gameStatus}
            autoplay={autoplay}
            setAutoplay={setAutoplay}
            time={time}
          />
        </div>
        <div className="mt-8 relative w-full aspect-4/3 bg-zinc-50 border-2 border-zinc-100 rounded-xl overflow-hidden">
          {points.map((point) => (
            <Circle
              key={`${gameVersion} - ${point.number}`}
              number={point.number}
              x={point.x}
              y={point.y}
              zIndex={point.zIndex}
              disabled={gameStatus !== "playing"}
              isNext={point.number == nextNumber}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              forceClick={autoplay && autoplayActiveNumber == point.number}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
