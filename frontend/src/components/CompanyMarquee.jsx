import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../customer/customerservice";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyMarqueeData } from "../Redux/Dashboard/DashboardAction";

const FALLBACK_COMPANIES = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    websiteUrl: "https://about.google",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    websiteUrl: "https://www.microsoft.com",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    websiteUrl: "https://www.amazon.jobs",
  },
  {
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
    websiteUrl: "https://www.spotify.com",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    websiteUrl: "https://jobs.netflix.com",
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    websiteUrl: "https://www.airbnb.com",
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
    websiteUrl: "https://slack.com",
  },
  {
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    websiteUrl: "https://www.uber.com",
  },
];

export default function CompanyMarquee() {
  const { companyMarqueeData } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState(
    companyMarqueeData || FALLBACK_COMPANIES,
  );

  useEffect(() => {
    let isMounted = true;
    const fetchCompanies = async () => {
      try {
        const response = await api.getMarqueeCompanies();
        if (
          isMounted &&
          response?.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setCompanies(response.data);
          dispatch(setCompanyMarqueeData(response.data));
        }
      } catch (error) {
        console.error("Error loading marquee companies from API:", error);
      }
    };

    if (companyMarqueeData?.length === 0) {
      fetchCompanies();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Duplicate the list enough times to ensure seamless infinite looping animation
  const displayList = companies.length > 0 ? companies : FALLBACK_COMPANIES;
  // If list is small (e.g. 1-3 items), repeat more times to ensure width is sufficient
  const repeatCount = Math.max(2, Math.ceil(8 / displayList.length));
  const duplicatedCompanies = Array(repeatCount).fill(displayList).flat();

  return (
    <section className="py-10 bg-white border-y border-brand-100/70 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Heading */}
        <div className="text-center mb-7">
          <p className="text-xs sm:text-sm font-bold text-navy-800/70 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-brand-300"></span>
            Trusted by top hiring teams &amp; fortune 500 tech leaders
            <span className="w-8 h-px bg-brand-300"></span>
          </p>
        </div>

        {/* Marquee Container with Gradient Mask */}
        <div
          className="relative flex items-center max-w-6xl mx-auto w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <motion.div
            className="flex items-center gap-14 md:gap-20 w-max py-2 select-none"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: Math.max(18, displayList.length * 3),
            }}
          >
            {duplicatedCompanies.map((company, index) => {
              const content = (
                <div
                  className="flex items-center justify-center w-28 sm:w-36 h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer transform hover:scale-110"
                  title={company.name}
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-h-8 max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              );

              return company.websiteUrl ? (
                <a
                  key={`${company._id || company.name}-${index}`}
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block focus:outline-none"
                  aria-label={`Visit ${company.name} website`}
                >
                  {content}
                </a>
              ) : (
                <div key={`${company._id || company.name}-${index}`}>
                  {content}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
