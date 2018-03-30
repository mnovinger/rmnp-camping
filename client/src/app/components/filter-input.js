import React, { Component } from 'react';
import './styles/filter-input.css';
import { FormField } from 'mineral-ui/Form';
import TextInput from 'mineral-ui/TextInput';


export default class FilterInput extends Component {
    _onFilterTextChange(e) {
        this.props.filterTextFt(e.target.value);
    }

    render() {
        const inputProps = {
            value: this.props.filterText,
            onChange: this._onFilterTextChange.bind(this),
            label: 'Site Name'
        };
        return (
            <div className="filter-input">
                <div className="form-group">
                    <FormField input={TextInput} { ... inputProps } />
                </div>
            </div>
        );
    }
}

FilterInput.propTypes = {
    filterTextFt: React.PropTypes.func.isRequired,
    filterText: React.PropTypes.string
};

