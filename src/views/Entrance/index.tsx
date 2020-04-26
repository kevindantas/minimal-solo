import React, { useState } from "react";
import { RoomSelectWrapper, Title, RoomInput } from "./styles";
import { Button } from "../../components/Button";
import { useDispatch } from "react-redux";
import { createGameSession } from "../../store/session/actions";
import { useHistory } from "react-router-dom";
import { getSession } from "../../api/db/session";

export default function Entrance() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("25427");
  const dispatch = useDispatch();
  const history = useHistory();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  const createRoom = () => {
    //TODO pass sessionID to path
    const sessionId = dispatch(createGameSession(name));
    history.push("/lobby");
  };

  const getRoom = async () => {
    const session = await getSession(code);
    console.log({ session });
  };

  return (
    <RoomSelectWrapper>
      <Title>JOIN A ROOM</Title>
      <RoomInput placeholder="Room code" value={code} onChange={changeCode} />
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <Button onClick={getRoom}>JOIN</Button>
      <h2>OR CREATE A NEW ONE</h2>
      <RoomInput placeholder="Your name" value={name} onChange={changeName} />
      <Button onClick={createRoom} variant="secondary">
        CREATE
      </Button>
    </RoomSelectWrapper>
  );
}
