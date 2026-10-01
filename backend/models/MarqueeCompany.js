import mongoose from "mongoose";

export const DEFAULT_MARQUEE_COMPANIES = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    websiteUrl: "https://about.google",
    order: 1,
    isActive: true,
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    websiteUrl: "https://www.microsoft.com",
    order: 2,
    isActive: true,
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    websiteUrl: "https://www.amazon.jobs",
    order: 3,
    isActive: true,
  },
  {
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
    websiteUrl: "https://www.spotify.com",
    order: 4,
    isActive: true,
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    websiteUrl: "https://jobs.netflix.com",
    order: 5,
    isActive: true,
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    websiteUrl: "https://www.airbnb.com",
    order: 6,
    isActive: true,
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
    websiteUrl: "https://slack.com",
    order: 7,
    isActive: true,
  },
  {
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    websiteUrl: "https://www.uber.com",
    order: 8,
    isActive: true,
  },
];

const marqueeCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    logo: {
      type: String,
      required: [true, "Company logo is required"],
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

marqueeCompanySchema.index({ order: 1, createdAt: -1 });

const MarqueeCompany = mongoose.model("MarqueeCompany", marqueeCompanySchema);

export default MarqueeCompany;
