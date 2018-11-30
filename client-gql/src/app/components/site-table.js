import React from 'react';
import TableHeader from './table-header';
import TableRow from './table-row';
import TableLoadingIndicator from './table-loading-indicator';
import './styles/site-tables.css';

const CampSiteTable = ({ campSiteData, dates, showOnlyAvailable }) => {
  if (campSiteData.isEmpty()) {
    return (<TableLoadingIndicator/>);
  }

  const siteRows = campSiteData.map((campsite, idx) => {
    return <TableRow key={idx} campSite={campsite} showOnlyAvailable={showOnlyAvailable}/>;
  });
  return (
    <div className="site-table-container container-fluid">
      <table className="site-table">
        <TableHeader dates={dates}/>
        <tbody>
        {siteRows}
        </tbody>
      </table>
    </div>
  );

};

export default CampSiteTable;
