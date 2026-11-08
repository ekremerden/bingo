import { Dice6 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { items } from "../items.js";

export default function SetupBar({ dnd, hidden }) {

  // date
  const dt = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={`flex items-center justify-between mb-1 ${hidden ? "hidden" : ""}`}>
      <div className="w-30 flex justify-start gap-1">
        {/* setup tools, hidden once the game is started */}
        {!dnd.started && (
          <>
            {/* Reset */}
            <Button
              size="xs"
              variant="outline"
              title="Empty all grid boxes"
              onClick={dnd.reset}
            >
              Reset
            </Button>
            {/* Dice6 */}
            <Button
              size="xs"
              variant="outline"
              title="Fill the empty fields ramdomly"
              onClick={() => dnd.fillRandom(items.map((item) => item.id))}
            >
              <Dice6 className="text-gray-600 size-5" />
            </Button>
          </>
        )}
      </div>

      <div className="w-30 flex justify-center">
        {/* Start */}
        <Button
          size="xs"
          variant="outline"
          title={
            dnd.started
              ? "Game is running"
              : dnd.isFull
                ? "Start the game"
                : "Fill all 25 grid boxes first"
          }
          disabled={!dnd.isFull || dnd.started}
          onClick={dnd.start}
        >
          Start
        </Button>
      </div>

      <div className="w-30 flex justify-end">
        {/* date */}
        <label>{dt}</label>
      </div>
    </div>
  );
}
