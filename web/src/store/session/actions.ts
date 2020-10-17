import { batch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import axios from 'axios';

import { SessionPlayer, SessionPlayerWithId, PlayerStatus } from '../../model/Player';
import {
  requestCreateSession,
  requestJoinSession,
  requestAddPlayer,
  requestTogglePlayerStatus,
} from '../../api/db/preGameSession';
import { LocalSessionWithId, Normalized } from '../../model/Session';
import { ThunkResult } from '../types';
import { ReduxStore } from '../rootReducer';
import { Play } from '../../model/Play';
import { requestAddPlay } from '../../api/db/gameSession';
import { captureLog } from '../../utils/sentry';
import { firebaseConfig } from '../../api/config';

export const SET_SESSION = 'SET_SESSION' as const;
export const ADD_PLAYER = 'ADD_PLAYER' as const;
export const CLEAR_SESSION = 'CLEAR_SESSION' as const;
export const SET_PLAYER_STATUS = 'SET_PLAYER_STATUS' as const;
export const SET_GAME_PROGRESSION = 'SET_GAME_PROGRESSION' as const;
export const SET_CURRENT_PLAYER = 'SET_CURRENT_PLAYER' as const;
export const SET_CURRENT_PLAY = 'SET_CURRENT_PLAY' as const;
export const SET_CURRENT_CARD = 'SET_CURRENT_CARD' as const;

export type SessionThunkDispatch = ThunkDispatch<LocalSessionWithId, {}, SessionActionTypes>;
export type SessionThunkResult<T> = ThunkResult<T, LocalSessionWithId, SessionActionTypes>;

export function setGameSession(session: LocalSessionWithId) {
  return {
    type: SET_SESSION,
    payload: session,
  };
}
export function setGameProgression(progression: Normalized<Play>) {
  return {
    type: SET_GAME_PROGRESSION,
    payload: progression,
  };
}

function setPlayer(player: SessionPlayerWithId) {
  return {
    type: SET_PLAYER_STATUS,
    payload: player,
  };
}

export function clearSession() {
  return {
    type: CLEAR_SESSION,
  };
}

function addPlayers(player: Normalized<SessionPlayer>) {
  return {
    type: ADD_PLAYER,
    payload: player,
  };
}

export function setCurrentPlayer(playerId: string) {
  return {
    type: SET_CURRENT_PLAYER,
    payload: playerId,
  };
}

export function setCurrentPlay(playId: string) {
  return {
    type: SET_CURRENT_PLAY,
    payload: playId,
  };
}

export function setCurrentCard(card: Card) {
  return {
    type: SET_CURRENT_CARD,
    payload: card,
  };
}

export function createGameSession(
  name: string,
  playerId: string,
): SessionThunkResult<E.Either<LocalSessionWithId, any>> {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const session = await requestCreateSession(name, playerId);
      dispatch(setGameSession(session));
      return E.right(session);
    } catch (error) {
      console.error(error);
      return E.left(error);
    }
  };
}

export function addNewPlayer(player: Normalized<SessionPlayer>) {
  return async (dispatch: SessionThunkDispatch) => {
    dispatch(addPlayers(player));
  };
}

export function joinGameSession(
  sessionCode: string,
  name: string,
  playerId: string,
): SessionThunkResult<E.Either<LocalSessionWithId, any>> {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const { session, playersCount } = await requestJoinSession(sessionCode);
      const player = await requestAddPlayer(session.id, name, playerId, playersCount);
      batch(() => {
        dispatch(setGameSession(session));
        dispatch(addPlayers({ [playerId]: player }));
      });
      return E.right(session);
    } catch (error) {
      captureLog(error);
      return E.left(error);
    }
  };
}

export async function togglePlayerStatus(
  sessionId: string,
  playerId: string,
  playerStatus: PlayerStatus,
) {
  try {
    await requestTogglePlayerStatus(sessionId, playerId, playerStatus);
  } catch (error) {
    console.error(error);
  }
}

export function startGameSession(sessionId: string) {
  return async (dispatch: SessionThunkDispatch) => {
    try {
      const response = await axios.request({
        method: 'POST',
        baseURL: firebaseConfig.baseApi,
        url: `/lobby/${sessionId}/start`,
      });

      dispatch(setGameSession({ ...response.data, progression: {} }));
    } catch (error) {
      console.error(error);
    }
  };
}

export function addPlay(play: Play) {
  return async (dispatch: SessionThunkDispatch, getState: () => ReduxStore) => {
    try {
      const state = getState();

      if (O.isNone(state.session)) throw new Error('Cannot add a play without a session.');

      const result = await requestAddPlay(state.session.value.id, play);
      console.log({ result });
    } catch (error) {
      console.error(error);
    }
  };
}

export type SessionActionTypes = ReturnType<
  | typeof setGameSession
  | typeof addPlayers
  | typeof clearSession
  | typeof setPlayer
  | typeof setGameProgression
  | typeof setCurrentPlayer
  | typeof setCurrentPlay
  | typeof setCurrentCard
>;
