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
import Header from 'components/Header';
import { useContact } from 'hooks/swr';
import http from 'fetcher';
import moment from 'moment';
const Contact = (props) => {
  const { contact, mutate } = props;
  const { _id, fullName, phone, content, createdAt } = contact;
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const convertDate = moment(createdAt).format('DD/MM/YYYY HH:mm A');

  const deleteTour = async (id) => {
    try {
      await http.delete(`/contact/${id}`);
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
        <Button variant="h5" component="div">
          {fullName}
        </Button>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700].alt}
          gutterBottom
        >
          {phone}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700].alt}
          gutterBottom
        >
          {convertDate}
        </Typography>
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
                Swal.fire('Thành công!', 'Bạn đã xóa liên hệ này.', 'success');
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
          <Typography>Thông tin:{content}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
const Contacts = () => {
  const { contact: contacts, mutate, isLoading, error } = useContact();
  const theme = useTheme();
  const isNonMobile = useMediaQuery('(min-width: 1000px)');

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CONTACT" subtitle="Khác hàng liên hệ" />
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
              {contacts.map((contact) => (
                <Contact key={contact._id} contact={contact} mutate={mutate} />
              ))}
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
};

export default Contacts;
