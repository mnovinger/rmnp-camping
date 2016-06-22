import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchSiteData} from './actions/campsite-actions';


class ViewerApp extends Component {

    componentDidMount() {
        this.props.fetchSiteData();
    }

    render() {
        return (<div>hello.</div>)
    }
}

function mapStateToProps(state) {
    return {
        state: state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchSiteData: () => dispatch(fetchSiteData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerApp);