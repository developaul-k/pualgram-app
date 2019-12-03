import React from 'react';
import styled from 'styled-components';

const Avatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${props => props.theme.greyColor};
  overflow: hidden;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  ${props =>
    props.small &&
    `
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
`};
`;

const AvatarImage = styled.Image`
  width: 40px;
  height: 40px;
`;

export default ({ uri, small = false }) =>
  <Avatar small={small}>
    <AvatarImage source={{ uri }} />
  </Avatar>;
