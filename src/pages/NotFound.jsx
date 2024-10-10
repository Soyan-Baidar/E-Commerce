import React from 'react';
import { Container, Typography } from '@mui/material';
import { styled, keyframes } from "@mui/system";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: ${fadeIn} 1s ease-in-out;
`;

const NotFound = () => {
  return (
    <StyledContainer>
      <Typography variant="h3">404</Typography>
      <Typography variant="h6">Page Not Found</Typography>
    </StyledContainer>
  );
};

export default NotFound;
