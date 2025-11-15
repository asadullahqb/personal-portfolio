import Image from "next/image";

interface UnderConstructionProps {
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function UnderConstruction({
  title = "This section is under construction.",
  imageSrc = "/lion/construction.svg",
  imageAlt = "Construction Lion"
}: UnderConstructionProps) {
  return (
    <div className="w-full h-full font-sans">
      <main className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
        <div className="w-full flex-1 min-h-0 flex items-center justify-center" style={{ maxHeight: "clamp(220px, 55vh, 520px)" }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1000}
            height={1000}
            sizes="(min-width: 1024px) 800px, (min-width: 640px) 600px, 90vw"
            priority
            className="max-h-full max-w-full h-auto w-auto object-contain object-center mx-auto select-none pointer-events-none"
            draggable={false}
          />
        </div>
        <p className="mt-4 text-sm sm:text-base text-zinc-600">{title}</p>
      </main>
    </div>
  );
}
