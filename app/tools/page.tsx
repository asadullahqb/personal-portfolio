import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import Button from "@/app/components/ui/Button";

export default function Tools() {
  const items = [
    {
      title: "Medical Scribe Assistant",
      desc: "Record, attribute speakers, and generate clinical notes.",
      href: "/tools/scribe",
    },
    {
      title: "Coming Soon",
      desc: "More AI-powered tools will appear here shortly.",
      href: undefined,
    },
  ];

  return (
    <section
      id="tools"
      className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 36px)" }}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        <SectionHeading
          title="Tools"
          subtitle="A growing set of AI-powered utilities."
          className="mb-0"
        />
        <div className="mt-8 flex-1 min-h-0">
          <div className="flex gap-4 overflow-x-auto px-3 pt-2 pb-4 snap-x">
            {items.map((it) => (
              <Card key={it.title} className="min-w-[280px] w-[340px] snap-start hover:scale-[1.02] active:scale-[1.04] transition-transform">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold">{it.title}</h3>
                  <p className="text-sm text-zinc-500">{it.desc}</p>
                  {it.href ? (
                    <Button
                      href={it.href}
                      variant="primary"
                      ariaLabel={`Open ${it.title}`}
                      className="p-0 w-10 h-10 rounded-full grid place-items-center transition-transform hover:scale-105 active:scale-110"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7-11-7z" />
                      </svg>
                    </Button>
                  ) : (
                    <Button
                      variant="neutral"
                      ariaLabel="Coming soon"
                      className="p-0 w-10 h-10 rounded-full grid place-items-center opacity-60 cursor-not-allowed"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7-11-7z" />
                      </svg>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
