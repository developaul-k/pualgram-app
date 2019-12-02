import React from 'react';
import styled from 'styled-components';

const Avatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${props => props.theme.greyColor};
  overflow: hidden;
`;

const AvatarImage = styled.Image`
  width: 40px;
  height: 40px;
`;

export default ({ uri }) => (
  <Avatar>
    <AvatarImage source={{ uri }} />
  </Avatar>
);
