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
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase-config';
import Dropzone from 'react-dropzone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Header from 'components/Header';
import { useCategorys, useProvinces, useTour } from 'hooks/swr';
import http from 'fetcher';

const tourSchema = yup.object().shape({
  idCategory: yup.string().required('Vui lòng nhập trường này'),
  title: yup.string().required('Vui lòng nhập trường này'),
  departure: yup.string().required('Vui lòng nhập trường này'),
  destination: yup.string().required('Vui lòng nhập trường này'),
  price: yup
    .number()
    .required('Vui lòng nhập trường này')
    .moreThan(0, 'Vui lòng không nhâp giá trị âm'),
  content: yup.string().required('Vui lòng nhập trường này'),
  // images: yup.array().required("Vui lòng nhập trường này"),
  totalRating: yup
    .number()
    .required('Vui lòng nhập trường này')
    .integer('Vui lòng nhập số nguyên')
    .moreThan(0, 'Vui lòng nhập giá trị lớn hơn 0')
    .lessThan(6, 'Vui lòng nhập giá trị bé hơn hoặt bằng 5'),
  // thumbnail: yup.string().required("Vui lòng nhập trường này"),
  schedule: yup
    .array()
    .of(
      yup.object().shape({
        day: yup.number().required('Vui lòng nhập trường này'),
        title: yup.string().required('Vui lòng nhập trường này'),
        content: yup.string().required('Vui lòng nhập trường này'),
      })
    )
    .min(1, 'Vui lòng nhập trường này'),
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
  idCategory: '',
  title: '',
  departure: '',
  destination: '',
  price: 0,
  content: '',
  images: [],
  totalRating: 1,
  thumbnail: '',
  codeTour: '',
  maxNumber: 0,
  schedule: [{ day: 1, title: '', content: '' }],
  date: 0,
};

const Create = () => {
  const { palette } = useTheme();
  const theme = useTheme();
  const isNoneMobile = useMediaQuery('(min-width:600px))');
  const navigate = useNavigate();
  const { id } = useParams();
  const { tour } = useTour(id);
  const { provinces = [] } = useProvinces();
  const { categorys = [] } = useCategorys();
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
      values.codeTour.toUpperCase();
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
                label="Loại du lịch"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.idCategory}
                name="idCategory"
                select
                error={
                  Boolean(touched.idCategory) && Boolean(errors.idCategory)
                }
                helperText={touched.idCategory && errors.idCategory}
                sx={{ gridColumn: 'span 1' }}
              >
                {categorys.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.title}
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
                sx={{ gridColumn: 'span 1' }}
              >
                {provinces.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
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
                sx={{ gridColumn: 'span 1' }}
              >
                {provinces.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
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
                sx={{ gridColumn: 'span 1' }}
              />

              <TextField
                label="Mã tour(không được trùng)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.codeTour}
                name="codeTour"
                error={Boolean(touched.codeTour) && Boolean(errors.codeTour)}
                helperText={touched.codeTour && errors.codeTour}
                sx={{ gridColumn: 'span 1' }}
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
                sx={{ gridColumn: 'span 1' }}
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
                sx={{ gridColumn: 'span 1' }}
              />
              <TextField
                label="Đánh giá tour"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.totalRating}
                name="totalRating"
                type="number"
                error={Boolean(touched.totalRating) && Boolean(errors.totalRating)}
                helperText={touched.totalRating && errors.totalRating}
                sx={{ gridColumn: 'span 1' }}
              />
              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.content}
                name="content"
                error={Boolean(touched.content) && Boolean(errors.content)}
                helperText={touched.content && errors.content}
                label="Mô tả ngắn"
                multiline
                minRows={2}
                sx={{ gridColumn: 'span 4' }}
              />
              {values.schedule.map((_, index) => (
                <Box
                  key={index}
                  style={{
                    display: 'grid',
                    gap: '16px',
                  }}
                  sx={{ gridColumn: 'span 4' }}
                >
                  <TextField
                    name={`schedule[${index}].day`}
                    label="Ngày"
                    type="number"
                    onBlur={handleBlur}
                    value={values.schedule[index].day}
                    onChange={handleChange}
                    disabled
                    error={
                      Boolean(touched.schedule?.[index]?.day) &&
                      Boolean(errors.schedule?.[index]?.day)
                    }
                    helperText={
                      touched.schedule?.[index]?.day &&
                      errors.schedule?.[index]?.day
                    }
                  />
                  <TextField
                    name={`schedule[${index}].title`}
                    label="Tiêu đề lịch trình"
                    value={values.schedule[index].title}
                    onChange={handleChange}
                    multiline
                    minRows={2}
                    error={
                      Boolean(touched.schedule?.[index]?.title) &&
                      Boolean(errors.schedule?.[index]?.title)
                    }
                    helperText={
                      touched.schedule?.[index]?.title &&
                      errors.schedule?.[index]?.title
                    }
                  />
                  <TextField
                    name={`schedule[${index}].content`}
                    label="Mô tả lịch trình"
                    value={values.schedule[index].content}
                    onChange={handleChange}
                    multiline
                    minRows={4}
                    error={
                      Boolean(touched.schedule?.[index]?.content) &&
                      Boolean(errors.schedule?.[index]?.content)
                    }
                    helperText={
                      touched.schedule?.[index]?.content &&
                      errors.schedule?.[index]?.content
                    }
                  />
                </Box>
              ))}
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  // Thêm một object mới vào mảng 'schedule'
                  const newSchedule = {
                    day: values.schedule.length + 1,
                    title: '',
                    content: '',
                  };
                  setFieldValue('schedule', [...values.schedule, newSchedule]);
                }}
                sx={{ gridColumn: 'span 4' }}
              >
                Thêm lịch
              </Button>

              <TextField
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={
                  Boolean(touched.description) && Boolean(errors.description)
                }
                helperText={touched.description && errors.description}
                label="Chi tiết"
                multiline
                minRows={4}
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
                        <p>Thêm hình nhiều hình ảnh tại đây </p>
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
