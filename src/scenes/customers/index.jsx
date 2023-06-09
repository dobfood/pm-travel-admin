import { Box, useTheme, Button, Chip } from '@mui/material';
import Header from 'components/Header';
import { DataGrid } from '@mui/x-data-grid';
import { useUsers } from 'hooks/swr';
import {
  CheckCircleOutlineOutlined,
  HighlightOffOutlined,
} from '@mui/icons-material';

import Swal from 'sweetalert2';
import http from 'fetcher';
const Customers = () => {
  const theme = useTheme();
  const { users: customers, mutate, isLoading, error } = useUsers('user');
  const handleChangeActiveStatus = async (id) => {
    await http.patch(`/user/status/${id}`, { status: 'active' });
    mutate();
  };
  const handleChangeInactiveStatus = async (id) => {
    await http.patch(`/user/status/${id}`, { status: 'inactive' });
    mutate();
  };
  if (!customers) return null;
  const columns = [
    {
      field: '_id',
      headerName: 'ID',
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
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      renderCell: (params) => {
        return (
          <Chip
            label={params.value === 'active' ? 'Hoạt động' : 'Đang chặn'}
            icon={
              params.value === 'active' ? (
                <CheckCircleOutlineOutlined />
              ) : (
                <HighlightOffOutlined />
              )
            }
            variant="outlined"
            color={params.value === 'active' ? 'success' : 'error'}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ textAlign: 'center', margin: 'auto' }}>
            <Button
              variant="contained"
              color="success"
              disabled={params.row.status !== 'inactive'}
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
                    handleChangeActiveStatus(params.row._id);
                    Swal.fire(
                      'Thay đổi thành công!',
                      'Bạn đã kích hoạt người dùng này.',
                      'success'
                    );
                  }
                })
              }
            >
              Bật
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: '4px' }}
              disabled={params.row.status !== 'active'}
              onClick={() =>
                Swal.fire({
                  title: 'Bạn muốn chặn người dùng này?',
                  text: 'Quá trình này không thể hoàn tác!',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Xác nhận!',
                  cancelButtonText: 'Hủy!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleChangeInactiveStatus(params.row._id);
                    Swal.fire(
                      'Thay đổi thành công!',
                      'Bạn đã chặn người dùng này.',
                      'success'
                    );
                  }
                })
              }
            >
              Tắt
            </Button>
          </Box>
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
