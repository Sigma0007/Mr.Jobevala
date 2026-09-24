import { forwardRef } from "react";
import ModernTemplate from "./templates/ModernTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate
};

const ResumePreview = forwardRef(function ResumePreview(
  { resume, templateId = "modern", color = "#2563eb", font = "Inter" },
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
