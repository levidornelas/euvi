'use client'

import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10 px-8">
        <h1 className="text-4xl font-bold text-white">Sobre Nós</h1>
      </div>

      {/* Valores e objetivos */}
      <div className="flex flex-col items-center gap-6 mt-8 px-6 max-h-screen">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Quem somos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Somos uma startup formada por recifenses apaixonados pela cultura
              local. Nosso time é movido pela vontade de destacar a riqueza
              cultural de Recife e transformá-la em uma experiência acessível e
              envolvente para todos. Acreditamos que a tecnologia pode ser uma
              ferramenta poderosa para revelar os tesouros da cidade e conectar
              pessoas à sua essência cultural.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle>Nossa Missão</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Conectar cidadãos e turistas à rica herança cultural de Recife,
              utilizando a tecnologia como ponte para valorizar a história, a
              música e o cinema presentes em cada canto da cidade. Nossa missão é
              promover o turismo local e oferecer novas perspectivas sobre
              Recife, celebrando tudo o que torna a cidade única e inspiradora.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl mb-4">
          <CardHeader>
            <CardTitle>Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-8">
              <a
                href="https://www.instagram.com/euvi.tech/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-600 transition-colors"
              >
                <FaInstagram className="text-3xl" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/eu-vi/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <FaLinkedin className="text-3xl" />
                <span>LinkedIn</span>
              </a>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center mb-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center gap-2"
          onClick={() => router.push("/map")}
        >
          <ChevronLeft size={18} />
          Voltar ao mapa
        </Button>
      </div>

      </div>
    </>
  );
}
