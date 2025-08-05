import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Welcome to My Mini App Snake game 
        Zambia
      </h1>
      <Link href="/snake-game">🎮 Play Snake Game</Link>
    </main>
  );
}
