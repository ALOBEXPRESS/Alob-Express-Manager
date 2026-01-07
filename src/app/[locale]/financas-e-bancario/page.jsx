import Breadcrumb from "@/components/Breadcrumb";
import DashBoardLayerEleven from "@/components/DashBoardLayerEleven";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "WowDash NEXT JS - Admin Dashboard Multipurpose Bootstrap 5 Template",
  description:
    "Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
};

const Page = () => {
  const t = useTranslations("dashboard");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title={t("finance_banking")} />

        {/* DashBoardLayerEleven */}
        <DashBoardLayerEleven />
      </MasterLayout>
    </>
  );
};

export default Page;
