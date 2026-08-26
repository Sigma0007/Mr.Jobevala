import { motion } from "framer-motion";

// Using reliable, high-quality SVG logos of top companies
const COMPANIES = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  },
  {
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
];

export default function CompanyMarquee() {
  // We duplicate the array to create a seamless, infinite loop
  const duplicatedCompanies = [...COMPANIES, ...COMPANIES];

  return (
    <section className="py-12 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Heading */}
        <div className="text-center mb-8">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Trusted by teams at top companies worldwide
          </p>
        </div>

        {/* 
          Marquee Container 
          The mask-image creates that premium fade-in/fade-out effect on the left and right edges.
        */}
        <div
          className="relative flex items-center max-w-5xl mx-auto w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          {/* Framer Motion Infinite Scroll */}
          <motion.div
            className="flex items-center gap-16 md:gap-24 w-max"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // Adjust speed here (higher = slower)
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-32 md:w-40"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  // Removed grayscale and adjusted base opacity to 70%
                  className="w-full h-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
