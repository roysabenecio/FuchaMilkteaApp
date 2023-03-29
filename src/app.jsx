import AppRoutes from './routes';
import { hot } from 'react-hot-loader';
import MainContainer from './features/main/main';

const App = () => {
    return(
        <MainContainer>
            <AppRoutes />
        </MainContainer>
    );
};

export default hot(module)(App);