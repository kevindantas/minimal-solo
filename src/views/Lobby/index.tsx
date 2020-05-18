import React from 'react';
import { useSelector } from 'react-redux';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { ActionWrapper, Code, Page, Title, LobbyWrapper } from './styles';

import { Button } from '../../components/Button';
import {
  allPlayersReady,
  getCurrentSessionPlayer,
  getSessionValue,
} from '../../store/session/selectors';
import { isCurrentPlayerAdmin, getPlayerIdValue } from '../../store/playerHand/selector';
import { useMatchMaker } from '../../hooks/useMatchMaker';
import { usePlayersGrid } from '../../hooks/usePlayersGrid';
import { JoinModal } from './components/JoinModal';

export default function Lobby() {
  const currentSession = useSelector(getSessionValue);
  const isAllPlayersReady = useSelector(allPlayersReady);
  const currentPlayerId = useSelector(getPlayerIdValue);
  const currentSessionPlayer = useSelector(getCurrentSessionPlayer);
  const isAdmin = useSelector(isCurrentPlayerAdmin);
  const playersGrid = usePlayersGrid();

  const { toggleStatus, startGame } = useMatchMaker();

  return (
    <Page>
      <LobbyWrapper>
        <Title>Room Code</Title>
        <Code>{currentSession.code}</Code>
        <Title>Players</Title>
        {playersGrid}
        <ActionWrapper>
          {pipe(
            currentSessionPlayer,
            O.fold(
              () => <div />,
              player =>
                isAdmin ? (
                  <Button onClick={startGame} disabled={!isAllPlayersReady}>
                    Start Game
                  </Button>
                ) : (
                  <Button
                    variant={player.status === 'READY' ? 'secondary' : 'primary'}
                    onClick={toggleStatus(currentPlayerId, player.status)}
                  >
                    {player.status === 'READY' ? 'Ready' : 'Not Ready'}
                  </Button>
                ),
            ),
          )}
        </ActionWrapper>
        <JoinModal />
      </LobbyWrapper>
    </Page>
  );
}
