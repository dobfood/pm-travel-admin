import { Box, useTheme } from '@mui/material';
import Header from 'components/Header';
import { DataGrid } from '@mui/x-data-grid';
import { useUsers } from 'hooks/swr';

const Customers = () => {
  const theme = useTheme();
  const { users: customers, mutate, isLoading, error } = useUsers('user');
  if (!customers) return null;
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'avatar',
      headerName: 'Avatar',
      flex: 1,
    },
    {
      field: 'fullName',
      headerName: 'Tên người dùng',
      flex: 0.5,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      flex: 0.5,
      renderCell: (params) => {
        return params.value.replace(
          /^(\d{2})(\d{3})(\d{3})(\d{3})/,
          '($1)$2-$3-$4'
        );
      },
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="KHÁCH HÀNG" subtitle="Danh sách khách hàng" />
      <Box
        mt="40px"
        height="75vh"
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
          rows={customers || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Customers;
