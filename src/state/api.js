// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const api = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${process.env.REACT_APP_BASE_URL}`,
//     prepareHeaders: (headers, { getState }) => {
//       console.log(getState());
//       const token = getState().global.token;
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       else {
//         headers.set('Authorization', 'Bearer default_token_value');
//       }
//       return headers
//     },
//   }),
//   reducerPath: "adminApi",
//   tagTypes: ["User", "Tours", "Customers", "Transactions", "Admins", "Sales"],
//   endpoints: (build) => ({
//     getUser: build.query({
//       query: (id) => `general/user/${id}`,
//       providesTags: ["User"],
//     }),
//     getTours: build.query({
//       query: () => `/client/tours`,
//       providesTags: ["Tours"],
//     }),
//     getCustomers: build.query({
//       query: () => `/client/customers`,
//       providesTags: ["Customers"],
//     }),
//     getTransactions: build.query({
//       query: ({ page, pageSize, sort, search }) => ({
//         url: "client/transactions",
//         method: "GET",
//         params: { page, pageSize, sort, search },
//       }),
//       providesTags: ["Transactions"],
//     }),
//     getAdmins: build.query({
//       query: () => `/management/admins`,
//       providesTags: ["Admins"],
//     }),
//     getSales: build.query({
//       query: () => `/manager/sales`,
//       providesTags: ["Sales"],
//     }),
//   }),
// });

// export const {
//   useGetUserQuery,
//   useGetToursQuery,
//   useGetCustomersQuery,
//   useGetTransactionsQuery,
//   useGetAdminsQuery,
//   useGetSalesQuery,
// } = api;
