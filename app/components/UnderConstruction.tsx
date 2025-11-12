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
    <div className="flex items-center justify-center font-sans">
      <main className="flex flex-col items-center justify-center p-6 text-center max-w-md w-full">
        <div className="w-72">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={360}
            height={360}
            priority
            className="w-full h-auto object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>
        <p className="mt-4 text-sm sm:text-base text-zinc-600">{title}</p>
      </main>
    </div>
  );
}
