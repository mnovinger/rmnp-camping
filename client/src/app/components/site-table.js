import React from 'react';
import TableHeader from './table-header';
import TableRow from './table-row'
export default class CampSiteTable extends React.Component {

    render() {

        var siteRows = this.props.campSiteData.map((campsite, idx) => {
            return <TableRow key={idx} campSite={campsite}/>
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