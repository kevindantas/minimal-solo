import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as R from 'fp-ts/lib/Record';
import { foldGameSession } from '@mikelfcosta/solo-lib/lib/session';

import { ReduxStore } from '../rootReducer';

export const getPlayer = (state: ReduxStore): O.Option<Player> => state.player;

export const getPlayerValue = (state: ReduxStore): Player => {
  if (O.isNone(state.player)) throw new Error('Cannot get player value when there is no player.');

  return state.player.value;
};

export const getPlayerIdValue = (state: ReduxStore): string =>
  pipe(
    state.player,
    O.fold(
      () => {
        throw new Error('Cannot get playerId without a player');
      },
      player => player.id,
    ),
  );

export const isCurrentPlayerAdmin = (state: ReduxStore): boolean =>
  pipe(
    state.player,
    O.fold(
      () => false,
      player =>
        pipe(
          state.session,
          foldGameSession({
            whenNoGameSession: () => false,
            whenLobbySession: session => player.id === session.admin,
            whenLoadingSession: session => player.id === session.admin,
            whenGameStarted: session => player.id === session.admin,
          }),
        ),
    ),
  );

export const isCurrentPlayerSelector = (state: ReduxStore): boolean =>
  pipe(
    state.player,
    O.fold(
      () => false,
      player =>
        pipe(
          state.session,
          foldGameSession({
            whenGameStarted: session => session.currentPlayer === player.id,
          }),
        ),
    ),
  );

export const getPlayerHandIds = (state: ReduxStore) => {
  const lookHand = (player: Player) => (session: LocalSessionWithId) =>
    pipe(
      R.lookup(player.id, session.players),
      O.fold(
        () => [],
        (p: SessionPlayer) => p.hand,
      ),
    );

  return pipe(
    state.player,
    O.fold(
      () => [],
      player =>
        pipe(
          state.session,
          foldGameSession({
            whenLoadingSession: lookHand(player),
            whenLobbySession: lookHand(player),
            whenGameStarted: lookHand(player),
          }),
        ),
    ),
  );
};
