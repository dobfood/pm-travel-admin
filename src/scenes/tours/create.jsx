import React, { useState } from 'react';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { CKEditor } from 'ckeditor4-react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase-config';
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Header from 'components/Header';
import { useProvinces, useTour } from 'hooks/swr';
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
  ratting: yup
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
  // date: yup.number().required('Vui lòng nhập trường này'),
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
  ratting: 1,
  thumbnail: '',
  codeTour: '',
  maxNumber: 0,
  description: '',
  date: 0,
};

const typeCategory = [
  { value: 'tourCultural', text: 'Du lịch văn hóa' },
  { value: 'tourEco', text: 'Du lịch sinh thái' },
  { value: 'tourResort', text: 'Du lịch nghỉ dưỡng' },
  { value: 'tourDiscovery', text: 'Du lịch khám phá' },
];

const Create = () => {
  const { palette } = useTheme();
  const theme = useTheme();
  const isNoneMobile = useMediaQuery('(min-width:600px))');
  const navigate = useNavigate();

  const { id } = useParams();
  const { tour } = useTour(id);
  const { provinces = [] } = useProvinces();

  const [imageFiles, setImageFiles] = useState();
  const [thumbnailFile, setThumbnailFile] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const uploadImage = async () => {
    try {
      if (!imageFiles && !tour) return false;
      if (!imageFiles && tour) return true;
      const imagesUrlList = Promise.all(
        imageFiles.map(async (img) => {
          const imageRef = ref(storage, `pm-travel/images/${img.name}`);

          const snapshot = await uploadBytes(imageRef, img);
          const url = await getDownloadURL(snapshot.ref);
          return { url, name: img.name };
        })
      );
      return imagesUrlList;
    } catch (error) {
      return false;
    }
  };

  const uploadThumbnail = async () => {
    try {
      if (!thumbnailFile && !tour) return false;
      if (!thumbnailFile && tour) return true;
      const imageRef = ref(
        storage,
        `pm-travel/thumbnail/${thumbnailFile.name}`
      );
      const snapshot = await uploadBytes(imageRef, thumbnailFile);
      const url = await getDownloadURL(snapshot.ref);
      return {
        url,
        name: thumbnailFile.name,
      };
    } catch (error) {
      return false;
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      const thumbnail = await uploadThumbnail();
      if (!thumbnail) return;
      const images = await uploadImage();
      if (!images) return;
      values.date = startDate.getTime();
      if (typeof thumbnail !== 'boolean') values.thumbnail = thumbnail;
      if (typeof images !== 'boolean') values.images = images;
      console.log(values);
      if (!tour) await http.post('/tour', values);
      else await http.patch(`/tour/${id}`, values);

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
        <Header
          title="TOUR"
          subtitle={!tour ? 'Thêm mới tour du lịch' : 'Chỉnh sửa tour du lịch'}
        />
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
        initialValues={tour ? tour : initialValuesTour}
        validationSchema={tourSchema}
        enableReinitialize
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
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                timeInputLabel="Time:"
                name="date"
                dateFormat="MM/dd/yyyy h:mm aa"
                showTimeInput
                error={Boolean(touched.date) && Boolean(errors.date)}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: 'span 4' }}
              />
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
                value={values.ratting}
                name="ratting"
                type="number"
                error={Boolean(touched.ratting) && Boolean(errors.ratting)}
                helperText={touched.ratting && errors.ratting}
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
                    setThumbnailFile(acceptedFiles[0]);
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
                      {!thumbnailFile && !tour ? (
                        <p>Thêm hình ảnh tại đây</p>
                      ) : (
                        <FlexBetween>
                          <Typography>
                            {thumbnailFile
                              ? thumbnailFile.name
                              : tour.thumbnail.name}
                          </Typography>
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
                    setImageFiles(acceptedFiles);
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
                      {!imageFiles && !tour ? (
                        <p>Thêm hình ảnh nhỏ </p>
                      ) : (
                        <FlexBetween>
                          <Typography>
                            {imageFiles
                              ? imageFiles.map((img) => img.name).join(', ')
                              : tour.images.map((img) => img.name).join(', ')}
                          </Typography>
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
                {!tour ? 'Thêm mới' : 'Lưu'}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Create;
