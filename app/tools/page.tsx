import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "../components/UnderConstruction";
import Button from "@/app/components/ui/Button";

export default function Tools() {
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
        <Card className="mt-8 flex-1 min-h-0 flex items-center justify-center">
          <UnderConstruction title="Tools are being built." />
        </Card>
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
        <Button href="#tools" className="px-0 py-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll up">
          <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 7.5l6 6-1.4 1.4L12 10.3l-4.6 4.6L6 13.5l6-6z" />
          </svg>
        </Button>
        <Button href="#associatedProducts" className="px-0 py-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll down">
          <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4-6 6z" />
          </svg>
        </Button>
      </div>
    </section>
  );
}
