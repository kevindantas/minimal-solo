import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { ReduxStore } from '../../rootReducer';
import { LocalNoGameSessionWithId, LocalGameSessionWithId } from '../../../model/Session';

type FoldParams<B = void> = {
  whenNoGameSession?: (s: LocalNoGameSessionWithId) => B | void;
  whenLoadingSession?: (s: LocalNoGameSessionWithId) => B | void;
  whenGameStarted?: (s: LocalGameSessionWithId) => B | void;
};

const foldGameSessionDefault = {
  whenNoGameSession: () => {
    throw new Error('Should not have No game session');
  },
  whenLoadingSession: () => {
    throw new Error('Should not have loading session');
  },
  whenGameStarted: () => {
    throw new Error('Should not have No game session');
  },
};

export const foldGameSession = <B>({
  whenNoGameSession,
  whenLoadingSession,
  whenGameStarted,
}: FoldParams<B> = foldGameSessionDefault) => (state: ReduxStore): B | void =>
  pipe(
    state.session,
    O.fold(
      () => {
        throw new Error("Get Session Value can only be used when there's a session");
      },
      session => {
        switch (session.status) {
          case 'INITIAL':
            if (whenNoGameSession) return whenNoGameSession(session);
            break;
          case 'STARTING':
            if (whenLoadingSession) return whenLoadingSession(session);
            break;
          case 'STARTED':
          case 'FINISHED':
            if (whenGameStarted) return whenGameStarted(session as LocalGameSessionWithId);
            break;
          default:
            throw new Error('No Status found');
            break;
        }
      },
    ),
  );

//required to handle void return cases if necessary
export const getOrThrow = <T>(p: T | void) => {
  if (!p) throw new Error('Session Not started');
  return p;
};
