import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        const site = this.props.campSite;
        const statuses = site.get('availability').map((status, idx) => {
            return <td key={idx} className="status-col">{status.get('status')}</td>;
        });
        return (
            <tr>
                <td className="site-col">{site.get('name') + ' (' + site.get('id') + ')'}</td>
                {statuses}
            </tr>
        );
    }
}

TableRow.propTypes = {
    campSite: React.PropTypes.object.isRequired
};
