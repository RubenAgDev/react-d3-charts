import * as d3Axis from 'd3-axis';
import * as d3Selection from 'd3-selection';
import React from 'react';
import PropTypes from 'prop-types';

class Axis extends React.Component {
    componentDidMount() {
        this.renderAxis();
    }

    componentDidUpdate() {
        this.renderAxis();
    }

    renderAxis() {
        let axis = null;
        const tickFormat = this.props.tickFormat || null;
        switch (this.props.orient) {
            case 'top':
                axis = d3Axis.axisTop(this.props.scale)
                    .tickFormat(tickFormat)
                    .tickSize(this.props.tickSize);
                break;
            case 'bottom':
                axis = d3Axis.axisBottom(this.props.scale)
                    .tickFormat(tickFormat)
                    .tickSize(this.props.tickSize);
                break;
            case 'left':
                axis = d3Axis.axisLeft(this.props.scale)
                    .tickFormat(tickFormat)
                    .tickSize(this.props.tickSize);
                break;
            case 'right':
                axis = d3Axis.axisRight(this.props.scale)
                    .tickFormat(tickFormat)
                    .tickSize(this.props.tickSize);
                break;
        }

        if(axis) {
            d3Selection.select(this.axis).call(axis);
        }
    }

    render() {
        let translate = `translate${this.props.translate || "(0, 0)"}`;
        return <g 
            className={this.props.className}
            ref={(gElem) => { this.axis = gElem; }}
            transform={translate} >
        </g>
    }
}

Axis.propTypes = {
    className: PropTypes.string.isRequired,
    orient: PropTypes.string.isRequired,
    scale: PropTypes.func.isRequired,
    tickFormat: PropTypes.func,
    tickSize: PropTypes.number.isRequired,
    translate: PropTypes.string
};

export default Axis;
