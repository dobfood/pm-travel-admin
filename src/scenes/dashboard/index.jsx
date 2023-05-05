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
import { useDashboard } from 'hooks/swr';
function Dashboard() {
  const theme = useTheme();
  const isNonMediumScreems = useMediaQuery('(min-width-1200px)');
  const { dashboard, error, loading } = useDashboard();
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
    </Box>
  );
}

export default Dashboard;
