import { motion } from "framer-motion";

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
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
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
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
  },
];

export default function CompanyMarquee() {
  const duplicatedCompanies = [...COMPANIES, ...COMPANIES];

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
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <motion.div
            className="flex items-center gap-14 md:gap-20 w-max py-2"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25,
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-28 sm:w-36 h-10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 cursor-pointer transform hover:scale-110"
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-8 max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
