import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Button";
import {
  createGameSession,
  joinGameSession,
} from "../../store/session/actions";
import { RoomInput, RoomSelectWrapper, Title } from "./styles";

export default function Entrance() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const changeName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.currentTarget.value);
  const changeCode = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCode(event.currentTarget.value);

  const createRoom = async () => {
    //TODO pass sessionID to path
    await dispatch(createGameSession(name));
    history.push("/lobby");
  };

  const getRoom = async () => {
    //TODO: Redux thunk is ruining the typing =(
    const result = await dispatch(joinGameSession(code, name));
    // @ts-ignore
    if (result) {
      history.push("/lobby");
    }
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
