import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "../components/UnderConstruction";

export default function Tools() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Tools"
          subtitle="A growing set of AI-powered utilities."
        />
        <Card className="flex items-center justify-center">
          <UnderConstruction title="Tools are being built." />
        </Card>
      </div>
    </section>
  );
}
