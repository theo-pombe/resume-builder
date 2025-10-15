import type { FetchResponseType } from "app-shared";
import type { AlertType } from "app-ui";

export const logAlert = (
  result: FetchResponseType,
  setAlert: React.Dispatch<React.SetStateAction<AlertType | undefined>>
): boolean => {
  const messages = result.errors?.length
    ? result.errors.map((err) => err.message)
    : [result.message];

  setAlert({
    success: result.success,
    messages,
  });

  return result.success;
};
