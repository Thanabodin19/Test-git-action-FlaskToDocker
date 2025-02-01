import AppEditDoc from "@/app/_components/AppEditDoc";
import { App } from "antd";

const EditDoc = async ({ params }: { params: Promise<{ _id: string }> }) => {
  const slug = (await params)._id;
  return (
    <App>
      <AppEditDoc id={slug} />
    </App>
  );
};

export default EditDoc;
