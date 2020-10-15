import {RequestHandler} from "express";
import {buildOne, createAvatar, sortDeck} from "../../../helpers/game";
import * as admin from "firebase-admin";
import * as O from "fp-ts/Option";

const codeGenerator = () => {
  return String(Math.round(Math.random() * 100000));
};

type PostBody = {
  playerId: string;
  playerName: string;
}

export const postCreateLobby: RequestHandler<{}, {}, PostBody> = async (req, res) => {
  const { playerId, playerName } = req.body;

  const deck = sortDeck(buildOne());
  const session = await admin.firestore().collection("session").add({
    code: codeGenerator(),
    status: "INITIAL",
    admin: playerId,
    loadingStatus: O.none,
  });

  await admin
    .firestore()
    .collection("session")
    .doc(session.id)
    .collection("players")
    .doc(playerId)
    .set({
      name: playerName,
      position: 0,
      hand: [],
      avatar: createAvatar(),
      status: "ADMIN",
    });

  const batch = admin.firestore().batch();
  deck.forEach((card) => {
    batch.create(session.collection("deck").doc(), card);
  });
  batch.commit();

  try {
    const sessionDoc = await session.get();
    const players = await session.collection("players").listDocuments();
    const sessionWithId = {
      ...sessionDoc.data(),
      players: players.values(),
      id: sessionDoc.id,
    };

    res.send(sessionWithId);
  } catch (e) {
    res.status(500).send(e);
  }
}