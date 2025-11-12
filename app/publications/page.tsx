import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "../components/UnderConstruction";

export default function Publications() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 md:px-8 font-sans">
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
