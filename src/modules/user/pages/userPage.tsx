import { Box, Button, Container, Grid, Modal, Typography } from '@mui/material';
import { replace } from 'connected-react-router';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { IUserDetail, IUserFilter } from '../../../models/user';
import { AppState } from '../../../redux/reducer';
import { setCommonsRole, setCountries, setLoadingData, setStates } from '../../common/redux/dataReducer';
import { fetchThunk } from '../../common/redux/thunk';
import UserDataTable from '../component/UserDataTable';
import UserFilter from '../component/UserFilter';
import { setUsers, setFilter as setUserFilter } from '../redux/userReducer';
interface Props {
  url: string;
}
const UserPage = (props: Props) => {
  const { url } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user, users, pageInfo, userFilter } = useSelector((state: AppState) => ({
    user: state.profile.user,
    users: state.user.users,
    pageInfo: state.user.pageInfoUser,
    userFilter: state.user.filter,
  }));
  const [filter, setFilter] = useState<IUserFilter>();
  const [selectedUsers, setSelectedUsers] = useState<Array<IUserDetail>>([]);
  const [modal, setModal] = useState<{ openConfirmDelete: boolean }>({ openConfirmDelete: false });
  const handleAddUserClick = (e: any) => dispatch(replace(`${url}${ROUTES.user}${ROUTES.newUser}`));
  const handleSetFilterForUserFilter = useCallback((f: IUserFilter) => {
    setFilter((prevFilter) => {
      return {
        ...f,
        sort: prevFilter ? prevFilter.sort : f.sort,
        order_by: prevFilter && prevFilter.order_by === ('ASC' || 'DESC') && true ? prevFilter.order_by : f.order_by,
      };
    });
  }, []);
  const handleSetFilterForUserDataTable = useCallback((sort: string, order_by: 'ASC' | 'DESC') => {
    setFilter((prevFilter) => {
      return prevFilter ? { ...prevFilter, sort, order_by } : prevFilter;
    });
  }, []);
  const getUsers = useCallback(async () => {
    if (!filter) {
      return;
    }
    dispatch(setLoadingData(true));
    const json = await dispatch(
      fetchThunk(API_PATHS.usersList, 'post', {
        ...filter,
        date_range:
          !filter.date_range[0] && !filter.date_range[1]
            ? []
            : filter.date_range.map((item) => (item ? moment(item).format('YYYY-MM-DD') : '')),
        page: pageInfo.index + 1,
        count: pageInfo.count,
      }),
    );
    dispatch(setLoadingData(false));
    if (!json?.errors) {
      dispatch(
        setUsers({ detail: [...json.data], recordsTotal: json.recordsTotal, recordsFiltered: json.recordsFiltered }),
      );
      return;
    }
  }, [dispatch, filter, pageInfo]);
  const handleRemoveSelectedClick = (e: any) => {
    setModal({ ...modal, openConfirmDelete: false });
    deleteUsers();
  };
  const deleteUsers = useCallback(async () => {
    if (selectedUsers.length < 1 || !user) {
      return;
    }
    dispatch(setLoadingData(true));
    const usersForDelete = [...selectedUsers].filter(
      (detail) => detail.vendor !== 'admin.training@powergatesoftware.com',
    );
    const paramsForDelete = usersForDelete.map((item) => {
      return { id: item.profile_id, delete: 1 };
    });
    const json = await dispatch(fetchThunk(API_PATHS.usersEdit, 'post', { params: paramsForDelete }));
    dispatch(setLoadingData(false));
    if (!json?.errors) {
      getUsers();
      return;
    }
  }, [dispatch, selectedUsers, user, getUsers]);
  const getUserTypes = useCallback(async () => {
    dispatch(setLoadingData(true));
    const json = await dispatch(fetchThunk(API_PATHS.commonsRole));
    dispatch(setLoadingData(false));
    if (!json?.errors) {
      dispatch(setCommonsRole(json.data));
      return;
    }
  }, [dispatch]);
  const getCountries = useCallback(async () => {
    dispatch(setLoadingData(true));
    const json = await dispatch(fetchThunk(API_PATHS.commonsCountry));
    dispatch(setLoadingData(false));
    if (!json?.errors) {
      dispatch(setCountries(json.data));
      return;
    }
  }, [dispatch]);
  const getStates = useCallback(
    async (countryCode: string) => {
      dispatch(setLoadingData(true));
      const json = await dispatch(fetchThunk(API_PATHS.commonsState, 'post', { code: countryCode }));
      dispatch(setLoadingData(false));
      if (!json?.errors) {
        dispatch(setStates(json.data));
        return;
      }
    },
    [dispatch],
  );
  useEffect(() => {
    getUserTypes();
  }, [getUserTypes]);
  useEffect(() => {
    getCountries();
  }, [getCountries]);
  useEffect(() => {
    if (!filter) {
      return;
    }
    dispatch(setUserFilter({ ...filter }));
    getUsers();
    setSelectedUsers([]);
  }, [filter, getUsers, pageInfo, dispatch]);
  useEffect(() => {
    setFilter(
      userFilter
        ? { ...userFilter }
        : {
            search: '',
            memberships: [],
            types: [],
            status: 'all',
            country: '',
            state: '',
            address: '',
            phone: '',
            date_range: [null, null],
            date_type: 'R',
            sort: 'last_login',
            order_by: 'DESC',
            tz: 7,
          },
    );
    return () => {
      users && dispatch(setUsers({ ...users, detail: [] }));
    };
    // eslint-disable-next-line
  }, []);
  return (
    <Box
      component="div"
      sx={{
        overflow: 'auto',
        position: 'relative',
        maxHeight: '95vh',
        maxWidth: 1,
        '&::-webkit-scrollbar': {
          height: '10px',
          width: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#b18aff',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#13132b',
          borderRadius: '3px',
        },
      }}
      p={4}
    >
      {users && (
        <>
          <Typography variant="h4" pb={2} sx={{ color: '#fff' }}>
            Search for users
          </Typography>
          <Box component="div" pb={2}>
            <UserFilter initialFilter={filter} getStates={getStates} setFilterByPage={handleSetFilterForUserFilter} />
          </Box>
          <Box component="div" pb={4} pt={4}>
            <Button color="secondary" variant="contained" onClick={handleAddUserClick}>
              Add User
            </Button>
          </Box>
          <Box component="div" sx={{ overflow: 'auto' }}>
            <UserDataTable
              initialFilter={filter}
              url={url}
              users={users}
              setFilterByPage={handleSetFilterForUserDataTable}
              selectedUsers={selectedUsers}
              setSelectedUsers={(selected: Array<IUserDetail>) => {
                setSelectedUsers([...selected]);
              }}
            />
          </Box>
          <Box
            component="div"
            mt={2}
            p={2}
            width={1}
            sx={{
              backgroundColor: '#323259',
              position: 'sticky',
              border: '1px solid #1b1b38',
              borderWidth: '0 0 1px 1px',
              boxShadow: '0 0 13px 0 #b18aff',
              bottom: '0',
            }}
          >
            <Button
              disabled={selectedUsers.length === 0}
              color="warning"
              variant="contained"
              onClick={(e) => setModal({ ...modal, openConfirmDelete: true })}
            >
              Remove selected
            </Button>
          </Box>
          <Modal open={modal.openConfirmDelete} onClose={() => setModal({ ...modal, openConfirmDelete: false })}>
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
                    Confirm Delete
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  p={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', borderBottom: '1px solid #1b1b38' }}
                >
                  <Typography color="#fff" variant="body1" fontSize=".9375rem">
                    Do you want to delete these users?
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
                    <Button variant="contained" color="secondary" onClick={handleRemoveSelectedClick}>
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => setModal({ ...modal, openConfirmDelete: false })}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Container>
          </Modal>
        </>
      )}
    </Box>
  );
};
export default UserPage;
