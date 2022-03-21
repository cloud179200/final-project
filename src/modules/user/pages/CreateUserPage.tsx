import { ArrowBackRounded } from '@mui/icons-material';
import { Box, Grid, IconButton } from '@mui/material';
import { replace } from 'connected-react-router';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ROUTES } from '../../../configs/routes';
import { ICreateUserParams } from '../../../models/user';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import { setLoadingData } from '../../common/redux/dataReducer';
import { API_PATHS } from '../../../configs/api';
import { addNotification } from '../../common/redux/notificationReducer';
import { getErrorMessageResponse } from '../../../utils';
import CreateUserForm from '../component/CreateUserForm';
interface Props {
  url: string;
}
const CreateUserPage = (props: Props) => {
  const { url } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const handleBackClick = (e: any) => dispatch(replace(`${url}${ROUTES.user}${ROUTES.manageUser}`));

  const onCreateUser = useCallback(
    async (values: ICreateUserParams) => {
      dispatch(setLoadingData(true));
      const json = await dispatch(fetchThunk(API_PATHS.usersCreate, 'post', { ...values }));
      dispatch(setLoadingData(false));
      if (!json?.errors) {
        dispatch(addNotification({ message: 'Add user successfully', type: 'success' }));
        dispatch(replace(`${url}${ROUTES.user}${ROUTES.detailUser}/${json.data.info.profile_id}`));
        return;
      }
      dispatch(addNotification({ message: getErrorMessageResponse(json), type: 'error' }));
    },
    [dispatch, url],
  );
  const handleCreateUser = (values: ICreateUserParams) => {
    onCreateUser({ ...values, membership_id: values.membership_id !== '-1' ? values.membership_id : '' });
  };
  return (
    <Box
      component="div"
      sx={{
        overflow: 'auto',
        position: 'relative',
        maxHeight: '95vh',
        maxWidth: 1,
        backgroundColor: '#1A1C37',
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
    >
      <Grid container width={1}>
        <Box pl={3.5} pt={4} width={1} sx={{ backgroundColor: '#1B1B38' }}>
          <IconButton
            sx={{
              padding: '0.5rem',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#fff',
              },
            }}
            onClick={handleBackClick}
          >
            <ArrowBackRounded sx={{ color: 'black' }} />
          </IconButton>
        </Box>
        <CreateUserForm onCreateUser={handleCreateUser} />
      </Grid>
    </Box>
  );
};
export default CreateUserPage;
