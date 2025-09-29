import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 p-2">
      {/* Aside */}

      <div className="flex-1 flex flex-col">
        {/* Header */}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
