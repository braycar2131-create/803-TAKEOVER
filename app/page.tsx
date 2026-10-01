import Navbar from "../components/layout/Navbar";

import Loader from "../components/ui/Loader";
import ScrollProgress from "../components/ui/ScrollProgress";
import CustomCursor from "../components/ui/CustomCursor";

import MouseGlow from "../components/effects/MouseGlow";
import SmoothScroll from "../components/effects/SmoothScroll";

import Hero from "../components/sections/Hero";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import BrandStatement from "../components/sections/BrandStatement";
import Campaign from "../components/sections/Campaign";
import BrandStory from "../components/sections/BrandStory";
import Newsletter from "../components/sections/Newsletter";
import Footer from "../components/sections/Footer";

export default function Home() {
  return (
    <main className="home-page">
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <MouseGlow />
      <Loader />

      <Navbar />

      <Hero />
      <FeaturedProducts />
      <BrandStatement />
      <Campaign />
      <BrandStory />
      <Newsletter />
      <Footer />
    </main>
  );
}