import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "../components/UnderConstruction";

export default function Mentorship() {
  return (
    <section
      id="mentorship"
      className="relative w-full min-h-screen h-screen px-4 sm:px-6 md:px-8 pb-16 font-sans snap-start"
      style={{ paddingTop: "calc(var(--navbar-height) + 36px)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Mentorship"
          subtitle="Advice, programs, and guidance for aspiring data scientists."
        />
        <Card className="flex items-center justify-center">
          <UnderConstruction title="Mentorship content is coming soon." />
        </Card>
      </div>
    </section>
  );
}
