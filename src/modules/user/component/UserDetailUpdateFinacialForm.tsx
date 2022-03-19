import {
  Box,
  Grid,
  Typography,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
  TextField,
  OutlinedInput,
} from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IFinancialDetail } from '../../../models/account';
import { AppState } from '../../../redux/reducer';
import { LABEL_COLUMN } from '../../../utils/constants';
import { useFormik } from 'formik';
import { validationUpdateFinancialUserSchema } from '../utils';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
interface Props {
  financialDetail: IFinancialDetail;
  onUpdateFinancialDetail: (values: IFinancialDetail) => void;
  getStates: (country_code: string) => void;
}
const UserDetailUpdateFinacialForm = (props: Props) => {
  const { financialDetail, onUpdateFinancialDetail, getStates } = props;
  const { states } = useSelector((state: AppState) => ({
    states: state.data.states,
  }));
  const formik = useFormik({
    initialValues: {
      hasSpecialRevshareFeeDst: '0',
      hasSpecialRevshareFeeShipping: '0',
      specialRevshareFeeDst: 0,
      specialRevshareFeeShipping: 0,
      us_tax_calculate_for: 'all',
      us_tax_states: [],
    },
    validationSchema: validationUpdateFinancialUserSchema,
    onSubmit: (values) => {
      const {
        hasSpecialRevshareFeeDst,
        hasSpecialRevshareFeeShipping,
        specialRevshareFeeDst,
        specialRevshareFeeShipping,
        us_tax_calculate_for,
        us_tax_states,
      } = values;
      const formValues: IFinancialDetail = {
        hasSpecialRevshareFeeDst,
        hasSpecialRevshareFeeShipping,
        specialRevshareFeeDst: specialRevshareFeeDst > 0 ? specialRevshareFeeDst.toString() : '',
        specialRevshareFeeShipping: specialRevshareFeeShipping > 0 ? specialRevshareFeeDst.toString() : '',
        us_tax_calculate_for,
        us_tax_states: us_tax_states.join(','),
      };
      onUpdateFinancialDetail({ ...formValues });
    },
  });

  useEffect(() => {
    const {
      hasSpecialRevshareFeeDst,
      hasSpecialRevshareFeeShipping,
      specialRevshareFeeDst,
      specialRevshareFeeShipping,
      us_tax_calculate_for,
      us_tax_states,
    } = financialDetail;
    formik.setValues({
      hasSpecialRevshareFeeDst,
      hasSpecialRevshareFeeShipping,
      specialRevshareFeeDst: +specialRevshareFeeDst,
      specialRevshareFeeShipping: +specialRevshareFeeShipping,
      us_tax_calculate_for: us_tax_calculate_for ? us_tax_calculate_for : 'all',
      us_tax_states: us_tax_states.split(',').filter((item) => item !== '') as never[],
    });
   
    // eslint-disable-next-line
  }, [financialDetail]);
  useEffect(() => {
    getStates("US")
  }, [getStates])
  return (
    <Box component="form" width={1} onSubmit={formik.handleSubmit}>
      <Grid container width={1} position="relative">
        <Grid item xs={12} pb={2}>
          <Typography sx={{ fontSize: '1.5rem' }}>Commission rates</Typography>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">
                This vendor pays Order DST based commission to Marketplace owner based on
              </Typography>
            </Grid>
            <Grid item xs>
              <FormControl
                size="small"
                fullWidth
                sx={{ color: '#fff' }}
                error={Boolean(formik.errors.hasSpecialRevshareFeeDst)}
              >
                <InputLabel>{formik.errors.hasSpecialRevshareFeeDst || 'Rate'}</InputLabel>
                <Select
                  value={formik.values.hasSpecialRevshareFeeDst}
                  name="hasSpecialRevshareFeeDst"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  input={<OutlinedInput label={formik.errors.hasSpecialRevshareFeeDst || 'Rate'} />}
                >
                  <MenuItem value="0">Global rate</MenuItem>
                  <MenuItem value="1">Special rate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {formik.values.hasSpecialRevshareFeeDst === '1' && (
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="left">
                  Order DST based commission rate to be paid to Marketplace owner by this vendor
                </Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  size="small"
                  name="specialRevshareFeeDst"
                  type="number"
                  label={formik.errors.specialRevshareFeeDst || 'specialRevshareFeeDst'}
                  error={Boolean(formik.errors.specialRevshareFeeDst)}
                  value={formik.values.specialRevshareFeeDst}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          )}
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">
                This vendor pays shipping cost based commission to Marketplace owner based on
              </Typography>
            </Grid>
            <Grid item xs>
              <FormControl
                size="small"
                fullWidth
                sx={{ color: '#fff' }}
                error={Boolean(formik.errors.hasSpecialRevshareFeeShipping)}
              >
                <InputLabel>{formik.errors.hasSpecialRevshareFeeShipping || 'Rate'}</InputLabel>
                <Select
                  value={formik.values.hasSpecialRevshareFeeShipping}
                  name="hasSpecialRevshareFeeDst"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  input={<OutlinedInput label={formik.errors.hasSpecialRevshareFeeShipping || 'Rate'} />}
                >
                  <MenuItem value="0">Global rate</MenuItem>
                  <MenuItem value="1">Special rate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {formik.values.hasSpecialRevshareFeeShipping === '1' && (
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="left">
                  Shipping cost based commission rate to be paid to Marketplace owner by this vendor
                </Typography>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  size="small"
                  name="specialRevshareFeeShipping"
                  type="number"
                  label={formik.errors.specialRevshareFeeShipping || 'specialRevshareFeeShipping'}
                  error={Boolean(formik.errors.specialRevshareFeeShipping)}
                  value={formik.values.specialRevshareFeeShipping}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          )}
          <Typography sx={{ fontSize: '1.5rem' }}>US tax calculation</Typography>
          <Typography>
            Gear Focus is legally required to collect and remit taxes for the following Marketplace Facilitator states:{' '}
            <b>Maryland, New Jersey</b>
          </Typography>
          <Grid container width={1} p={2} spacing={3}>
            <Grid item xs={LABEL_COLUMN}>
              <Typography align="left">Automatically calculate taxes for</Typography>
            </Grid>
            <Grid item xs>
              <FormControl
                size="small"
                fullWidth
                sx={{ color: '#fff' }}
                error={Boolean(formik.errors.us_tax_calculate_for)}
              >
                <InputLabel>{formik.errors.us_tax_calculate_for || 'States'}</InputLabel>
                <Select
                  value={formik.values.us_tax_calculate_for}
                  name="us_tax_calculate_for"
                  onChange={formik.handleChange}
                  input={<OutlinedInput label={formik.errors.us_tax_calculate_for || 'States'} />}
                >
                  <MenuItem value="all">All US States</MenuItem>
                  <MenuItem value="specific">Specific states</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {formik.values.us_tax_calculate_for === 'specific' && (
            <Grid container width={1} p={2} spacing={3}>
              <Grid item xs={LABEL_COLUMN}>
                <Typography align="left">Automatically calculate taxes for</Typography>
              </Grid>
              <Grid item xs>
                <FormControl fullWidth required size="small">
                  <InputLabel>Country codes</InputLabel>
                  <Select
                    multiple
                    value={formik.values.us_tax_states}
                    name="us_tax_states"
                    onChange={(e) => {
                      formik.setValues({ ...formik.values, us_tax_states: e.target.value as never[] });
                    }}
                    renderValue={(selected) => selected.join(', ')}
                    input={<OutlinedInput label="States" />}
                    MenuProps={MenuProps}
                  >
                    {states &&
                      states.map((item) => (
                        <MenuItem key={item.state_id+item.state} value={item.code}>
                          <Checkbox checked={formik.values.us_tax_states.some((i) => i === item.code)} />
                          <ListItemText primary={item.code} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
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
export default UserDetailUpdateFinacialForm;
