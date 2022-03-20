import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPageRounded,
  LastPageRounded,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
} from '@mui/icons-material';
import {
  TableContainer,
  useTheme,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableFooter,
  TableHead,
  FormControlLabel,
  Checkbox,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { IProducts, IProduct } from '../../../models/product';
import { AppState } from '../../../redux/reducer';
import { setPageInfoProduct } from '../redux/productReducer';
import ProductDataTableRow from './ProductDataTableRow';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageRounded /> : <FirstPageRounded />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageRounded /> : <LastPageRounded />}
      </IconButton>
    </Box>
  );
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    padding: '0.3rem',
    borderColor: '#1B1B38',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.head} > .MuiFormControlLabel-root > .MuiCheckbox-root`]: {
    color: theme.palette.common.white,
  },
}));
interface Props {
  products?: IProducts;
  selectedProducts: Array<IProduct>;
  setSelectedProducts: (selected: Array<IProduct>) => void;
  setFilterByPage: (sort: string, order_by: 'ASC' | 'DESC') => void;
  url: string;
}

const UserDataTable = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const {
    products,
    selectedProducts,
    setSelectedProducts,
    setFilterByPage,
    url,
  } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<{ sort: string; order_by: 'ASC' | 'DESC' }>({ sort: 'name', order_by: 'ASC' });
  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (products ? products.detail.length : 0)) : 0;
  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);
  const handleCheckSelectedAll = (e: any) => {
    if (!products || rowsPerPage < 1) {
      return;
    }
    if (!e.target.checked) {
      setSelectedProducts([]);
      return;
    }
    const currentUsersInPage = [...products.detail];
    setSelectedProducts(currentUsersInPage);
  };
  const handleCheckSelectedOne = useCallback(
    (product_id: string, selected: boolean) => {
      if (!products) {
        return;
      }
      if (!selected) {
        const newSelectedProducts = [...selectedProducts].filter((detail) => detail.id !== product_id);
        setSelectedProducts(newSelectedProducts);
        return;
      }
      const productDetail = [...products.detail].find((detail) => detail.id === product_id);
      if (!productDetail) {
        return;
      }
      let newSelectedProducts = [...selectedProducts].filter((detail) => detail.id !== product_id);
      newSelectedProducts.push({ ...productDetail });
      setSelectedProducts(newSelectedProducts);
    },
    [selectedProducts, setSelectedProducts, products],
  );
  const isSelectedAll = () => {
    if (!products || products.detail.length < 1) {
      return false;
    }
    const currentProductsInPage = [...products.detail].slice(0, rowsPerPage);
    currentProductsInPage.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    const currentSelectedProducts = [...selectedProducts];
    currentSelectedProducts.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    return JSON.stringify(currentProductsInPage) === JSON.stringify(currentSelectedProducts);
  };
  const isSelected = useCallback(
    (product_id: string) => {
      const currentSelectedProducts = [...selectedProducts];
      const indexDetail = currentSelectedProducts.findIndex((detail) => detail.id === product_id);
      return indexDetail > -1;
    },
    [selectedProducts],
  );
  const getSortIcon = useCallback(
    (column: string) => {
      let icon = <></>;
      if (sortBy.sort === column) {
        icon = sortBy.order_by === 'ASC' ? <ArrowDownwardRounded /> : <ArrowUpwardRounded />;
      }
      return icon;
    },
    [sortBy],
  );
  const handleSwitchSortBy = useCallback(
    (column: string) => {
      setSortBy({ sort: column, order_by: sortBy.order_by === 'ASC' ? 'DESC' : 'ASC' });
    },
    [sortBy],
  );
  useEffect(() => {
    if (!sortBy.sort) {
      return;
    }
    setFilterByPage(sortBy.sort, sortBy.order_by);
  }, [sortBy, setFilterByPage]);
  useEffect(() => {
    dispatch(setPageInfoProduct({ index: page, count: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 1,
          backgroundColor: '#323259',
        }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">
              <FormControlLabel
                label=""
                sx={{ m: 0, p: 0.5 }}
                control={<Checkbox value="" checked={isSelectedAll()} onChange={handleCheckSelectedAll} />}
              />
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ cursor: 'pointer' }} onClick={(e) => handleSwitchSortBy('sku')}>
              SKU&nbsp;{getSortIcon('sku')}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ cursor: 'pointer' }} onClick={(e) => handleSwitchSortBy('name')}>
              Name&nbsp;{getSortIcon('name')}
            </StyledTableCell>
            <StyledTableCell align="left">Category</StyledTableCell>
            <StyledTableCell align="left" sx={{ cursor: 'pointer' }} onClick={(e) => handleSwitchSortBy('price')}>
              Price&nbsp;{getSortIcon('price')}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ cursor: 'pointer' }} onClick={(e) => handleSwitchSortBy('instock')}>
              In Stock&nbsp;{getSortIcon('instock')}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ cursor: 'pointer' }} onClick={(e) => handleSwitchSortBy('vendor')}>
              Vendor&nbsp;{getSortIcon('vendor')}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ cursor: 'pointer' }} onClick={(e) => handleSwitchSortBy('arrivaldate')}>
              Arrival Date&nbsp;{getSortIcon('arrivaldate')}
            </StyledTableCell>
            <StyledTableCell align="left"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products &&
            (rowsPerPage > 0 ? products.detail.slice(0, rowsPerPage) : products.detail).map((product) => (
              <ProductDataTableRow
                url={url}
                key={product.id}
                product={product}
                selected={isSelected(product.id)}
                setSelected={handleCheckSelectedOne}
              />
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[25, 50, 75, 100, { label: 'All', value: -1 }]}
              colSpan={10}
              count={products ? +products.recordsFiltered : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
export default UserDataTable;
