export default function Header({ onlyPlaced }) {
  if (onlyPlaced) return null;
  return (
    <header className="flex items-center justify-center text-3xl font-bold mt-2">
      <h1>MMA BINGO</h1>
    </header>
  );
}