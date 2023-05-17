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
import Contact from 'scenes/contact';
import Customer from 'scenes/customers';
import Transactions from 'scenes/transactions';
import Breakdown from 'scenes/breakdown';
import Admin from 'scenes/admin';
import Order from 'scenes/orders';
import Login from 'scenes/login';
import { SWRConfig } from 'swr';
import Page404 from 'scenes/404';
import Monthly from 'scenes/monthly';
import Daily from 'scenes/daily';
import MonthlyCategory from 'scenes/monthlyCategory';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.user));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SWRConfig
            value={{
              shouldRetryOnError: false,
              revalidateOnFocus: false,
            }}
          >
            <Routes>
              <Route path="/*" element={<Page404 />} />
              <Route path="/login" element={<Login />} />
              <Route element={isAuth ? <Layout /> : <Navigate to="/login" />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tours" element={<Tour />} />
                <Route path="/tours/create" element={<Create />} />
                <Route path="/tours/:id" element={<Create />} />
                <Route path="/customers" element={<Customer />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/order" element={<Order />} />
                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/monthly" element={<Monthly />} />
                <Route path="/monthly-category" element={<MonthlyCategory />} />
              </Route>
            </Routes>
          </SWRConfig>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
