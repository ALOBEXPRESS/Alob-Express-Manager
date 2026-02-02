import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import { CalculatorWrapper } from "@/features/calculator/components/CalculatorWrapper";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Alob Express Manager - Calculadora Dropshipping",
  description: "Calculadora de precificação e margem de lucro para dropshipping integrada.",
};

const Page = () => {
  const t = useTranslations("sidebar");

  return (
    <MasterLayout>
      <Breadcrumb title={t("calculator")} />
      <div className="row gy-4 mt-4">
        <div className="col-12">
          <div className="card h-100 radius-8 border-0">
            <div className="card-body p-0">
              {/* Native Calculator Component */}
              <CalculatorWrapper />
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Page;
