import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const filterInput = css`
  margin: 1rem;
  width: 50%;
  display: inline-block;
`;

const formGroup = css`
  margin-bottom: -2px;
`;

const siteNameInput = css`
  margin-left: 0.5rem;
`;

const FilterInput = ({ filterText, filterTextFt }) => {
  const _onFilterTextChange = (e) => {
    filterTextFt(e.target.value);
  };

  const inputProps = {
    type: 'text',
    placeholder: 'type to filter',
    value: filterText,
    css: siteNameInput,
    onChange: _onFilterTextChange.bind(this),
  };
  return (
    <div css={filterInput}>
      <div css={formGroup}>
        <label htmlFor="formControlsText">Filter By Site Name</label>
        <input  {...inputProps} />
      </div>
    </div>
  );
};

export default FilterInput;

