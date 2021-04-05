import { useQuery } from "react-query";
import axios from "axios";

const useGetAllDocs = (name: string) => {
  return useQuery(`fetchCollection${name}`, async () => {
    const { data } = await axios.get(`/api/v1/${name.toLowerCase()}`);
    return data;
  });
};

export default useGetAllDocs;
