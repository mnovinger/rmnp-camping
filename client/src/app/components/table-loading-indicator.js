import React from 'react';

import './styles/table-loading-indicator.css';

export default class TableLoadingIndicator extends React.Component {
    render() {
        return (<div className='loading-container'>
            <div className='loading-message'><h1 className='loading-text'>Loading data</h1><img src="/gears.svg"/></div>
        </div>);
    }
}