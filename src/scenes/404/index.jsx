import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { Button, useTheme } from '@mui/material';
const Page404 = () => {
  const theme = useTheme()
  return (
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="error-template">
            <h1>404</h1>
            <h2>Oops! Page not found</h2>
            <p>Sorry, the page you are looking for could not be found.</p>
            <div class="error-actions">
              <Button 
               sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: theme.palette.background.default,
                borderRadius: '0.55rem ',
                color: theme.palette.secondary.default,
                '&:hover': {
                  color: theme.palette.background.main,
                  background: theme.palette.secondary.main,
                },
              }}>
                <Link to="/">Back to homepage</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
