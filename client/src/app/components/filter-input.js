import React, {Component} from 'react';

export default class FilterInput extends Component {
    _onFilterTextChange(e) {
        this.props.filterTextFt(e.target.value);
    }

    render() {
        const inputProps = {
            type: "text",
            placeholder: "site name.",
            value: this.props.filterText,
            className: "form-control",
            onChange: this._onFilterTextChange.bind(this),
            onKeyPress: this._preventEnterSubmission,
        }
        return (
            <div className="filter-input">
                <div class="form-group">
                    <label for="formControlsText" class="control-label">Type to Filter</label>
                    <input  { ...inputProps } />
                </div>
            </div>
        );
    }
};

FilterInput.propTypes = {
    filterTextFt: React.PropTypes.func.isRequired,
    filterText: React.PropTypes.string
};

