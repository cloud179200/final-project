import * as yup from 'yup';

export const validationLoginSchema = yup.object({
  email: yup.string().email().required('emailRequired'),
  password: yup.string().min(6, 'minPasswordInvalid').required('passwordRequired'),
  rememberMe: yup.boolean(),
});
