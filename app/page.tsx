import Publications from "./publications/page";
import Mentorship from "./mentorship/page";
import Tools from "./tools/page";

export default function HomePage() {
  return (
    <main>
      <section id="home" className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-5xl font-bold">Welcome</h1>
      </section>

      <section id="tools" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Tools />
      </section>

      <section id="publications" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Publications />
      </section>

      <section id="mentorship" className="min-h-screen flex items-center justify-center bg-gray-50">
        <Mentorship />
      </section>
    </main>
  );
}
