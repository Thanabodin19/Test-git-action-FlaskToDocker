import AppNavBar from "../_components/chat/AppNavBar";
import AppChatList from "../_components/chat/AppChatList";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#0a0a0a] h-screen flex flex-col">
      <div className="sticky z-10 top-0 bg-[#0a0a0a]">
        <AppNavBar />
      </div>
      <div className="flex justify-between items-center h-full">
        <AppChatList />
        {children}
      </div>
    </section>
  );
}
