import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'redux';
import { useEffect } from 'react';
import { setStates } from '../../common/redux/dataReducer';
import { IInfoUserDetailAddressBook } from '../../../models/account';
import { LABEL_COLUMN } from '../../../utils/constants';
import { useFormik } from 'formik';
import { validationCreateAddressUserSchema } from '../utils';
interface Props {
  getStates: (country_code: string) => void;
  onCreateAddress: (values: IInfoUserDetailAddressBook) => void;
}
const UserDetailCreateAddressForm = (props: Props) => {
  const { getStates, onCreateAddress } = props;
  const { countries, states } = useSelector((state: AppState) => ({
    countries: state.data.countries,
    states: state.data.states,
  }));
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const formik = useFormik({
    initialValues: {
      id: '',
      address: '',
      city: '',
      country_code: '',
      first_name: '',
      is_billing: false,
      is_shipping: false,
      last_name: '',
      phone: '',
      state: '',
      state_code: '',
      state_id: '',
      tax: '',
      zip_code: '',
    },
    validationSchema: validationCreateAddressUserSchema,
    onSubmit: (values) => {
      const {
        id,
        address,
        city,
        country_code,
        first_name,
        is_billing,
        is_shipping,
        last_name,
        phone,
        state,
        state_code,
        state_id,
        tax,
        zip_code,
      } = values;
      const formValues: IInfoUserDetailAddressBook = {
        id,
        address,
        city,
        country_code,
        first_name,
        is_billing: is_billing ? 1 : 0,
        is_shipping: is_shipping ? 1 : 0,
        last_name,
        phone,
        state,
        state_code,
        state_id,
        tax,
        zip_code,
      };
      onCreateAddress({ ...formValues });
    },
  });

  useEffect(() => {
    if (formik.values.country_code) {
      getStates(formik.values.country_code);
      return;
    }
    dispatch(setStates([]));
  }, [formik.values.country_code, dispatch, getStates]);
  return (
    <Container
      maxWidth="sm"
      component="form"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      onSubmit={formik.handleSubmit}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{
          borderRadius: 4,
          backgroundColor: '#323259',
          border: `1px solid #13132b`,
        }}
      >
        <Grid
          item
          xs={12}
          pb={1}
          p={2}
          sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
        >
          <Typography color="#fff" variant="body1" fontSize=".9375rem" fontWeight="bold">
            Address details
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            borderBottom: '1px solid #1b1b38',
            maxHeight: '40vh',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              height: '0.3125rem',
              width: '0.3125rem',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#13132b',
              borderRadius: '0.15625rem',
              cursor: 'pointer',
            },
            '&::-webkit-scrollbar-track': {
              background: '#252547',
            },
          }}
        >
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">First name</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                name="first_name"
                type="text"
                label={formik.errors.first_name || 'First Name'}
                error={Boolean(formik.errors.first_name)}
                value={formik.values.first_name}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">Last name</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                name="last_name"
                type="text"
                label={formik.errors.last_name || 'Last Name'}
                error={Boolean(formik.errors.last_name)}
                value={formik.values.last_name}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">Address</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                name="address"
                type="text"
                label={formik.errors.address || 'Address'}
                error={Boolean(formik.errors.address)}
                value={formik.values.address}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">City</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                name="city"
                type="text"
                label={formik.errors.city || 'City'}
                error={Boolean(formik.errors.city)}
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">Country</Typography></Grid>
            <Grid item xs>
              <FormControl
                size="small"
                required
                fullWidth
                sx={{ color: '#fff' }}
                error={Boolean(formik.errors.country_code)}
              >
                <InputLabel>{formik.errors.country_code || 'Country'}</InputLabel>
                <Select
                  value={countries?.find((item) => item.code === formik.values.country_code)?.code || ''}
                  name="country_code"
                  onChange={(e) => {
                    formik.setValues({
                      ...formik.values,
                      state: '',
                      state_code: '',
                      state_id: '',
                      country_code: e.target.value,
                    });
                  }}
                  input={<OutlinedInput label={formik.errors.country_code || 'Country'} />}
                >
                  {countries &&
                    countries.map((item) => (
                      <MenuItem key={item.country} value={item.code}>
                        {item.country}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {formik.values.country_code && (
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}><Typography align="right">State</Typography></Grid>
              <Grid item xs>
                {states && states.length > 0 && true ? (
                  <FormControl
                    size="small"
                    required
                    fullWidth
                    sx={{ color: '#fff' }}
                    error={Boolean(formik.errors.state)}
                  >
                    <InputLabel>{formik.errors.state || 'State'}</InputLabel>
                    <Select
                      value={formik.values.state_id}
                      name="state"
                      onChange={(e) => {
                        const stateTarget = states.find((item) => item.state_id === e.target.value);
                        if (stateTarget) {
                          formik.setValues({
                            ...formik.values,
                            state: stateTarget.state,
                            state_code: stateTarget.code.toString(),
                            state_id: stateTarget.state_id,
                            country_code: e.target.value,
                          });
                        }
                      }}
                      input={<OutlinedInput label={formik.errors.state || 'state'} />}
                    >
                      {states.map((item) => (
                        <MenuItem key={item.state} value={item.state_id}>
                          {item.state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    required
                    size="small"
                    fullWidth
                    name="state"
                    type="text"
                    label={formik.errors.state || 'State'}
                    error={Boolean(formik.errors.state)}
                    value={formik.values.state}
                    onChange={formik.handleChange}
                  />
                )}
              </Grid>
            </Grid>
          )}
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">Zip code</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                name="zip_code"
                type="text"
                label={formik.errors.zip_code || 'Zip code'}
                error={Boolean(formik.errors.zip_code)}
                value={formik.values.zip_code}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">Phone number</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                required
                autoComplete="off"
                size="small"
                name="phone"
                type="text"
                label={formik.errors.phone || 'Phone'}
                error={Boolean(formik.errors.phone)}
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}><Typography align="right">Tax number</Typography></Grid>
            <Grid item xs>
              <TextField
                fullWidth
                autoComplete="off"
                size="small"
                name="tax"
                type="text"
                label={formik.errors.tax || 'Tax number'}
                error={Boolean(formik.errors.tax)}
                value={formik.values.tax}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          p={2}
          sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
        >
          <Button disabled={!formik.isValid} color="secondary" variant="contained" type="submit">
            Add AddressBook
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
export default UserDetailCreateAddressForm;
