import * as O from 'fp-ts/lib/Option';
import { extractDocumentData, normalizeQuery } from '@mikelfcosta/solo-lib/lib/utils/firebase';

import { getSessionRef } from '../firebase';

export async function requestFullSession(sessionId: string): Promise<LocalSessionWithId> {
  const session = await getSessionRef(sessionId).get();
  const sessionData = extractDocumentData<LocalSessionWithId>(session);

  if (O.isNone(sessionData)) {
    throw new Error('Session not found');
  }

  const players = await getSessionRef(sessionId).collection('players').get();

  if (sessionData.value.status === 'STARTED' || sessionData.value.status === 'FINISHED') {
    const progression = await getSessionRef(sessionId).collection('progression').get();
    return {
      ...sessionData.value,
      players: normalizeQuery(players),
      progression: normalizeQuery(progression),
    };
  }

  return {
    ...sessionData.value,
    players: normalizeQuery(players),
  };
}
