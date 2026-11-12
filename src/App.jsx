import { useState } from "react";
import BingoGrid from "./components/BingoGrid";
import ItemList from "./components/ItemList";
import { items } from "./items.js";
import { useBingoDragDrop } from "./hooks/useBingoDragDrop";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import Header from "./components/Header";
import SetupBar from "./components/SetupBar";
import ResultBar from "./components/ResultBar";

function App() {
  const dnd = useBingoDragDrop(25);
  const [onlyPlaced, setOnlyPlaced] = useState(false);
  const [sticky, setSticky] = useState(false);

  return (
    <div className="font-['Open_Sans',sans-serif] text-sm">
        <Header onlyPlaced={onlyPlaced} />

      {/* sticky: the board stays visible while scrolling through the phrase list */}
      <div className={`${sticky ? "sticky top-0 z-10" : ""} mx-auto max-w-90 bg-background py-2`}>
        <div className="flex justify-center">
          <BingoGrid dnd={dnd} />
        </div>
      </div>

      <div className="mx-auto max-w-90 mb-2">
        <div className="mx-auto max-w-80">
          <SetupBar dnd={dnd} hidden={onlyPlaced} />
          <ResultBar
            score={dnd.score}
            onlyPlaced={onlyPlaced}
            onToggleOnlyPlaced={() => setOnlyPlaced((v) => !v)}
            sticky={sticky}
            onToggleSticky={() => setSticky((s) => !s)}
          />
        </div>
      </div>

      <main className="mx-auto max-w-90 my-2">
        <ItemList items={items} dnd={dnd} onlyPlaced={onlyPlaced} />
      </main>
    </div>
  );
}

export default App;
