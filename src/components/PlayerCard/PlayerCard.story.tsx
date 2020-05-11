import { number, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import styled from 'styled-components';
import * as A from 'fp-ts/lib/Array';
import { random } from 'faker';

import { PlayerCard } from './index';
import { createAvatar, SessionPlayer } from '../../model/Player';

const avatar = createAvatar();

const Wrapper = styled.div`
  width: 360px;
`;

export function PlayerCardStory() {
  const nameKnob = text('Player Name', 'Michel Costa');
  const cardCount = number('Card count', 7);

  const player: SessionPlayer = {
    name: nameKnob,
    status: 'READY',
    avatar,
    hand: A.range(1, cardCount).map(() => random.uuid()),
  };

  return (
    <Wrapper>
      <PlayerCard player={player} />
    </Wrapper>
  );
}

export default {
  title: 'MinimalSolo/Components/Game',
  component: PlayerCardStory,
  decorators: [withKnobs],
};
