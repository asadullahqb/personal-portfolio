import Card from "@/app/components/ui/Card";
import UnderConstruction from "@/app/components/UnderConstruction";

export default function ComingSoonTool() {
  return (
    <section
      id="tools"
      className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 36px)", ["--navbar-height"]: "108px" } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        <Card className="mt-2 flex-1 min-h-0 overflow-auto">
          <div className="flex flex-col gap-4 items-center">
            <div className="grid place-items-center">
              <UnderConstruction title="Tools are under construction" />
            </div>
            <ul className="list-disc pl-5 text-sm text-zinc-800 w-full max-w-md">
              <li>Crime rate predictor based on location</li>
              <li>How hot is it gonna be based on location and time?</li>
              <li>Pokemon Unite Analytics Tool</li>
              <li>More coming soon.</li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
