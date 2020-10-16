import { RequestHandler } from "express";
import * as admin from "firebase-admin";

type ReqParams = {
  code: string;
};

export const getSessionByCode: RequestHandler<ReqParams> = async (req, res) => {
  const { code } = req.params;

  const sessionByCode = await admin
    .firestore()
    .collection("session")
    .where("code", "==", code)
    .get();

  const [sessionDoc] = sessionByCode.docs.values();

  const session = sessionDoc.data();
  const playersDoc = sessionDoc.get("players");
  const players = playersDoc.data();

  return res.send({ ...session, players });
};