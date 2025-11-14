import Card from "@/app/components/ui/Card";
import SectionHeading from "@/app/components/ui/Heading";
import UnderConstruction from "../components/UnderConstruction";
import Button from "@/app/components/ui/Button";

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
      <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
        <Button href="#publications" className="px-0 py-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-md hover:scale-105 transition transform" ariaLabel="Scroll to previous">
          <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 7.5l6 6-1.4 1.4L12 10.3l-4.6 4.6L6 13.5l6-6z" />
          </svg>
        </Button>
        <Button href="#home" className="px-0 py-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-md hover:scale-105 transition transform" ariaLabel="Back to top">
          <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 12l9-9 9 9h-3v7H6v-7H3z" />
          </svg>
        </Button>
      </div>
    </section>
  );
}
