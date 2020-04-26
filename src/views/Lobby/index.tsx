import React from "react";
import { useSelector } from "react-redux";
import { LocalSessionWithId } from "../../model/Session";
import { ReduxStore } from "../../store/rootReducer";

const getSession = (state: ReduxStore): LocalSessionWithId => state.session;

export default function Lobby() {
  const session = useSelector(getSession);
  console.log(session);

  const hasSession = !!session.code;

  return (
    <div>
      {hasSession ? (
        <>
          <h2>Admin: {session.admin}</h2>
          <h2>CODE: {session.code} </h2>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
