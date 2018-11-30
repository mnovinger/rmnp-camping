import React from 'react';
import './styles/table-header.css';

const TableHeader = ({dates}) => {
  const dateCells = dates.map((date) => {
    return (<th key={date.format('MMDD')} className="status-col">{date.format('ddd MM/DD')}</th>);
  });

  return (<thead>
  <tr>
    <th className="site-col">Site</th>
    {dateCells}
  </tr>
  </thead>);
};

export default TableHeader;
