import Hero from "../components/Hero";
import BestSellers from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import ProductList from "../components/ProductList";

export default function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <AboutSection />
      <ProductList />
      <Testimonials />

    </>
  );
}