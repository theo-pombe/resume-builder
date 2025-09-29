import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="bg-gray-50">
      {/* Header */}

      <div className="mt-16 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
