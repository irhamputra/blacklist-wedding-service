import { db } from "../../../utils/firebase";

export default async (req, res) => {
  if (req.method === "GET") {
    let lists = [];

    const snapshot = await db.collection("Pelaku").get();

    snapshot.forEach((docs) => {
      lists.push(docs.data());
    });

    res.status(200).json(lists);
    res.end();
  }

  if (req.method === "POST") {
    const { id } = req.body;

    await db.collection("Pelaku").doc(id).set(req.body);

    res.status(200).json({ message: "List sudah ditambahkan" });
    res.end();
  }
};
