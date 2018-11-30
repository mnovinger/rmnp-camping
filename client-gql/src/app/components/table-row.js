import React from 'react';

const TableRow = ({campSite, showOnlyAvailable}) => {
  const statuses = campSite.get('availability').map((status, idx) => {
    return <td key={idx} className="status-col">{status.get('status')}</td>;
  });

  if (showOnlyAvailable && campSite.get('availability').filter((status) => status.get('status') !== 'NA').size === 0) {
    return null;
  }
  return (
    <tr className="site-row">
      <td className="site-col">{campSite.get('name') + ' (' + campSite.get('id') + ')'}</td>
      {statuses}
    </tr>
  );
};

export default TableRow;
