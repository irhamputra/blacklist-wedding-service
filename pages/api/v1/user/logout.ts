import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { idToken } = req.body;
      const verifyIdToken = await auth.verifyIdToken(idToken, true);
      await auth.revokeRefreshTokens(verifyIdToken.uid);

      await verifyIdToken;

      res.status(200).json({ message: "Logout berhasil" });
      res.end();
    } catch (e) {
      res.status(400).json({ message: "Tidak ada akun yang terautentikasi" });
      res.end();
    }
  }
};
