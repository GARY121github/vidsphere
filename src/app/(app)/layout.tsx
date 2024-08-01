import Navbar from "@/components/navbar/navbar";
import SidebarDesktop from "@/components/sidebar/sidebar-desktop";
interface LayoutProps {
  children: React.ReactNode;
}

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="max-h-screen flex flex-col">
      <Navbar />
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
        <SidebarDesktop />
        <div className="overflow-x-hidden px-8 pb-4">
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default layout;
