import React, { useState,useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import { useGetTransactionsQuery } from "state/api";

import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { useSelector } from "react-redux";
const Transactions = () => {
  const theme = useTheme();

  // value to be send to backend
  const [transactions,setTransactions]=useState([])
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // const { data, isLoading } = useGetTransactionsQuery({
  //   page,
  //   pageSize,
  //   sort: JSON.stringify(sort),
  //   search,
  // });
  const token = useSelector(state=>state.token)
  const getTransactions = async () => {
    const response = await fetch(`http://192.168.1.3:5001/client/transactions`, {
      method: "GET",
      params: { page, pageSize, sort, search },
      headers:{
        'token': `${token}`
      }
    });
    const data = await response.json();
    setTransactions(data)
  };
  useEffect(() => {
    getTransactions({ page,
        pageSize,
        sort: JSON.stringify(sort),
        search,
       });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!transactions) return null;
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "ID người dùng",
      flex: 1,
    },
    ,
    {
      field: "idTourOrder",
      headerName: "Tên người dùng",
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
    },
    {
      field: "tour",
      headerName: "Tour",
      flex: 1,
    },
    {
      field: "totalMoney",
      headerName: "Tổng tiền",
      flex: 1,
      renderCell: (params) => `${Number(params.value.toFixed(3))}VNĐ`,
    },
    {
      field: "method",
      headerName: "Loại thanh toán ",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái thanh toán",
      flex: 1,
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="HÓA ĐƠN" subtitle="Danh sách toàn bộ hóa đơn" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row._id}
          rows={(transactions) || []}
          columns={columns}
          rowCount={(transactions) || []}
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
