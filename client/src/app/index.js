/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import { render } from 'react-dom';
import SiteContainer from './containers/site-container';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { ThemeProvider } from 'mineral-ui/themes';

const logger = store => next => action => {
    /* eslint-disable no-console */
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState()['campsite'].toJS());
    /* eslint-enable no-console */
    return result;
};

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    logger // neat middleware that logs actions
)(createStore);

let store = createStoreWithMiddleware(reducer);

render(
    <Provider store={store}>
        <ThemeProvider>
            <SiteContainer/>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root')
);