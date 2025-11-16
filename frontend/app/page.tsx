import Publications from "./publications/page";
import Mentorship from "./mentorship/page";
import Tools from "./tools/page";
import AssociatedProducts from "./associatedProducts/page";
import HomeClient from "./components/HomeClient";

// Determine backend URL based on environment (dev or prod)
export default function HomePage() {

  return (
    <main className="relative w-full h-full">
      <section
        id="home"
        className="flex items-center justify-center px-4 sm:px-6 md:px-8 snap-start"
        style={{
          minHeight: "100dvh",
          height: "100dvh",
        }}
      >
        <HomeClient />
      </section>
      <Tools />
      <AssociatedProducts />
      <Publications />
      <Mentorship />
    </main>
  );
}
