import { useState } from "react";
import { Dice6 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { items } from "../items.js";

export default function SetupBar({ dnd, hidden }) {
  const [confirmEnd, setConfirmEnd] = useState(false);

  // date
  const dt = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={`flex mb-1 ${hidden ? "hidden" : ""}`}>
      <div className="flex justify-start gap-1 w-30">
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

      <div className="flex justify-center w-30">
        {/* Start */}
        {!dnd.started && (
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
        )}

        {/* New game: ends the running game and clears the board */}
        {dnd.started && (
          <Button
            size="xs"
            variant="outline"
            title="End this game and clear the board"
            onClick={() => setConfirmEnd(true)}
          >
            End
          </Button>
        )}

        {/* confirm dialog for "End"; kept outside the started check so it
            can close (and animate out) after reset() unmounts the button */}
        <AlertDialog open={confirmEnd} onOpenChange={setConfirmEnd}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>End the game?</AlertDialogTitle>
              <AlertDialogDescription>
                The board and all marks will be cleared.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  dnd.reset();
                  setConfirmEnd(false);
                }}
              >
                End game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex justify-end w-30">
        {/* date */}
        <label>{dt}</label>
      </div>
    </div>
  );
}
