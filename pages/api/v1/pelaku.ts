import { db } from "../../../utils/firebase";

export default async (req, res) => {
  if (req.method === "GET") {
    let lists = [];

    const snapshot = await db.collection("Pelaku").get();

    snapshot.forEach((docs) => {
      lists.push(docs.data());
    });

    res.status(200).json(lists);
  }
};
