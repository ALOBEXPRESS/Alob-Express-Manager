import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useTranslations } from "next-intl";
import { CalculatorWrapper } from "@/features/calculator/components/CalculatorWrapper";

export const metadata = {
  title: "Alob Express Manager - Calculadora Dropshipping",
  description: "Calculadora de precificação e margem de lucro para dropshipping integrada.",
};

const Page = () => {
  const t = useTranslations("sidebar");

  return (
    <MasterLayout>
      <Breadcrumb title={t("calculator")} />
      <div className="mt-4">
        <CalculatorWrapper />
      </div>
    </MasterLayout>
  );
};

export default Page;
