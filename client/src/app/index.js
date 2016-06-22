import React from 'react';
import {render} from 'react-dom'
import ViewerApp from './viewer-app';
import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState().toJS());
    return result
};

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    logger // neat middleware that logs actions
)(createStore);

let store = createStoreWithMiddleware(reducer);

render(
    <Provider store={store}>
        <ViewerApp />
    </Provider>,
    document.getElementById('root')
);