import { Filter, Pin, PinOff, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import UserScore from "./UserScore";

export default function ResultBar({
  score,
  onlyPlaced,
  onToggleOnlyPlaced,
  sticky,
  onToggleSticky,
  query,
  onQueryChange,
}) {
  return (
    // <div className="grid grid-cols-[auto_auto_1fr] gap-3 items-center">
    <div className="grid grid-cols-3 gap-2 items-center">
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

      <InputGroup className="h-6">
        <InputGroupAddon className="h-6 p-1">
          <Search />
        </InputGroupAddon>
        {/* text-base (16px) on mobile keeps iOS Safari from zooming in on focus */}
        <InputGroupInput
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Search"
          aria-label="Search phrases"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onQueryChange("")}
          // hide the browser's own clear button, we render our own
          className="h-6 pl-0.5! pr-0! [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <InputGroupAddon align="inline-end" className="h-6 pl-0 pr-1">
            <InputGroupButton
              size="icon-xs"
              title="Clear search"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
