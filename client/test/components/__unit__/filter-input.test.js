import renderer from 'react-test-renderer';
import React from 'react';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';

import FilterInput from '../../../src/app/components/filter-input';

describe('The CalendarControl Component', () => {
  it('should render correctly', () => {
    const props = {
      filterTextFt: () => {},
      filterText: "Some Text",
    };

    const tree = renderer.create(<FilterInput { ...props }/>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should invoke the callback when clicked', () => {
    var callback = sinon.spy();
    const props = {
      filterTextFt: callback,
      filterText: "Some Text",
    };

    const filterCmp = shallow(<FilterInput { ...props }/>);
    filterCmp.find("input").simulate('change', {target:{value: "a"}});
    expect(callback.called).toBe(true);
  })

});