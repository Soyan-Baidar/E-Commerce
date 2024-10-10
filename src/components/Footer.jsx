import { Typography, Link, Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const StyledFooter = styled(Box)`
  height: 100px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <Typography variant="body2" color="textSecondary">
        {"Copyright © "}
        <Link color="inherit" href="">
          CodeCommerce
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </StyledFooter>
  );
}
