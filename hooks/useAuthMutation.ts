import { useMutation } from "react-query";
import axios from "axios";
import cookies from "js-cookie";

const useAuthMutation = <T>(type: "login" | "register") =>
  useMutation(
    "authMutation",
    async (values: T) => {
      const url =
        type === "register" ? "/api/v1/user/register" : "/api/v1/user/login";
      const { data } = await axios.post(url, values);

      return data;
    },
    {
      onSuccess: (data) => {
        cookies.set("id", data.idToken, {
          expires: 2 / 48,
        });

        cookies.set("refresh", data.refreshToken);
      },
    }
  );

export default useAuthMutation;
