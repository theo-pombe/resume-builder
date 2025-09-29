import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LoginType } from "app-auth";
import type { AlertType } from "app-ui";
import Alert from "../../components/ui/Alert";
import TextInput from "../../components/form/TextInput";
import Label from "../../components/form/Label";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

const LoginForm = () => {
  const { t } = useTranslation();
  const { loading, login } = useAuth();
  const [alert, setAlert] = useState<AlertType>();
  const [formData, setFormData] = useState<LoginType>({
    usernameOrEmail: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // If coming from ProtectedRoute
  const from = location.state?.from?.pathname || "/";

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { user } = await login(formData);

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/resume", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setAlert({
        success: false,
        messages: [error.message || "Something went wrong"],
      });
    }
  };

  return (
    <form method="post" onSubmit={onSubmitHandler} className="relative">
      {alert && (
        <div className="absolute right-0 top-0">
          <Alert alert={alert} setAlert={setAlert} />
        </div>
      )}

      <div className="space-y-5">
        <div className="flex flex-col space-y-1.5">
          <Label
            style="block text-gray-700 mb-1 capitalize"
            htmlFor="usernameOrEmail"
            text={t("username")}
          />
          <TextInput
            style="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={onChangeHandler}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label
            style="block text-gray-700 mb-1 capitalize"
            htmlFor="password"
            text={t("password")}
          />
          <TextInput
            style="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChangeHandler}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center cursor-pointer gap-2 bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition w-full"
          >
            {loading ? t("loading") : t("login")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
