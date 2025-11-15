import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "@/app/components/UnderConstruction";

export default function ComingSoonTool() {
  return (
    <section
      id="tools"
      className="relative w-full min-h-[100dvh] h-[100dvh] px-4 sm:px-6 md:px-8 pb-0 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 36px)", ["--navbar-height"]: "108px" } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col pb-24">
        <SectionHeading title="Coming Soon" subtitle="This tool is under construction." className="mb-0" />
        <Card className="mt-8 flex-1 min-h-0 flex items-center justify-center">
          <UnderConstruction title="This tool is under construction." />
        </Card>
      </div>
    </section>
  );
}
