import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center p-8 text-center max-w-2xl w-full">
        <div className="w-96 -mb-4">
          <Image
            src="/lion/construction.svg"
            alt="Construction Lion"
            width={500}
            height={500}
            priority
            className="w-full h-auto object-contain dark:invert scale-110"
          />
        </div>
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100 -mt-10">
          Under Construction
        </h1>
      </main>
    </div>
  );
}