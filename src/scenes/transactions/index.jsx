import React, { useState } from 'react';
import { Box, useTheme, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import { useTransactions } from 'hooks/swr';
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
const Transactions = () => {
  const theme = useTheme();
  const { error, transactions, isLoading } = useTransactions();

  // value to be send to backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  console.log(transactions);
  if (!transactions) return null;
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
        <DataGrid
          getRowId={(row) => row._id}
          rows={(transactions && transactions.transactions) || []}
          columns={columns}
          rowCount={(transactions && transactions.total) || []}
          rowPerPageOptions={[20, 50, 100]}
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

export default Transactions;
