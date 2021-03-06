import styled from 'styled-components';

export const Page = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  padding: ${props => props.theme.spacing.high}px;
  width: 100vw;
  align-items: center;
`;

export const LobbyWrapper = styled.div``;

export const Title = styled.h1`
  font-weight: 500;
  color: ${props => props.theme.colors.white};
  font-size: 24px;
  line-height: 28px;
`;

export const Code = styled.h2`
  font-weight: bold;
  color: ${props => props.theme.colors.border};
  font-size: 64px;
  line-height: 74px;
  margin-bottom: ${props => props.theme.spacing.large}px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: ${props => props.theme.spacing.large}px;
  align-items: center;
  button {
    max-width: 300px;
  }
`;
