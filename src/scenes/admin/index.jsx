import { Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import CustomColumnMenu from 'components/DataGridCustomColumnMenu';
import { useAdmins } from 'hooks/swr';

const Admin = () => {
  const theme = useTheme();

  const { admins } = useAdmins();

  if (!admins) return null;

  // eslint-disable-next-line no-sparse-arrays
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
    ,
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
    {
      field: 'loginType',
      headerName: 'Loại đăng ký',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Vai trò',
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ADMIN" subtitle="Danh sách khách hàng" />
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
          rows={admins || []}
          columns={columns}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default Admin;
