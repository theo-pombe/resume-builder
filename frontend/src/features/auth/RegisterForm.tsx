import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RegisterType } from "app-auth";
import type { AlertType } from "app-ui";
import Alert from "../../components/ui/Alert";
import Label from "../../components/form/Label";
import TextInput from "../../components/form/TextInput";

const RegisterForm = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<AlertType>();
  const [formData, setFormData] = useState<RegisterType>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
    } catch (error) {
      if (error instanceof Error)
        setAlert({ success: false, messages: [error.message] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="post" onSubmit={onSubmitHandler}>
      {alert && (
        <div className="absolute right-0 top-0">
          <Alert alert={alert} setAlert={setAlert} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="basis-1/2 flex flex-col space-y-1.5">
          <Label
            style="block text-gray-700 mb-1 capitalize"
            htmlFor="username"
            text={t("username")}
          />
          <TextInput
            style="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            name="username"
            value={formData.username}
            onChange={onChangeHandler}
          />
        </div>

        <div className="basis-1/2 flex flex-col space-y-1.5">
          <Label
            style="block text-gray-700 mb-1 capitalize"
            htmlFor="email"
            text={t("email")}
          />
          <TextInput
            style="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
          />
        </div>

        <div className="basis-1/2 flex flex-col space-y-1.5">
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

        <div className="basis-1/2 flex flex-col space-y-1.5">
          <Label
            style="block text-gray-700 mb-1 capitalize"
            htmlFor="confirmPassword"
            text={t("password_confirm")}
          />
          <TextInput
            style="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChangeHandler}
          />
        </div>

        <div className="basis-1/2">
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center cursor-pointer items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 transition"
          >
            {loading ? t("loading") : t("register")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
