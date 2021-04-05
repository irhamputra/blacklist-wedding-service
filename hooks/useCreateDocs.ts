import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useCreateDocs = <T>(name: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    `createDocs${name}`,
    async (values: T) => {
      await axios.post(`/api/v1/${name.toLowerCase()}`, values);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(`fetchCollection${name}`);
      },
    }
  );
};

export default useCreateDocs;
