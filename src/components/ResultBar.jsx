import { Filter, LineHeight, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserScore from "./UserScore";

export default function ResultBar({ score, onlyPlaced, onToggleOnlyPlaced, sticky, onToggleSticky }) {
  return (
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

      {/* placeholder for a future line-height toggle; currently mirrors the filter button */}
      <Button
        size="xs"
        variant={onlyPlaced ? "default" : "outline"}
        title={onlyPlaced ? "Show all items" : "Show only placed items"}
        aria-pressed={onlyPlaced}
        onClick={onToggleOnlyPlaced}
        hidden
      >
        <LineHeight className="size-5" />
      </Button>

      <Button
        size="xs"
        variant={sticky ? "default" : "outline"}
        title={sticky ? "Let board scroll away" : "Keep board visible while scrolling"}
        aria-pressed={sticky}
        onClick={onToggleSticky}
      >
        {sticky ? <Pin /> : <PinOff />}
      </Button>

      <UserScore user={"Bingos"} score={score} />
      {/* <UserScore user={"Ekrem"} score={score} /> */}
      {/* <UserScore user={"Lena"} score={score} /> */}
    </div>
  );
}
