import { Route } from "react-router";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";

const UserRoutes = () => {
  return (
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />} />
    </Route>
  );
};

export default UserRoutes;
