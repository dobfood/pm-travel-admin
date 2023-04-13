import React from "react";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IconButton, TextField, InputAdornment,Button ,useTheme} from "@mui/material";
import FlexBetween from "./FlexBetween";
const CustomToolbar = ({ searchInput, setSearchInput, setSearch,router }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
      <FlexBetween width="100%">
        <TextField
          label="Tìm kiếm..."
          sx={{ mb: " 0.5rem", width: "15rem" }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
         type="button"
         sx={{
             m:"2rem 0",
             p:"1rem",
             backgroundColor: theme.palette.background.alt,
         borderRadius: "0.55rem ",
             color:theme.palette.secondary.main,
             "&:hove":{color:theme.palette.secondary.main}
         }}
         onClick={()=> {navigate(`${router}`)}}
        >Thêm mới</Button>
      </FlexBetween>
  );
};

export default CustomToolbar;
