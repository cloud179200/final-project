import { ILoginParams } from '../../../models/auth';
import { Box, TextField, Alert, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LoginRounded } from '@mui/icons-material';
import { useFormik } from 'formik';
import { validationLoginSchema } from '../utils';
interface Props {
  onLogin(values: ILoginParams): void;
  loading: boolean;
  errorMessage: string;
}
const LoginForm = (props: Props) => {
  const { onLogin, loading, errorMessage } = props;
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationLoginSchema,
    onSubmit: (values) => {
      const { email, password, rememberMe } = values;
      const formValues: ILoginParams = {
        email,
        password,
        rememberMe,
      };
      onLogin(formValues);
    },
  });

  return (
    <Box
      component="form"
      width={1}
      maxWidth={'600px'}
      p={3}
      autoComplete="off"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTextField-root': { width: '100%', pb: 2 },
        '& .MuiFormControl-root': { pb: 2 },
        '& .MuiAlert-root': { mb: 2 },
      }}
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <Typography variant="h4" textAlign="center" pb={2}>
        Login
      </Typography>
      <TextField
        required
        label={formik.errors.email || 'Email'}
        name="email"
        type="email"
        error={Boolean(formik.errors.email)}
        value={formik.values.email}
        onChange={formik.handleChange}
      />
      <TextField
        required
        label={formik.errors.password || 'Password'}
        name="password"
        type="password"
        error={Boolean(formik.errors.password)}
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      {/* <FormControlLabel control={<Switch checked={formValues.rememberMe} onChange={(e) => setFormValues({ ...formValues, rememberMe: !formValues.rememberMe })}/>} label={"Remember me?"} /> */}
      {errorMessage !== '' && <Alert severity="error">{errorMessage}</Alert>}
      <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
        <LoadingButton
          disabled={!formik.isValid}
          fullWidth
          variant="contained"
          size="large"
          color="success"
          type="submit"
          loading={loading}
        >
          <LoginRounded />
          &nbsp;Login
        </LoadingButton>
      </Box>
    </Box>
  );
};
export default LoginForm;
