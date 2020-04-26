import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  requestSessionPlayersListener,
  requestTogglePlayerStatus,
} from "../../api/db/session";
import { LocalSessionWithId } from "../../model/Session";
import { ReduxStore } from "../../store/rootReducer";
import { addNewPlayer, clearSession } from "../../store/session/actions";
import { LobbyPlayerCard } from "../../components/LobbyPlayerCard";
import { PlayerStatus } from "../../model/Player";
import { Code, Page, PlayersWrapper, Title } from "./styles";
import { Button } from "../../components/Button";

const getSession = (state: ReduxStore): LocalSessionWithId => state.session;

export default function Lobby() {
  const currentSession = useSelector(getSession);
  const dispatch = useDispatch();
  const [hasListener, setHasListener] = useState<boolean>(false);

  useEffect(() => {
    if (currentSession.id && !hasListener) {
      setHasListener(true);

      requestSessionPlayersListener(currentSession.id, (p) =>
        dispatch(addNewPlayer(p))
      );
    }

    return () => {
      dispatch(clearSession);
    };
  }, [currentSession.id, hasListener, dispatch]);

  const toggleStatus = (
    playerId: string,
    playerStatus: PlayerStatus
  ) => async () => {
    await requestTogglePlayerStatus(currentSession.id, playerId, playerStatus);
  };

  //TODO: IMPROVE TOOGLE STATUS LOGIC
  const players = Object.entries(currentSession.players);
  const isAdmin =
    currentSession.players[0] && currentSession.players[0].status === "ADMIN";

  const hasSession = !!currentSession.code;
  return (
    <Page>
      {hasSession ? (
        <>
          <Title>Player Code</Title>
          <Code>{currentSession.code}</Code>
          <Title>Players</Title>
          <PlayersWrapper>
            {players.map(([id, player]) => {
              return (
                <LobbyPlayerCard
                  key={id}
                  name={player.name}
                  avatar={"http://placekitten.com/32/32"}
                  status={player.status}
                />
              );
            })}
          </PlayersWrapper>
          {isAdmin ? <Button>Start Game</Button> : <Button>Ready</Button>}
        </>
      ) : (
        <Title>Loading...</Title>
      )}
    </Page>
  );
}
