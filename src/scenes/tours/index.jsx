import React, { useState } from 'react';
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
} from '@mui/material';
import Swal from 'sweetalert2';
import CustomToolbar from 'components/CustomToolbar';
import Header from 'components/Header';
import { useNavigate } from 'react-router-dom';
import { useTours } from 'hooks/swr';
import http from 'fetcher';
import moment from 'moment';
const Tour = (props) => {
  const { tour, mutate } = props;
  const {
    _id,
    title,
    price,
    content,
    category,
    numberDay,
    totalViews,
    ratting,
    codeTour,
    date,
    maxNumber,
    departure,
    destination,
  } = tour;
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const convertDate = moment(date).format('DD/MM/YYYY HH:mm A');
  const deleteTour = async (id) => {
    try {
      await http.delete(`/tour/${id}`);
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      sx={{
        backgroundImage: 'none',
        backgroundColor: theme.palette.background.alt,
        borderRadius: '0.55rem ',
        marginRight: '1rem',
      }}
    >
      <CardContent>
        <Button
          variant="h5"
          component="div"
          onClick={() => navigate(`/tours/${_id}`)}
        >
          {title}
        </Button>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography sx={{ mb: '1.5rem' }} color={theme.palette.secondary[400]}>
          { Number(price).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})} VND
        </Typography>
        <Rating value={ratting} readOnly />
        <Typography variant="body2"> {content}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="secondary"
          size="small"
          onClick={() =>
            Swal.fire({
              title: 'Bạn chắc chứ?',
              text: 'Bạn không thể hoàn tác quá trình này!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Vâng đồng ý!',
              cancelButtonText: 'Hủy bỏ',
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire('Thành công!', 'Bạn đã xóa tour này.', 'success');
                deleteTour(_id);
              }
            })
          }
        >
          Xóa
        </Button>
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
        timeout="auto"
        unmountOnExit
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography>Mã tour:{codeTour}</Typography>
          <Typography>Số lượng ghế :{maxNumber} </Typography>
          <Typography>
            Xuất phát : {departure} -> {destination}{' '}
          </Typography>
          <Typography>
            Ngày đi :{convertDate} Tour {numberDay} ngày
          </Typography>
          <Typography>Lượt xem : {totalViews}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
const Tours = () => {
  const { tours, mutate, isLoading, error } = useTours();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const isNonMobile = useMediaQuery('(min-width: 1000px)');
  const filteredTours = search
    ? tours.filter((tour) =>
        tour.title.toLowerCase().includes(search.toLowerCase())
      )
    : tours;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TOUR" subtitle="Danh sách tour du lịch" />
      <Box
        height="80vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: theme.palette.light,
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: 'none',
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <CustomToolbar
          value={search}
          onChange={(value) => setSearch(value)}
          router="/tours/create"
        />
        {(() => {
          if (error) return '';

          if (isLoading) return 'Loading';

          return (
            <Box
              mt="20px"
              display="grid"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              justifyContent="space-between"
              rowGap="20px"
              columgap="1.33%"
              sx={{
                '& > div': {
                  gridColumn: isNonMobile ? undefined : 'span 2',
                },
              }}
            >
              {filteredTours.map((tour) => (
                <Tour key={tour._id} tour={tour} mutate={mutate} />
              ))}
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
};

export default Tours;
