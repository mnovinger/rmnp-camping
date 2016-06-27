import React from 'react';
import moment from 'moment';

export default class CampSiteTable extends React.Component {

    render() {
        const dates = this.props.dates.map((date) => {
            return (<th key={date} className="status-col">{moment(date).format('MM/DD')}</th>);
        });

        var statusKey = 0;
        const rows = this.props.campSiteData.map((campsite) => {
            statusKey++;
            const statuses = this.props.dates.map((date) => {
                statusKey++;
                var campStatuses = campsite.get('status');
                const status = campStatuses.find((status) => {
                    return status.get('date') == date;
                });
                return (<td key={statusKey} className="status-col">{status ? status.get('status') : 'N/A'}</td>)
            });
            return (
                <tr key={statusKey} >
                    <td className="site-col">{campsite.get('name') + '(' + campsite.get('id') + ')'}</td>
                    {statuses}
                </tr>
            );
        });
        // this.props.dates.entries()
        return (
            <div className="site-table-container">
                <table className="site-table">
                    <thead>
                    <tr>
                        <th className="site-col">Site</th>
                        {dates.toJS()}</tr>
                    </thead>
                    <tbody>
                    {rows}
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