import Breadcrumb from "@/components/Breadcrumb";
import AccessRequestsLayer from "@/components/AccessRequestsLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Solicitações de Acesso - Alob Express Manager",
  description: "Aprovação de solicitações de acesso à plataforma.",
};

const Page = () => {
  return (
    <MasterLayout>
      <Breadcrumb title='Solicitações de Acesso' />
      <AccessRequestsLayer />
    </MasterLayout>
  );
};

export default Page;
