import HeroSection from "@/components/home/HeroSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import InstructorsSection from "@/components/home/InstructorsSection";
import PartnersSection from "@/components/home/PartnersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import { BannerContentSection } from "@/components/banners/public/BannerContentSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4">
        <BannerContentSection />
      </div>
      <FeaturedCoursesSection />
      <FeaturesSection />
      <InstructorsSection />
      <PartnersSection />
      <FaqSection />
      <TestimonialsSection />
    </>
  );
};

export default Home;
