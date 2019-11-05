import React from 'react';
import styled from 'styled-components';

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${props => props.greyColor};
`;

export default ({ uri }) => <Avatar source={{ uri }} />;
