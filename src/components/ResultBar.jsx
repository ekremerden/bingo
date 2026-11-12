import { Filter, LineHeight, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserScore from "./UserScore";

export default function ResultBar({
  score,
  onlyPlaced,
  onToggleOnlyPlaced,
  sticky,
  onToggleSticky,
}) {
  return (
    // <div className="flex gap-2">
    <div className="columns-3 items-center">
      <div className="flex gap-2">
        <Button
          size="xs"
          variant={onlyPlaced ? "default" : "outline"}
          title={onlyPlaced ? "Show all items" : "Show only placed items"}
          aria-pressed={onlyPlaced}
          onClick={onToggleOnlyPlaced}
        >
          <Filter />
        </Button>

        <Button
          size="xs"
          variant={sticky ? "default" : "outline"}
          title={
            sticky
              ? "Let board scroll away"
              : "Keep board visible while scrolling"
          }
          aria-pressed={sticky}
          onClick={onToggleSticky}
        >
          {sticky ? <Pin /> : <PinOff />}
        </Button>
      </div>

      <div className="flex justify-center items-center h-6">
        <UserScore user={"Bingos"} score={score} />
        {/* <UserScore user={"Ekrem"} score={score} /> */}
        {/* <UserScore user={"Lena"} score={score} /> */}
      </div>

      <div></div>
    </div>
  );
}
