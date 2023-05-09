import React from 'react';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BreakdownChart from 'components/BreakdownChart';
import { useDashboards } from 'hooks/swr';
import StatBox from 'components/StatBox';
function Dashboard() {
  const theme = useTheme();
  const isNonMediumScreems = useMediaQuery('(min-width : 1200px)');
  const { dashboard: data, mutate, isLoading, error } = useDashboards();
  if (!data) return null;
  console.log(data.transaction.posts);
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'userId',
      headerName: 'ID người dùng',
      flex: 1,
      valueGetter: (params) => params.row.idCustomer?.fullName,
    },
    {
      field: 'idTour',
      headerName: 'Mã tour',
      flex: 0.5,
      valueGetter: (params) => params.row.idTour?.codeTour,
    },
    {
      field: 'codeOrder',
      headerName: 'Mã thanh toán',
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Ngày xuất hóa đơn',
      flex: 2,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDateTime = date.toLocaleString('vi-VN', {
          dateStyle: 'full',
          timeStyle: 'short',
        });
        return formattedDateTime;
      },
    },
    {
      field: 'idOrder',
      headerName: 'Tổng tiền',
      flex: 1,
      valueGetter: (params) => params.row.totalMoney,
      renderCell: (params) =>
        Number(params.value).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }),
    },
  ];
  return (
    <Box m="1.5rem 2.5rem ">
      <FlexBetween>
        <Header
          title="DASHBOARD"
          subtitle="Chào mừng đến với dashboard của bạn"
        />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '10px 20px',
            }}
          >
            <DownloadOutlined sx={{ mr: '10px' }} />
            Tải báo cáo
          </Button>
        </Box>
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12,1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          '&>div': { gridColumn: isNonMediumScreems ? undefined : 'span 12' },
        }}
      >
        <StatBox
          title="Số lượng người dùng"
          value={data && data.user}
          increase="17%"
          description="Kể từ tháng trước"
          icon={
            <Email
              xs={{ color: theme.palette.secondary[300], fontSize: '22px' }}
            />
          }
        />
        <StatBox
          title="Tổng số lượng đơn đặt"
          value={data && data.totalOrder}
          increase="30%"
          description="Kể từ tháng trước"
          icon={
            <PointOfSale
              xs={{ color: theme.palette.secondary[300], fontSize: '22px' }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography
            p="5rem "
            fontSize="4rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            I'M THE BOSS
          </Typography>
        </Box>
        <StatBox
          title="Đơn khách thanh toán"
          value={data && data.total}
          increase="23%"
          description="Kể từ tháng trước"
          icon={
            <PersonAdd
              xs={{ color: theme.palette.secondary[300], fontSize: '22px' }}
            />
          }
        />
        <StatBox
          title="Tổng số doanh thu"
          value={
            data &&
            Number(data.totalMoney).toLocaleString('vi-VN', {
              currency: 'VND',
            })
          }
          increase="60%"
          description="Kể từ tháng trước"
          icon={
            <Traffic
              xs={{ color: theme.palette.secondary[300], fontSize: '22px' }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 3 "
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
              borderRadius: '5rem',
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
              backgroundColor: theme.palette.background.alt,
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
          <DataGrid
            loading={isLoading || !data.transaction.posts}
            getRowId={(row) => row._id}
            rows={data.transaction.posts || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          border="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Tour theo danh mục
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem "
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            phân tích trạng thái thực và thông tin qua danh mục doanh thu được
            thực hiện cho năm nay và tổng doanh thu
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
