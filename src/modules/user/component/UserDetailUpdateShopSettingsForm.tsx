import { Box, Grid, Typography, Link, TextField, Button, CardMedia } from '@mui/material';
import { useEffect, useState } from 'react';
import { IShopSettings } from '../../../models/account';
import { Editor } from '@tinymce/tinymce-react';
import { FileUploader } from 'react-drag-drop-files';
import defaultImage from '../../../utils/defaultImage.png';
import { fileToBase64String } from '../../../utils';
import { LABEL_COLUMN } from '../../../utils/constants';
import { useFormik } from 'formik';
import { validationUpdateShopSettingsUserSchema } from '../utils';
const fileTypes = ['JPG', 'PNG', 'GIF', 'JPEG'];
interface Props {
  shopSettings: IShopSettings;
  onUpdateShopSettings: (shopSetttings: IShopSettings, logo?: File) => void;
}
const UserDetailUpdateShopSettingsForm = (props: Props) => {
  const { shopSettings, onUpdateShopSettings } = props;
  const [file, setFile] = useState<File>();
  const [imageStringSrc, setImageStringSrc] = useState<string>();

  const formik = useFormik({
    initialValues: {
      code: '',
      companyName: '',
      description: '',
      id: '',
      label_id: '',
      location: '',
      path: '',
      profile_id: '',
      vendor_id: '',
    },
    validationSchema: validationUpdateShopSettingsUserSchema,
    onSubmit: (values) => {
      const formValues: IShopSettings = {
        ...values,
      };
      onUpdateShopSettings(formValues, file);
    },
  });

  const handleChangeFile = (file: File) => {
    setFile(file);
  };
  useEffect(() => {
    const convert = async () => {
      if (!file) {
        return;
      }
      const result = await fileToBase64String(file);
      setImageStringSrc(result);
    };
    convert();
  }, [file]);
  useEffect(() => {
    formik.setValues({
      ...shopSettings,
      companyName: shopSettings.companyName || '',
      location: shopSettings.location || '',
      code: shopSettings.code || '',
      id: shopSettings.id || '',
      label_id: shopSettings.label_id || '',
      description: shopSettings.description || '',
    });
    // eslint-disable-next-line
  }, []);
  return (
    <Box component="form" width={1} onSubmit={formik.handleSubmit}>
      <Grid container width={1} position="relative">
        <Grid item xs={12} pb={2}>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">Company Name</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                type="text"
                name="companyName"
                label={formik.errors.companyName || 'Company name'}
                error={Boolean(formik.errors.companyName)}
                value={formik.values.companyName}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">Shop Link</Typography>
            </Grid>
            <Grid item xs>
              <Typography>
                {formik.values.path ? <Link href={formik.values.path}>{formik.values.path}</Link> : 'null'}
              </Typography>
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">Shop Logo Image</Typography>
            </Grid>
            <Grid item xs>
              <FileUploader handleChange={handleChangeFile} name="file" types={fileTypes}>
                {imageStringSrc || formik.values.path ? (
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, marginBottom: '1rem', cursor: 'pointer' }}
                    src={imageStringSrc ? imageStringSrc : formik.values.path}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, marginBottom: '1rem', cursor: 'pointer' }}
                    src={defaultImage}
                  />
                )}
              </FileUploader>
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">Location</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                autoComplete="off"
                size="small"
                type="text"
                name="location"
                label={formik.errors.location || 'Location'}
                error={Boolean(formik.errors.location)}
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">Full Description</Typography>
            </Grid>
            <Grid item xs>
              <Editor
                apiKey="r6fv8xh1mo9azwpl9yjhlzxlj2widuepmv44fl2ysyruywkl"
                initialValue={formik.values.description}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onBlur={(evt, editor) => {
                  formik.setFieldValue('description', editor.getContent());
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          p={2}
          sx={{
            backgroundColor: '#323259',
            zIndex: 1200,
            position: 'sticky',
            border: '1px solid #1b1b38',
            borderWidth: '0 0 1px 1px',
            boxShadow: '0 0 13px 0 #b18aff',
            bottom: '-1rem',
          }}
        >
          <Button disabled={!formik.isValid} type="submit" variant="contained" color="warning">
            Update profile
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
export default UserDetailUpdateShopSettingsForm;
