import { Play, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface GameControlProps {
  pointInput: number;
  setPointInput: (val: number) => void;
  onStart: () => void;
  onRestart: () => void;
  gameStatus: "idle" | "playing" | "won" | "lost";
  autoplay: boolean;
  setAutoplay: (val: boolean) => void;
  time: number;
}

const GameControl = ({
  pointInput,
  setPointInput,
  onStart,
  onRestart,
  gameStatus,
  autoplay,
  setAutoplay,
  time,
}: GameControlProps) => {
  return (
    <div>
      <div>
        <h1
          className={cn(
            "font-bold text-2xl uppercase",
            gameStatus == "won"
              ? "text-green-500"
              : gameStatus == "lost"
                ? "text-red-500"
                : "text-zinc-800",
          )}
        >
          {gameStatus == "won"
            ? "ALL CLEARED"
            : gameStatus == "lost"
              ? "GAME OVER"
              : "LET'S PLAY"}
        </h1>
      </div>

      <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
        <Label htmlFor="points">Points:</Label>
        <div className="flex gap-4 items-center">
          <Input
            id="points"
            type="number"
            min={1}
            value={pointInput}
            className="w-32"
            onChange={(e) => {
              setPointInput(parseInt(e.target.value) || 5);
            }}
          />
        </div>

        <Label htmlFor="times">Times:</Label>
        <span className="text-lg font-sans">{time}s</span>

        <div className="flex gap-x-4">
          {gameStatus == "playing" ? (
            <Button
              onClick={() => {
                onRestart();
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              RESTART
            </Button>
          ) : (
            <Button
              onClick={() => {
                onStart();
              }}
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              START
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => setAutoplay(!autoplay)}
            className={
              autoplay
                ? "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 font-bold"
                : "text-zinc-500 font-bold"
            }
          >
            AUTOPLAY {autoplay ? ": ON" : ":  OFF"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameControl;
