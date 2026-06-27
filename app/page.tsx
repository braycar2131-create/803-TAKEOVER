import Loader from "../components/ui/Loader";
import Hero from "../components/sections/Hero";
import Collections from "../components/sections/Collections";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Campaign from "../components/sections/Campaign";
import Lookbook from "../components/sections/Lookbook";
import BrandStory from "../components/sections/BrandStory";
import SocialFeed from "../components/sections/SocialFeed";
import Newsletter from "../components/sections/Newsletter";
import Footer from "../components/sections/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <main>
        <Hero />
        <Collections />
        <FeaturedProducts />
        <Campaign />
        <Lookbook />
        <BrandStory />
        <SocialFeed />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
