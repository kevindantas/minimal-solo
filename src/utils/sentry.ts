import * as Sentry from '@sentry/browser';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';

import { sentryConfig } from '../api/config';
import { LocalSessionWithId } from '../model/Session';

Sentry.init({
  dsn: sentryConfig.dsn,
  release: process.env.REACT_APP_VERSION,
});

export function setSentryUserContext(userId: string) {
  Sentry.configureScope(scope => scope.setUser({ id: userId }));
}

export function setSentrySessionTags(session: LocalSessionWithId) {
  Sentry.configureScope(scope => {
    scope.setTags({
      sessionId: session.id,
      sessionStatus: session.status,
      sessionCode: session.code,
    });
  });
}

export function captureLog(
  error: Error,
  extras: Record<string, string> = {},
  tags: Record<string, string> = {},
) {
  Sentry.withScope(scope => {
    pipe(
      extras,
      R.mapWithIndex((key, extra) => {
        scope.setExtra(key, extra);
      }),
    );

    pipe(
      tags,
      R.mapWithIndex((key, tag) => {
        scope.setTag(key, tag);
      }),
    );

    Sentry.captureException(error);
  });
}
