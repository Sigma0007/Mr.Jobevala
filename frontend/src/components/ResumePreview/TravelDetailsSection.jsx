import { ShieldCheck, Calendar, Plane, CreditCard, FileCheck, Globe, CheckCircle2 } from "lucide-react";

export default function TravelDetailsSection({
  travelDetails,
  title = "PASSPORT, LICENSE & TRAVEL DETAILS",
  variant = "modern",
  layout = "grid" // "grid" | "sidebar" | "compact" | "tech" | "minimal" | "badges"
}) {
  if (!travelDetails) return null;

  const {
    passportNumber,
    passportExpiry,
    drivingLicense,
    aadhaarStatus,
    overseasDeployment,
    visaStatus
  } = travelDetails;

  const items = [
    {
      key: "passportNumber",
      label: "Passport Number",
      value: passportNumber,
      icon: Globe
    },
    {
      key: "drivingLicense",
      label: "Driving License",
      value: drivingLicense,
      icon: CreditCard
    },
    {
      key: "passportExpiry",
      label: "Passport Expiry",
      value: passportExpiry,
      icon: Calendar
    },
    {
      key: "aadhaarStatus",
      label: "Aadhaar Status",
      value: aadhaarStatus,
      icon: ShieldCheck
    },
    {
      key: "overseasDeployment",
      label: "Overseas Deployment",
      value: overseasDeployment,
      icon: Plane
    },
    {
      key: "visaStatus",
      label: "Visa Status",
      value: visaStatus,
      icon: FileCheck
    }
  ].filter((item) => item.value && String(item.value).trim() !== "");

  if (items.length === 0) return null;

  // Render variant-specific markup
  if (variant === "tech") {
    return (
      <section className="resume-section-block tech-section">
        <div className="tech-section-title">
          <Plane className="tech-title-icon" />
          <span>04. TRAVEL_AND_IDENTITY_DETAILS</span>
        </div>
        <div className="tech-travel-grid">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="tech-travel-item">
                <span className="tech-travel-label">
                  <Icon className="w-3 h-3 inline mr-1 text-sky-500" />
                  {item.label}:
                </span>
                <span className="tech-travel-value">{item.value}</span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (layout === "sidebar" || variant === "creative" || variant === "compact" || variant === "nordic") {
    return (
      <section className="resume-section-block resume-travel-sidebar-block">
        <h3 className="resume-travel-side-title">{title}</h3>
        <div className="resume-travel-sidebar-list">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="resume-travel-side-item">
                <div className="resume-travel-side-label">
                  <Icon className="resume-travel-icon" />
                  <span>{item.label}</span>
                </div>
                <div className="resume-travel-side-value">{item.value}</div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className={`resume-section-block resume-travel-section variant-${variant}`}>
      <h2 className="resume-travel-section-title">{title}</h2>
      <div className="resume-travel-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="resume-travel-card">
              <div className="resume-travel-card-header">
                <Icon className="resume-travel-icon" />
                <span className="resume-travel-label">{item.label}</span>
              </div>
              <div className="resume-travel-value">{item.value}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
