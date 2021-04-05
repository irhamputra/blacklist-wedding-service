import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { serviceAccount } from "../../../../utils/serviceAccount";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  const BASE_URL = "https://identitytoolkit.googleapis.com/v1";

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    params: {
      key: serviceAccount.apiKey,
    },
  });

  if (req.method === "POST") {
    const { email, password, displayName } = req.body;

    const snapshot = await db
      .collection("Users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      res.status(500).json({ message: "Email telah terdaftar" });
      res.end();
    }

    try {
      const { data } = await instance.post("/accounts:signUp", {
        email,
        password,
        returnSecureToken: true,
      });

      await instance.post("/accounts:sendOobCode", {
        requestType: "VERIFY_EMAIL",
        idToken: data.idToken,
      });

      await db.collection("Users").doc(data.localId).set({
        email,
        displayName,
      });

      res.status(200).json({ message: "Register berhasil", ...data });
      res.end();
    } catch (e) {
      res.status(500).json({ message: e.message });
      res.end();
    }
  }
};
