import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import { useOrders } from 'hooks/swr';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
const Orders = () => {
  const theme = useTheme();
  const { error, orders, isLoading } = useOrders();
  // value to be send to backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  if (!orders) return null;
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Người đặt',
      flex: 1,
    },
    ,
    {
      field: 'idTour',
      headerName: 'ID Tour',
      flex: 0.5,
    },
    {
      field: 'date',
      headerName: 'Ngày đặt',
      flex: 1,
    },
    {
      field: 'totalMoney',
      headerName: 'Tổng tiền',
      flex: 1,
      renderCell: (params) =>
        Number(params.value).toLocaleString('vi-VN', {
          style: 'currency',
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
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="HÓA ĐƠN" subtitle="Danh sách toàn bộ hóa đơn" />
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
          getRowId={(row) => row._id}
          rows={(orders && orders.order) || []}
          columns={columns}
          rowCount={(orders && orders.total) || []}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
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
