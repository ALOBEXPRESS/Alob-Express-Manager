import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import CalculatorEmbed from "@/components/CalculatorEmbed";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Alob Express Manager - Calculadora Dropshipping",
  description: "Calculadora de precificação e margem de lucro para dropshipping integrada.",
};

const Page = () => {
  const t = useTranslations("sidebar");
  // Default to localhost:5173 for dev, can be overridden by env var
  const calculatorUrl =
    (process.env.NEXT_PUBLIC_CALCULATOR_URL || "http://localhost:5173").trim();
  
  console.log("Rendering Dashboard Page, Calculator URL:", calculatorUrl);

  return (
    <MasterLayout>
      <Breadcrumb title={t("calculator")} />
      <div className="row gy-4 mt-4">
        <div className="col-12">
          <div className="card h-100 radius-8 border-0">
            <div className="card-body p-0">
              {/* Iframe container with responsive height */}
              <CalculatorEmbed src={calculatorUrl} title={t("calculator")} />
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Page;
