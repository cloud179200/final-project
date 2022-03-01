import { Redirect, Route, RouteProps } from 'react-router-dom';
import { ROUTES } from '../../../configs/routes';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
interface Props extends RouteProps { }

const AuthRoute = (props: Props) => {
    const { ...rest } = props;
    const auth = Cookies.get(ACCESS_TOKEN_KEY);
    const { user } = useSelector((state: AppState) => ({
        user: state.profile.user,
      }));
      
    if (!auth || !user) {
        return <Route {...rest} />;
    }
    
    return (
        <Redirect
            to={{
                pathname: ROUTES.pages,
            }}
        />
    );
};

export default AuthRoute;