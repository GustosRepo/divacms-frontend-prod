import Hero from "../components/Hero";
import BestSellers from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import ProductList from "../components/ProductList";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 space-y-16">
        <BestSellers />
        <AboutSection />
        <ProductList />
        <Testimonials />
      </div>
    </>
  );
}