"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sign() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex items-start justify-center">
      {/* coluna central, sem card */}
      <div className="w-full max-w-[360px] mt-6 px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <button
            aria-label="Fechar"
            onClick={() => router.push('/onboarding')}
            className="p-2 -ml-2 text-[#272B33] hover:opacity-80"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold">Entrar</h1>
          <span className="w-5" />
        </div>

        <div className="mt-8 space-y-6">
          <Button
            className="w-full h-12 rounded-full text-[18px]"
            onClick={() => router.push("/login")}
          >
            Entrar
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/register")}
            className="w-full h-12 rounded-full text-[18px]"
          >
            Cadastro
          </Button>
        </div>
        {/* 
        Forgot password
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/recuperar-senha")}
            className="text-xs text-[#2F6EF6] hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div> */}
      </div>
    </div>
  );
}
