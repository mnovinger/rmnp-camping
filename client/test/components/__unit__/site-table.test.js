import React from 'react';
import renderer from 'react-test-renderer';
import Immutable from 'immutable';
import moment from 'moment';
import SiteTable from '../../../src/app/components/site-table';

describe('The Site Table Component', () => {
  it('should render correctly with site data', () => {
    const props = {
      dates: Immutable.fromJS([moment(), moment().add(1, 'days')]),
      campSiteData: Immutable.fromJS(
        [{
          name: "Boundary Waters",
          id: "001",
          availability : [{
            status: "1"
          }]
        },{
          name: "Olympic",
          id: "002",
          availability: [{
            status: "NA"
          }]
        }
        ]),
    };

    const tree = renderer.create(<SiteTable { ...props }/>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly without site data', () => {
    const props = {
      dates: Immutable.fromJS([moment(), moment().add(1, 'days')]),
      campSiteData: Immutable.Map()
    };

    const tree = renderer.create(<SiteTable { ...props }/>).toJSON();
    expect(tree).toMatchSnapshot();
  })

});