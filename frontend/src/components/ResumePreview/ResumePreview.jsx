import { forwardRef } from "react";
import ModernTemplate from "./templates/ModernTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import TechTemplate from "./templates/TechTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import CompactTemplate from "./templates/CompactTemplate";
import NordicTemplate from "./templates/NordicTemplate";
import InfographicTemplate from "./templates/InfographicTemplate";
import StartupTemplate from "./templates/StartupTemplate";
import AcademicTemplate from "./templates/AcademicTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";
import MetroTemplate from "./templates/MetroTemplate";
import CorporateTemplate from "./templates/CorporateTemplate";
import ChicTemplate from "./templates/ChicTemplate";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  tech: TechTemplate,
  elegant: ElegantTemplate,
  compact: CompactTemplate,
  nordic: NordicTemplate,
  infographic: InfographicTemplate,
  startup: StartupTemplate,
  academic: AcademicTemplate,
  timeline: TimelineTemplate,
  metro: MetroTemplate,
  corporate: CorporateTemplate,
  chic: ChicTemplate
};

const ResumePreview = forwardRef(function ResumePreview(
  { resume, templateId = "modern", color = "#2563eb", font = "Inter, sans-serif" },
  ref
) {
  const SelectedTemplate = TEMPLATE_COMPONENTS[templateId] || ModernTemplate;

  return (
    <div className="resume-page-wrapper">
      <div id="resume-printable-area" ref={ref}>
        <SelectedTemplate resume={resume} color={color} font={font} />
      </div>
    </div>
  );
});

export default ResumePreview;
