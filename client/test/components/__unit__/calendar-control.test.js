import renderer from 'react-test-renderer';
import CalendarControl from '../../../src/app/components/calendar-control';
import React from 'react';

describe('The CalendarControl Component', () => {
  it('should render correctly', () => {
    const props = {
      incrementWeekOffset: () => {},
      decrementWeekOffset: () => {}
    }

    const tree = renderer.create(< CalendarControl { ...props }/>).toJSON();
    expect(tree).toMatchSnapshot();
  });

});