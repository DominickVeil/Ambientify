import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from '../reducers';

const middlewares = [];
if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
}

const configureStore = () => compose(applyMiddleware(...middlewares))(createStore)(rootReducer);

export default configureStore;