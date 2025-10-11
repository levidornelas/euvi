import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Página inicial do App.
export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-28 sm:mt-20 overflow-hidden">
        <Image src="/logobranca.svg" alt="Logo" width={400} height={400} />
        <h1 className="text-4xl font-bold text-white mt-0">Recife</h1>
      </div>

      {/* Botões na parte inferior */}
      <div className="flex flex-col items-center gap-4 w-full px-8 mt-20">
        <Link href="/onboarding" className="w-full p-[3px] relative flex justify-center">
            <Button variant={'default'}>
              Explorar
            </Button>
        </Link>
      </div>
    </>
  );
}
