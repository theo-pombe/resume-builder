import { Outlet } from "react-router";
import SideBarNav from "../components/SideBarNav";

const ResumeLayout = () => {
  return (
    <main className="md:px-4 py-6 h-[calc(100vh-64px)]">
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 h-full">
        <aside className="md:basis-1/4 lg:basis-1/5 bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
          <SideBarNav />
        </aside>

        <section className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default ResumeLayout;
