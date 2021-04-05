import { useMutation } from "react-query";
import axios from "axios";
import cookies from "js-cookie";
import { useRouter } from "next/router";

const useLogoutUser = () => {
  const { reload } = useRouter();

  return useMutation(
    "logoutUser",
    async (token: string) => {
      const { data } = await axios.post("/api/v1/user/logout", {
        idToken: token,
      });
      return data;
    },
    {
      onSuccess: () => {
        cookies.remove("id");
        cookies.remove("refresh");

        reload();
      },
    }
  );
};

export default useLogoutUser;
