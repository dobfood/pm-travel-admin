import { Box, Button, TextField, useMediaQuery, useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';
import http from 'fetcher';
import Swal from 'sweetalert2';
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('invalid email')
    .required('Vui lòng nhập trường này'),
  password: yup.string().required('Vui lòng nhập trường này'),
});

const initialValuesLogin = {
  email: '',
  password: '',
};

const Form = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNoneMobile = useMediaQuery('(min-width:600px)');
  const login = async (values, onSubmitProps) => {
    try {
      const { data } = await http.post('/auth/signin', values);
      if (data.role === 'admin') {
        onSubmitProps.resetForm();
        localStorage.setItem('access-token', data.accessToken);
        dispatch(
          setLogin({
            user: data,
          })
        );
        navigate('/dashboard');
        Swal.fire({
          icon: 'success',
          title: 'Chào BOSS!',
          text: 'Đăng nhập thành công!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: 'Đăng nhập thất bại!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Opps...',
        text: 'Đăng nhập thất bại!',
      });
    }
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    await login(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4,minmax(0,1fr))"
            sx={{
              '& div': { gridColumns: isNoneMobile ? undefined : 'span 4' },
            }}
          >
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: 'span 4' }}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: 'span 4' }}
            />
          </Box>

          {/* BUTTON */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: theme.palette.background.default,
                borderRadius: '0.55rem ',
                color: theme.palette.secondary.main,
                '&:hover': {
                  color: theme.palette.background.default,
                  background: theme.palette.secondary.main,
                },
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
