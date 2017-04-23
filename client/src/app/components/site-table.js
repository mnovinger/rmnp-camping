import React, { Component } from 'react';
import TableHeader from './table-header';
import TableRow from './table-row';
import TableLoadingIndicator from './table-loading-indicator';
import './styles/site-tables.css';

export default class CampSiteTable extends Component {

    render() {
        if (this.props.campSiteData.isEmpty()) {
            return (<TableLoadingIndicator />);
        }

        const siteRows = this.props.campSiteData.map((campsite, idx) => {
            return <TableRow key={idx} campSite={campsite} showOnlyAvailable={this.props.showOnlyAvailable}/>;
        });
        return (
      <div className="site-table-container container-fluid">
        <table className="site-table">
          <TableHeader dates={this.props.dates}/>
          <tbody>
          {siteRows}
          </tbody>
        </table>
      </div>
        );
    }
}

CampSiteTable.propTypes = {
    dates: React.PropTypes.object.isRequired,
    campSiteData: React.PropTypes.object.isRequired
};