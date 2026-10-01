import { Globe, CreditCard, Calendar, ShieldCheck, Plane, FileCheck } from "lucide-react";

export default function TravelDetailsForm({ data = {}, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
        <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold">Passport & Overseas Verification:</span> These travel, identification and overseas deployment details will be featured in a dedicated section across all 16 resume templates.
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            Passport Number
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. X9546559"
            value={data.passportNumber || ""}
            onChange={(e) => handleChange("passportNumber", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Passport Expiry
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 11/05/2033"
            value={data.passportExpiry || ""}
            onChange={(e) => handleChange("passportExpiry", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            Driving License
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Valid Indian DL Available"
            value={data.drivingLicense || ""}
            onChange={(e) => handleChange("drivingLicense", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            Aadhaar Status
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. [Aadhaar Redacted] or Verified"
            value={data.aadhaarStatus || ""}
            onChange={(e) => handleChange("aadhaarStatus", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-slate-500" />
            Overseas Deployment
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Ready (Original Passport)"
            value={data.overseasDeployment || ""}
            onChange={(e) => handleChange("overseasDeployment", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-slate-500" />
            Visa Status
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Clear (Eligible for Employment Visa)"
            value={data.visaStatus || ""}
            onChange={(e) => handleChange("visaStatus", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
