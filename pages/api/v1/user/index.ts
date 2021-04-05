import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { serviceAccount } from "../../../../utils/serviceAccount";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const BASE_URL = "https://identitytoolkit.googleapis.com/v1";

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    params: {
      key: serviceAccount.apiKey,
    },
  });

  if (req.method === "GET") {
    const token = req.headers.authorization.replace("Bearer ", "");

    const { data } = await instance.post("/accounts:lookup", {
      idToken: token,
    });

    res.status(200).json(data);
  }
};
