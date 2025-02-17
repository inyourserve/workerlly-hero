import { Sidebar } from '@/components/dashboard/Sidebar'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
};

export default Layout;
