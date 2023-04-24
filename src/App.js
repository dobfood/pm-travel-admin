import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from 'theme';
import Layout from 'scenes/layout';
import Dashboard from 'scenes/dashboard';
import Tour from 'scenes/tours';
import Create from 'scenes/tours/create';
import Update from 'scenes/tours/update';
import Customer from 'scenes/customers';
import Transactions from 'scenes/transactions';
import Breakdown from 'scenes/breakdown';
import Admin from 'scenes/admin';
import Order from 'scenes/orders'
import Login from 'scenes/login';
import { SWRConfig } from 'swr';
function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SWRConfig
            value={{
              shouldRetryOnError: false,
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={isAuth ? <Layout /> : <Navigate to="/login" />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tours" element={<Tour />} />
                <Route path="/tours/create" element={<Create />} />
                <Route path="/tours/:id" element={<Update />} />
                <Route path="/customers" element={<Customer />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/order" element={<Order />} />

                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Routes>
          </SWRConfig>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
