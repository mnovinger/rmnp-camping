import React from 'react';
import Calendar from 'react-calendar';
import Popover from 'mineral-ui/Popover';
import Button from 'mineral-ui/Button';
import IconDateRange from 'mineral-ui-icons/IconDateRange';

export default class CalendarPicker extends React.Component {
    render() {
        const calIcon = <IconDateRange />;
        return (
            <Popover content={<Calendar />}>
                <Button iconStart={calIcon}></Button>
            </Popover>
        );
    }
}
