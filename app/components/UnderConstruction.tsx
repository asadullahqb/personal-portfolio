import Image from "next/image";

interface UnderConstructionProps {
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function UnderConstruction({
  title = "Under Construction",
  imageSrc = "/lion/construction.svg",
  imageAlt = "Construction Lion"
}: UnderConstructionProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-col items-center justify-center p-8 text-center max-w-2xl w-full">
        <div className="w-96 -mb-4">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={500}
            priority
            className="w-full h-auto object-contain scale-110 select-none pointer-events-none"
            draggable={false}
          />
        </div>
        <h1 className="text-4xl font-bold text-zinc-800 -mt-10">
          {title}
        </h1>
      </main>
    </div>
  );
}