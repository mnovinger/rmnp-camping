import React from 'react';
import { campSiteReducer, initialState, getWeekOffset } from '../../../src/app/reducers/campsite-reducer';
import { decrementWeekOffset, incrementWeekOffset } from '../../../src/app/actions/campsite-actions';

describe('The camp site reducer', () => {
  it('should increment the week offset', () => {
    const initialOffset = initialState.get('weekOffset');
    const newState = campSiteReducer(initialState, incrementWeekOffset());
    expect(newState.get('weekOffset')).toBe(initialOffset + 1);
  });

  it('should increment twice correctly', () => {
    const initialOffset = initialState.get('weekOffset');
    const newState = campSiteReducer(campSiteReducer(initialState, incrementWeekOffset()), incrementWeekOffset());
    expect(newState.get('weekOffset')).toBe(initialOffset + 2);
  });

  it('should increment and decrement correctly', () => {
    const initialOffset = initialState.get('weekOffset');
    const newState = campSiteReducer(campSiteReducer(initialState, incrementWeekOffset()), decrementWeekOffset());
    expect(newState.get('weekOffset')).toBe(initialOffset);
  });

  it('should not decrement past zero', () => {
    const newState = campSiteReducer(initialState, decrementWeekOffset());
    expect(newState.get('weekOffset')).toBe(0);
  })
});