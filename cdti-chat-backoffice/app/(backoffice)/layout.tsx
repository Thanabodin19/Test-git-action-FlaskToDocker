import { ConfigProvider } from "antd";
import AppSideMenu from "../_components/AppSideMenu";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#636FA4",
        },
        components: {
          Spin: {
            colorPrimary: "#636FA4",
          },
        },
      }}
    >
      <section className="flex justify-start items-center">
        <AppSideMenu />
        <div className="w-full h-screen px-10 overflow-auto py-5">
          {children}
        </div>
      </section>
    </ConfigProvider>
  );
}
