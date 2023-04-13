import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import CustomToolbar from "components/CustomToolbar";
import Header from "components/Header";
const Tour = ({
  _id,
  title,
  price,
  content,
  category,
  stat,
  numberDay,
  score,
  totalViews,
  rating,
  codeTour,
  thumbnail,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem ",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          {Number(price).toFixed(3)} Đồng
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body2"> {content}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Xem Thêm
        </Button>
      </CardActions>

      <Collapse
        in={isExpanded}
        timeOut="auto"
        unmountOnExit
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Danh thu hằng năm : {stat.yearlySalesTotal}</Typography>
          <Typography>
            Tổng số lượng đặt tour: {stat.yearlyTotalSoldUnits}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
const Tours = () => {
  const theme = useTheme()
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [tours, setTours] = useState([]);
  const token = useSelector(state=>state.token)
  const getTours = async () => {
    const response = await fetch(`http://localhost:5001/client/tours`, {
      method: "GET",
      headers:{
        'token': `${token}`
      }
    });
    const data = await response.json();
    setTours(data);
  };
  useEffect(() => {
    getTours();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!tours) return null;
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TOUR" subtitle="Danh sách tour du lịch" />
    <Box          height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}>
          <CustomToolbar router="/tours/create"/>
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columgap="1.33%"
          sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
        >
          {tours.map(
            ({
              _id,
              title,
              content,
              price,
              rating,
              category,
              stat,
              numberDay,
              thumbnail,
              codeTour,
              totalViews,
              score,
            }) => (
              <Tour
                key={_id}
                _id={_id}
                title={title}
                content={content}
                price={price}
                rating={rating}
                category={category}
                stat={stat}
                numberDay={numberDay}
                thumbnail={thumbnail}
                codeTour={codeTour}
                totalViews={totalViews}
                score={score}
              />
            )
          )}
        </Box>
        </Box>
    </Box>
  );
};

export default Tours;
