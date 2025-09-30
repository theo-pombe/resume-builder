import { Outlet } from "react-router";
import Header from "./Header";

const AppLayout = () => {
  return (
    <div className="bg-gray-50">
      <Header />

      <div className="mt-16 max-w-screen-2xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
