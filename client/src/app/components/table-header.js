import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class TableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        const dateCells = this.props.dates.map((date) => {
            return (<th key={date.format('MMDD')} className="status-col">{date.format('ddd MM/DD')}</th>);
        });

        return (<thead>
        <tr>
            <th className="site-col">Site</th>
            { dateCells }
        </tr>
        </thead>);
    }
}

TableHeader.propTypes = {
    dates: React.PropTypes.object.isRequired
};