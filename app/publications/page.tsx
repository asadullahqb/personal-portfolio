import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "../components/UnderConstruction";

export default function Publications() {
  return (
    <section
      id="publications"
      className="relative w-full min-h-screen h-screen px-4 sm:px-6 md:px-8 pb-16 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 36px)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Publications"
          subtitle="Selected writings, research, and case studies."
        />
        <Card className="flex items-center justify-center">
          <UnderConstruction title="Publications are being assembled." />
        </Card>
      </div>
    </section>
  );
}
