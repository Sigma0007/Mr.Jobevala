import HeroSection from "../components/HeroSection";
import CompanyMarquee from "../components/CompanyMarquee";
import JobCategoriesGrid from "../components/JobCategoriesGrid";
import PopularIndustriesPills from "../components/PopularIndustriesPills";
import FeaturedJobs from "../components/FeaturedJobs";
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CompanyMarquee />
      <JobCategoriesGrid />
      <PopularIndustriesPills />
      <FeaturedJobs />
    </main>
  );
}
