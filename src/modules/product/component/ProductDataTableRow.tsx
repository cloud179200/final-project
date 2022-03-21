import { DeleteOutlineRounded, PowerSettingsNewRounded } from '@mui/icons-material';
import {
  FormControlLabel,
  TableRow,
  Checkbox,
  styled,
  tableCellClasses,
  TableCell,
  Button,
  Box,
  IconButton,
  Link,
  Typography,
  Modal,
  Grid,
  Container,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  tableRowClasses,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { replace } from 'connected-react-router';
import moment from 'moment';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { IProduct } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { commasRegex, getErrorMessageResponse } from '../../../utils';
import { addNotification } from '../../common/redux/notificationReducer';
import { fetchThunk } from '../../common/redux/thunk';
import {
  addUpdatedPriceAndAmountProduct,
  removeUpdatedPriceAndAmountProduct,
  setLoadingProductData,
} from '../redux/productReducer';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`&.${tableRowClasses.root}`]: {
    '&:hover': {
      '& > :nth-of-type(5) > button': {
        backgroundColor: theme.palette.secondary.main,
        ':hover': {
          backgroundColor: theme.palette.secondary.light,
        },
      },
      '& > :nth-of-type(6) > button': {
        backgroundColor: theme.palette.secondary.main,
        ':hover': {
          backgroundColor: theme.palette.secondary.light,
        },
      },
    },
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    padding: '0.5rem',
    borderColor: '#1B1B38',
    color: theme.palette.common.white,
    [`& > .MuiFormControlLabel-root > .MuiCheckbox-root`]: {
      color: theme.palette.common.white,
    },
    [`& > a`]: {
      color: '#0d6efd',
    },
    [`& > .MuiListItemText-root > .MuiTypography-root > a`]: {
      color: '#0d6efd',
    },
    [`&:first-of-type > :first-of-type`]: {
      borderRight: '1px dotted #fff',
    },
    [`&:first-of-type > :first-of-type > :last-of-type `]: {
      borderLeft: '1px solid #fff',
    },
    [`&:last-of-type > :first-of-type`]: {
      borderLeft: '1px dotted #fff',
    },
  },
}));

interface Props {
  product: IProduct;
  selected: boolean;
  setSelected: (profile_id: string, selected: boolean) => void;
  url: string;
}

const ProductDataTableRow = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const selectedRef = useRef<any>();
  const priceFieldRef = useRef<HTMLInputElement>();
  const amountFieldRef = useRef<HTMLInputElement>();
  const { product, selected, setSelected, url } = props;
  const linkToProductDetail = `${url}${ROUTES.products}${ROUTES.detailProduct}/${product.id}`;
  const linkToUserDetail = `${url}${ROUTES.user}${ROUTES.detailUser}/${product.vendorID}`;

  const [productValues, setProductValues] = useState<IProduct>({ ...product });
  const [priceAndAmountLabel, setPriceAndAmountLabel] = useState({ isLabel: true, focusOn: '' });
  const [modal, setModal] = useState({ openUpdateProductEnabled: false });
  const updateProductEnabled = useCallback(
    async (id: string, enable: 0 | 1) => {
      dispatch(setLoadingProductData(true));
      const json = await dispatch(fetchThunk(API_PATHS.productsEdit, 'post', { params: [{ id, enable }] }));
      dispatch(setLoadingProductData(false));
      if (!json?.errors) {
        dispatch(addNotification({ message: 'Update successfully', type: 'success' }));
        setProductValues({ ...productValues, enabled: productValues.enabled === '0' ? '1' : '0' });
        return;
      }
      dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
    },
    [dispatch, productValues],
  );
  const handleConfirmUpdateProductEnabled = (id: string, enable: 0 | 1) => {
    updateProductEnabled(id, enable);
    setModal({ openUpdateProductEnabled: false });
  };
  const handleDeleteIconClick = (e: any) => {
    selectedRef.current && selectedRef.current.click();
  };
  const handleNameClick = (e: any) => dispatch(replace(linkToProductDetail));
  const handleVendorClick = (e: any) => dispatch(replace(linkToUserDetail));
  const renderCustomInput = (props: any) => {
    const { label } = props;
    return (
      <FormControl size="small">
        <InputLabel>{label}</InputLabel>
        <OutlinedInput {...props} />
      </FormControl>
    );
  };
  useEffect(() => {
    const { isLabel, focusOn } = priceAndAmountLabel;
    if (isLabel) {
      return;
    }
    if (focusOn === 'price') {
      priceFieldRef.current?.focus();
      return;
    }
    amountFieldRef.current?.focus();
  }, [priceAndAmountLabel]);
  useEffect(() => {
    const updatedProduct = { ...productValues };
    if (+productValues.amount !== +product.amount || +productValues.price !== +product.price) {
      dispatch(addUpdatedPriceAndAmountProduct(updatedProduct));
      return;
    }
    dispatch(removeUpdatedPriceAndAmountProduct(updatedProduct.id));
    // eslint-disable-next-line
  }, [dispatch, productValues.amount, productValues.price]);
  return (
    <>
      <StyledTableRow>
        <StyledTableCell align="left">
          <FormControlLabel
            label={
              <Box pl={1} pr={1}>
                <IconButton onClick={(e) => setModal({ openUpdateProductEnabled: true })}>
                  <PowerSettingsNewRounded sx={{ color: productValues.enabled === '0' ? '#fff' : green[500] }} />
                </IconButton>
              </Box>
            }
            sx={{
              m: 0,
            }}
            control={
              <Checkbox
                ref={selectedRef}
                checked={selected}
                onChange={(e) => setSelected(productValues.id, e.target.checked)}
              />
            }
          />
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ width: '10%' }}>
          <Typography>{productValues.sku}</Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Link onClick={handleNameClick}>{productValues.name}</Link>
        </StyledTableCell>
        <StyledTableCell
          align="left"
          sx={{
            width: '10%',
            '& > p': {
              width: '200px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            },
          }}
        >
          <Typography>{productValues.category}</Typography>
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ width: '7%' }}>
          {priceAndAmountLabel.isLabel ? (
            <Button
              onClick={(e) => {
                !selected && setPriceAndAmountLabel({ isLabel: false, focusOn: 'price' });
              }}
            >
              <Typography>
                <CurrencyFormat
                  displayType="text"
                  thousandSeparator
                  fixedDecimalScale
                  decimalScale={2}
                  prefix="$"
                  value={+productValues.price}
                />
              </Typography>
            </Button>
          ) : (
            <CurrencyFormat
              inputRef={priceFieldRef}
              customInput={renderCustomInput}
              value={productValues.price}
              thousandSeparator
              fixedDecimalScale
              decimalScale={2}
              label="Price"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              onBlur={(e) => {
                setPriceAndAmountLabel({ isLabel: true, focusOn: '' });
                !selected && setProductValues({ ...productValues, price: e.target.value.replace(commasRegex, '') });
              }}
            />
          )}
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ width: '7%' }}>
          {priceAndAmountLabel.isLabel ? (
            <Button
              onClick={(e) => {
                !selected && setPriceAndAmountLabel({ isLabel: false, focusOn: 'amount' });
              }}
            >
              <Typography>
                <CurrencyFormat
                  displayType="text"
                  thousandSeparator
                  fixedDecimalScale
                  decimalScale={0}
                  value={+productValues.amount}
                />
              </Typography>
            </Button>
          ) : (
            <CurrencyFormat
              inputRef={amountFieldRef}
              customInput={renderCustomInput}
              value={productValues.amount}
              thousandSeparator
              fixedDecimalScale
              decimalScale={2}
              label="In stock"
              onBlur={(e) => {
                setPriceAndAmountLabel({ isLabel: true, focusOn: '' });
                !selected && setProductValues({ ...productValues, amount: e.target.value.replace(commasRegex, '') });
              }}
            />
          )}
        </StyledTableCell>
        <StyledTableCell
          align="left"
          sx={{
            width: '10%',
            '& > p': {
              width: '100px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            },
          }}
        >
          <Typography>
            <Link onClick={handleVendorClick} title={productValues.vendor}>
              {productValues.vendor}
            </Link>
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ width: '8%' }}>
          <Typography>
            {productValues.arrivalDate === '0' ? '--' : moment.unix(+productValues.arrivalDate).format('MMM DD, YYYY')}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ width: '8%' }}>
          <Box pl={1.5} pt={0.5} pb={0.5}>
            <Button color="secondary" variant="contained" onClick={handleDeleteIconClick}>
              <DeleteOutlineRounded />
            </Button>
          </Box>
        </StyledTableCell>
      </StyledTableRow>
      <Modal
        open={modal.openUpdateProductEnabled}
        onClose={() => setModal({ ...modal, openUpdateProductEnabled: false })}
      >
        <Container
          maxWidth="xs"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
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
                Confirm Update
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              p={2}
              sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
            >
              <Typography color="#fff" variant="body1" fontSize=".9375rem">
                Do you want to update this product ?
              </Typography>
            </Grid>
            <Box
              component="span"
              width={1}
              p={2}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .MuiTextField-root': { width: '100%', pb: 2 },
                '& .MuiFormControl-root': { pb: 2 },
                '& .MuiAlert-root': { mb: 2 },
              }}
            >
              <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) =>
                    handleConfirmUpdateProductEnabled(productValues.id, productValues.enabled === '0' ? 1 : 0)
                  }
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => setModal({ ...modal, openUpdateProductEnabled: false })}
                >
                  No
                </Button>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};
export default memo(ProductDataTableRow);
