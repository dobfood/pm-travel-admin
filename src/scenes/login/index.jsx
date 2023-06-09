import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNoneMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="secondary">
          PM-TRAVEL
        </Typography>
        <Box
        width={isNoneMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        >
            <Typography
            fontWeight="500" variant="h5" sx={{mb:"1.5rem"}}
            >
                Chào mừng bạn đến với PM-TRAVEL, lựa chọn hằng đầu cho những chuyến du lịch của mình!
            </Typography>
            <Form/>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
