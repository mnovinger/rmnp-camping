import React from 'react';

import Button from 'mineral-ui/Button';
import IconChevronRight from 'mineral-ui-icons/IconChevronRight';
import IconChevronLeft from 'mineral-ui-icons/IconChevronLeft';
import './styles/calendar-control.css';
import CalendarModal from './calendar-picker';

export default class CalendarControl extends React.Component {
    render() {
        const startIcon = <IconChevronLeft/>;
        const endIcon = <IconChevronRight/>;
        return (
            <div className="calendar-control">
                <span className="offset">
                    <div className="cal-control-text">Calendar Controls</div>
                    <Button iconStart={startIcon} onClick={this.props.decrementWeekOffset}
                            disabled={this.props.weekOffset == 0}></Button>
                    <Button iconEnd={endIcon} onClick={this.props.incrementWeekOffset}></Button>
                </span>
                <span className="picker">
                    <CalendarModal/>
                </span>
            </div>
        );
    }
}

CalendarControl.propTypes = {
    incrementWeekOffset: React.PropTypes.func.isRequired,
    decrementWeekOffset: React.PropTypes.func.isRequired
};