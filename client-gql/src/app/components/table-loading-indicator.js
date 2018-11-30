import React from 'react';

import './styles/table-loading-indicator.css';

const TableLoadingIndicator = () => {
  return (<div className='loading-container'>
    <div className='loading-message'><h1 className='loading-text'>Loading data</h1><img src="/gears.svg"/></div>
  </div>);
};

export default TableLoadingIndicator;
