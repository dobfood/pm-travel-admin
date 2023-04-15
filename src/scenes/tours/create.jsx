import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  MenuItem,
} from '@mui/material';
import './create.css';
import Swal from 'sweetalert2';
import { CKEditor } from 'ckeditor4-react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase-config';
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useSelector } from 'react-redux';
import Header from 'components/Header';
import { useProvinces } from 'hooks/swr';
import http from 'fetcher';
const tourSchema = yup.object().shape({
  category: yup.string().required('Vui lòng nhập trường này'),
  title: yup.string().required('Vui lòng nhập trường này'),
  departure: yup.string().required('Vui lòng nhập trường này'),
  destination: yup.string().required('Vui lòng nhập trường này'),
  numberDay: yup
    .number()
    .required('Vui lòng nhập trường này')
    .moreThan(0, 'Vui lòng không nhâp giá trị âm'),
  price: yup
    .number()
    .required('Vui lòng nhập trường này')
    .moreThan(0, 'Vui lòng không nhâp giá trị âm'),
  content: yup.string().required('Vui lòng nhập trường này'),
  // images: yup.array().required("Vui lòng nhập trường này"),
  rating: yup
    .number()
    .required('Vui lòng nhập trường này')
    .integer('Vui lòng nhập số nguyên')
    .moreThan(0, 'Vui lòng nhập giá trị lớn hơn 0')
    .lessThan(6, 'Vui lòng nhập giá trị bé hơn hoặt bằng 5'),
  // thumbnail: yup.string().required("Vui lòng nhập trường này"),
  description: yup.string(),
  codeTour: yup
    .string()
    .required('Vui lòng nhập trường này')
    .max(5, 'Vui lòng không nhập quá 5 ký tự'),
  maxNumber: yup
    .number()
    .required('Vui lòng nhập trường này')
    .moreThan(0, 'Vui lòng không nhâp giá trị âm'),
});
const initialValuesTour = {
  category: '',
  title: '',
  departure: '',
  destination: '',
  numberDay: 0,
  price: 0,
  content: '',
  images: [],
  rating: 1,
  thumbnail: '',
  codeTour: '',
  maxNumber: 0,
  description: '',
};
const Create = () => {
  const { palette } = useTheme();
  const theme = useTheme();
  const typeCategory = [
    { value: 'tourCultural', text: 'Du lịch văn hóa' },
    { value: 'tourEco', text: 'Du lịch sinh thái' },
    { value: 'tourResort', text: 'Du lịch nghỉ dưỡng' },
    { value: 'tourDiscovery', text: 'Du lịch khám phá' },
  ];
  const isNoneMobile = useMediaQuery('(min-width:600px))');
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [images, setImages] = useState();
  const [imageUpload, setImageUpload] = useState();

  const { provinces = [] } = useProvinces();

  const uploadImage = async () => {
    for (let i = 0; i < imageUpload.length; i++) {
      const imageRef = ref(storage, `/images/${imageUpload[i].name}`);

      const result = await uploadBytes(imageRef, imageUpload[i])
        .then(() => {
          console.log('success');
        })
        .catch((error) => {
          console.log('error');
        });
    }
  };
  const uploadThumbnail = async () => {
    if (!imageUpload) return;
    const imageRef = ref(storage, `pm-travel/thumbnail/${imageUpload.name}`);
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(url);
      });
    });
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append('thumbnail', values.thumbnail.name);
      await http.post('/client/tours', formData);

      onSubmitProps.resetForm();
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã thêm mới thành công.',
      });
      navigate('/tours');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error',
      });
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween width="100%">
        <Header title="TOUR" subtitle="Thêm mới tour du lịch" />
        <span sx={{ mb: ' 0.5rem', width: '15rem' }}></span>
        <Button
          type="button"
          sx={{
            m: '2rem 0',
            p: '1rem',
            backgroundColor: theme.palette.background.alt,
            borderRadius: '0.55rem ',
            color: theme.palette.secondary.main,
            '&:hove': { color: theme.palette.secondary.main },
          }}
          onClick={() => {
            navigate(`/tours`);
          }}
        >
          Trở về
        </Button>
      </FlexBetween>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesTour}
        validationSchema={tourSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4,minmax(1fr))"
              sx={{
                '& div': { gridColumns: isNoneMobile ? undefined : 'span 4' },
              }}
            >
              <TextField
                label="Loại du lịch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category}
                name="category"
                select
                error={Boolean(touched.category) && Boolean(errors.category)}
                helperText={touched.category && errors.category}
                sx={{ gridColumn: 'span 4' }}
              >
                {typeCategory.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.text}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Điểm khởi đầu"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.departure}
                name="departure"
                select
                error={Boolean(touched.departure) && Boolean(errors.departure)}
                helperText={touched.departure && errors.departure}
                sx={{ gridColumn: 'span 4' }}
              >
                {provinces.map((option) => (
                  <MenuItem key={option._id} value={option.title}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Điểm đến"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.destination}
                name="destination"
                select
                error={
                  Boolean(touched.destination) && Boolean(errors.destination)
                }
                helperText={touched.destination && errors.destination}
                sx={{ gridColumn: 'span 4' }}
              >
                {provinces.map((option) => (
                  <MenuItem key={option._id} value={option.title}>
                    {option.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Tên tour du lịch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={Boolean(touched.title) && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Mã tour"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.codeTour}
                name="codeTour"
                error={Boolean(touched.codeTour) && Boolean(errors.codeTour)}
                helperText={touched.codeTour && errors.codeTour}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Số lượng người"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.maxNumber}
                name="maxNumber"
                type="number"
                error={Boolean(touched.maxNumber) && Boolean(errors.maxNumber)}
                helperText={touched.maxNumber && errors.maxNumber}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Giá tour"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                type="number"
                error={Boolean(touched.price) && Boolean(errors.price)}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Đánh giá tour"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rating}
                name="rating"
                type="number"
                error={Boolean(touched.rating) && Boolean(errors.rating)}
                helperText={touched.rating && errors.rating}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Số ngày đi"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.numberDay}
                name="numberDay"
                type="number"
                error={Boolean(touched.numberDay) && Boolean(errors.numberDay)}
                helperText={touched.numberDay && errors.numberDay}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.content}
                name="content"
                error={Boolean(touched.content) && Boolean(errors.content)}
                helperText={touched.content && errors.content}
                label="Content"
                multiline
                minRows={4}
                sx={{ gridColumn: 'span 4' }}
              />
              <CKEditor
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                initData="<h1>Hãy nhập mô tả tour</h1>"
                sx={{ gridColumn: 'span 4' }}
              />
              <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    setImageUpload(acceptedFiles);
                    uploadThumbnail();
                    console.log(values);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      p="1rem"
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                    >
                      <input {...getInputProps()} />
                      {!values.thumbnail ? (
                        <p>Thêm hình ảnh tại đây</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.thumbnail}</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
              <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={true}
                  onDrop={(acceptedFiles) => {
                    console.log(acceptedFiles);
                    setImageUpload(acceptedFiles[0]);
                    uploadImage();
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      p="1rem"
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                    >
                      <input {...getInputProps()} />
                      {!values.images ? (
                        <p>Thêm hình ảnh nhỏ </p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.images}</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
            </Box>
            {/* BUTTON */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: '2rem 0',
                  p: '1rem',
                  backgroundColor: theme.palette.background.alt,
                  borderRadius: '0.55rem ',
                  color: theme.palette.secondary.main,
                  '&:hove': { color: theme.palette.secondary.main },
                }}
              >
                Thêm mới
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Create;
