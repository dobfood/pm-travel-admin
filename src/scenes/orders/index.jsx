import React, { useState } from 'react';
import { Box, useTheme, Button, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import { useOrders } from 'hooks/swr';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import http from 'fetcher';
import Swal from 'sweetalert2';
const Orders = () => {
  const theme = useTheme();
  const { error, orders, isLoading, mutate } = useOrders();
  console.log(orders);
  // value to be send to backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const handleChangePaidStatus = async (id) => {
    await http.patch(`/order/status/${id}`, { status: 'paid' });
    mutate();
  };
  const handleChangeCancelStatus = async (id) => {
    await http.patch(`/order/status/${id}`, { status: 'cancel' });
    mutate();
  };
  function getStatusLabel(status) {
    switch (status) {
      case 'check-in':
        return 'Chờ xử lý';
      case 'paid':
        return 'Đã thanh toán';
      case 'cancel':
        return 'Đã hủy';
      default:
        return status;
    }
  }
  if (!orders) return null;
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'fullName',
      headerName: 'Người đặt',
      flex: 1,
    },
    {
      field: `idTour`,
      headerName: 'Mã tour',
      flex: 1,
      valueGetter: (params) => params.row.idTour?.codeTour,
    },

    {
      field: 'createdAt',
      headerName: 'Ngày đặt',
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString('vi-VN');
        return formattedDate;
      },
    },
    {
      field: 'totalMoney',
      headerName: 'Tổng tiền(VNĐ)',
      flex: 1,
      renderCell: (params) =>
        Number(params.value).toLocaleString('vi-VN', {
          currency: 'VND',
        }),
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'check-in') {
          color = 'info';
        } else if (params.value === 'paid') {
          color = 'success';
        } else if (params.value === 'cancel') {
          color = 'error';
        }
        return (
          <Chip
            label={getStatusLabel(params.value)}
            variant="outlined"
            color={color}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'center',
      flex: 1.5,
      renderCell: (params) => {
        return (
          <Box>
            <Button
              variant="contained"
              color="success"
              disabled={params.row.status !== 'check-in'}
              onClick={() =>
                Swal.fire({
                  title: 'Bạn chắc chứ?',
                  text: 'Quá trình này không thể hoàn tác!',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Xác nhận!',
                  cancelButtonText: 'Hủy!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleChangePaidStatus(params.row._id);
                    Swal.fire(
                      'Thay đổi thành công!',
                      'Bạn đã tay đổi thành đã thành toán.',
                      'success'
                    );
                  }
                })
              }
            >
              Xác nhận
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: '4px' }}
              disabled={params.row.status !== 'check-in'}
              onClick={() =>
                Swal.fire({
                  title: 'Bạn muốn hủy đơn đặt này?',
                  text: 'Quá trình này không thể hoàn tác!',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Xác nhận!',
                  cancelButtonText: 'Hủy!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleChangeCancelStatus(params.row._id);
                    Swal.fire(
                      'Thay đổi thành công!',
                      'Bạn đã hủy đơn đặt này.',
                      'success'
                    );
                  }
                })
              }
            >
              Hủy
            </Button>
          </Box>
        );
      },
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Đặt tour" subtitle="Danh sách toàn bộ danh sách đã đặt" />
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
            backgroundColor: theme.palette.primary.light,
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
          loading={isLoading || !orders}
          getRowId={(row) => row._id}
          rows={(orders && orders.orders) || []}
          columns={columns}
          rowCount={(orders && orders.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default Orders;
