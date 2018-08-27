import React from 'react';
import PropTypes from 'prop-types';
import { scaleLinear as d3ScaleLinear, scaleBand as d3ScaleBand } from 'd3-scale';
import { format as d3Format } from 'd3-format';
import Axis from './Axis';
import '../rsc/hbarchart.css';

/**
 * Visualize any data in an Horizontal Bar Chart with the tags on the left and values on the right.
 * <br />
 * The bars are group using "data-" HTML attributes to style them by value ranges or index ranges, i.e:
 * - data-chart-index={index}
 * - data-chart-value={value}
 * <br />
 * <br />
 * CSS selectors can be created using those attributes.
 */
function HBarChart(props) {
    const scaleWidth = props.width - props.padding.left - props.padding.right;
    const scaleHeight = props.height - props.padding.top - props.padding.bottom;

    const valueFormat = d3Format(props.valueFormat);

    const xScale = d3ScaleLinear()
        .domain([props.minValue, props.maxValue])
        .range([0, scaleWidth]);

    const yScale = d3ScaleBand()
        .rangeRound([0, scaleHeight])
        .domain(props.data.map(props.tagAccessor))
        .padding(props.barPadding);

    // Height of the bars in the chart
    const barHeight = yScale.bandwidth();
    
    return (
        <svg className='hbar-chart' width={props.width} height={props.height}>
            <g transform={`translate(${props.padding.left}, ${props.padding.top})`}>
                { props.data.map((d, index) => {
                    const value = props.valueAccessor(d);
                    const yCoord = yScale(props.tagAccessor(d));
                    const barWidth = xScale(value);
                    
                    return (
                        <g 
                            data-chart-index={index}
                            data-chart-value={value}
                            key={index}>
                            <rect
                                height={barHeight}
                                width={barWidth}
                                x={0}
                                y={yCoord} />
                            <text
                                x={barWidth + 3}
                                y={yCoord + (barHeight / 2) + 4}>
                                {props.valueFormat ? valueFormat(value) : value}
                            </text>
                        </g>
                    );
                })}
                <Axis
                    orient='left'
                    scale={yScale}
                    tickSize={0} />
            </g>
        </svg>
    );
}

HBarChart.propTypes = {
    /** Padding between the bars */
    barPadding: PropTypes.number,
    /** Data for the chart */
    data: PropTypes.array.isRequired,
    /** Height of the chart. */
    height: PropTypes.number.isRequired,
    /** Max value for the bar. By default is 100 which represents 100% */
    maxValue: PropTypes.number,
    /** Min value for the bar. By default starts from 0 */
    minValue: PropTypes.number,
    /** Padding of the SVG. The Tags on the y-axis occupy the left padding and the values of the bars occupy the right padding */
    padding: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number
    }),
    /** Function that provides access to the tags in data */
    tagAccessor: PropTypes.func.isRequired,
    /** Function that provides access to the values in data */
    valueAccessor: PropTypes.func.isRequired,
    /** Specified the format of the value if needed. See more: https://github.com/d3/d3-format */
    valueFormat: PropTypes.string,
    /** Width of the chart. */
    width: PropTypes.number.isRequired
};

HBarChart.defaultProps = {
    barPadding: 0.3,
    padding: {
        top: 0,
        right: 30,
        bottom: 0,
        left: 100,
    },
    maxValue: 100,
    minValue: 0,
    showHeatMapColors: false,
    valueFormat: '',
};

export default HBarChart;
