export default function UserScore({ user, score }) {
  return (
    <div className="bg-[rgba(49,161,165,0.25)] rounded-2xl px-2 flex items-center">
      <label>{user}:&nbsp;</label>
      <label>{score}</label>
    </div>
  );
}
