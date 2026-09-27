import HeroSection from "../components/HeroSection";
import CompanyMarquee from "../components/CompanyMarquee";
import JobCategoriesGrid from "../components/JobCategoriesGrid";
import FeaturedJobs from "../components/FeaturedJobs";
import HowItWorksSection from "../components/HowItWorksSection";
import PopularIndustriesPills from "../components/PopularIndustriesPills";
import AngelAdvantage from "../components/AngelAdvantage";
import SuccessStoriesSection from "../components/SuccessStoriesSection";
import CtaBanner from "../components/CtaBanner";

export default function HomePage() {
  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      {/* 1. Dynamic Hero Section with Search, Trending Tags & Angel Motif */}
      <HeroSection />

      {/* 2. Seamless Marquee of Top Hiring Global & Startup Tech Brands */}
      <CompanyMarquee />

      {/* 3. Job Categories Grid with Open Positions & Skills */}
      <JobCategoriesGrid />

      {/* 4. Featured Premium Roles with Category Filtering & Bookmark Action */}
      <FeaturedJobs />

      {/* 5. Interactive How It Works Flow (Candidates & Employers) */}
      <HowItWorksSection />

      {/* 6. Popular Industry Sectors Cloud */}
      <PopularIndustriesPills />

      {/* 7. The Angel Advantage / Why MR. JOB WALA & Metrics */}
      <AngelAdvantage />

      {/* 8. Candidate Success Stories & Verified Testimonials */}
      <SuccessStoriesSection />

      {/* 9. High-Impact Call to Action Banner */}
      <CtaBanner />
    </main>
  );
}
