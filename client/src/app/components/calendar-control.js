import React from 'react';

export default class CalendarControl extends React.Component {
    render() {
        return (
            <div className="calendar-control">
                <img className="cal-back-arrow cal-arrows" src="kuba_arrow_back.png" onClick={this.props.decrementWeekOffset}/>
                <div className="cal-control-text">Move calendar</div>
                <img className="cal-forward-arrow cal-arrows" src="kuba_arrow_forward.png" onClick={this.props.incrementWeekOffset}/>
            </div>
        );
    }
}

CalendarControl.propTypes = {
    incrementWeekOffset: React.PropTypes.func.isRequired,
    decrementWeekOffset: React.PropTypes.func.isRequired
};