import { routerMiddleware } from 'connected-react-router';
import { history } from './router';

export default routerMiddleware(history);
