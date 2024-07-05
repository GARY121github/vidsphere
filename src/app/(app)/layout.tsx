import Navbar from "@/components/navbar/navbar";
import SidebarDesktop from "@/components/sidebar/sidebar-desktop";
interface LayoutProps {
  children: React.ReactNode;
}

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col max-h-screen">
      <Navbar />
      <div className="grid grid-cols-[auto , 1fr] flex-grow-1 overflow-auto">
        <div>
          <SidebarDesktop />
        </div>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill , minmax(300px , 1fr))]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
