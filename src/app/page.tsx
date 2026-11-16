import { GameApp } from "@/components/game/game-app";
import { Providers } from "@/components/game/providers";
import { SiteFooter } from "@/components/game/footer";

export default function Home() {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <GameApp />
        <SiteFooter />
      </div>
    </Providers>
  );
}
