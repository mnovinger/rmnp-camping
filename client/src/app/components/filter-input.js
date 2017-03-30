import React, {Component} from 'react';
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap';

export default class FilterInput extends Component {

    static _preventEnterSubmission(e) {
        if (e.key == 'Enter' || e.charCode == 13)
            e.preventDefault()
    }

    _onFilterTextChange(e) {
        this.props.filterTextFt(e.target.value);
    }

    render() {

        return (
            <div className="filter-input">
                <form>
                    <FormGroup controlId="formControlsText">
                        <ControlLabel>Type to Filter</ControlLabel>
                        <FormControl type='text' ref="filterText" placeholder="site name."
                                     onChange={this._onFilterTextChange.bind(this)} value={this.props.filterText}
                                     wrapperClassName='col-sm-4 inputhack'
                                     onKeyPress={this._preventEnterSubmission}>

                        </FormControl>
                    </FormGroup>
                </form>
            </div>
        );
    }
};

FilterInput.propTypes = {
    filterTextFt: React.PropTypes.func.isRequired,
    filterText: React.PropTypes.string
};

