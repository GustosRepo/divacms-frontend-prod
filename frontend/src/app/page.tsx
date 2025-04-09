import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import BestSellers from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen text-center bg-gradient-to-br  from-pink-100 via-purple-200 to-blue-200">
     <Navbar />
      <Hero />
      <BestSellers />
      <Testimonials />
      <AboutSection /> 
      <ProductList />
    </main>
  );
}