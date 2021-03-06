import * as d3Scale from 'd3-scale';
import * as d3Format from 'd3-format';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import Axis from './Axis';
import Chart from './Chart';
import React from 'react';
import PropTypes from 'prop-types';

const RunChart = (props) => {
    const percentageFormat = d3Format.format('.0%');
    const upIcon = "<i class='fa fa-chevron-up' aria-hidden='true'></i>";
    const downIcon = "<i class='fa fa-chevron-down' aria-hidden='true'></i>";
    // Relative to the data of the chart, gets the max value plus a percentage
    const maxDomainValue = d3Array.max(props.data, props.valueAccessor) * 1.1;        

    // Scales for the chart
    const xScale = d3Scale.scaleTime()
            .domain([props.startDate, props.endDate])
            .range([0, props.width]);

    const yScale = d3Scale.scaleLinear()
            .domain([0, maxDomainValue])
            .range([props.height, 0]);
            
    const handleMouseMove = (event) => {
        let updown = event.target.getAttribute('data-chart-updown');
        let tooltipContent = updown > 0 ? 
            `${upIcon}${percentageFormat(updown)}` : 
            `${downIcon}${percentageFormat(updown * -1)}`;

        props.showTooltip(tooltipContent, event.clientY, event.clientX);
    };

    const handleMouseOut = (event) => {
        props.hideTooltip();
    };

    // Gets the increase|decrease percentage relative to the prev value
    const getUpDown = (d, i) => {
        let current = props.valueAccessor(d);
        let prev = props.data[i - 1] ? props.valueAccessor(props.data[i - 1]) : current;
        return ((current - prev) / prev);
    };

    // Gets the x coords from every data item
    const xAccessor = (d) => {
        return xScale(props.dateAccessor(d));
    };

    // Gets the y coords from every data item
    const yAccessor = (d) => { 
        return yScale(props.valueAccessor(d)); 
    };

    // Renders the x axis
    const xAxis = () => {
        return (
            <Axis
                className="r-c-x-axis"
                orient="bottom"
                scale={xScale}
                tickFormat={ d3TimeFormat.timeFormat(props.dateFormat) }
                tickSize={6}
                translate={`(0, ${props.height})`} />
        );
    };

    // Renders the y axis
    const yAxis = () => {
        return (
            <Axis
                className="r-c-y-axis"
                orient="left"
                scale={yScale}
                tickSize={props.width}
                translate={`(${props.width}, 0)`} />
        );
    };

    // Draws a line using d3
    const line = d3Shape.line()
        .x(xAccessor)
        .y(yAccessor);

    // Draws a point with x,y coords
    const dataPoints = () => {
        return (
            <g>
                { props.data.map((d, index) => {
                    return <circle
                        cx={xAccessor(d)}
                        cy={yAccessor(d)}
                        data-chart-index={index}
                        data-chart-updown={getUpDown(d, index)}
                        key={index}
                        onMouseMove={handleMouseMove}
                        onMouseOut={handleMouseOut}
                        r={3}
                        title={props.valueAccessor(d)} />
                    })
                }
            </g>
        );
    };

    return (
        <g className="run-chart">
            {xAxis()}
            {yAxis()}            
            <path
                d={line(props.data)}
                fill="none" />
             {dataPoints()}
        </g>
    );
};

RunChart.displayName = 'RunChart';

RunChart.propTypes = {
    data: PropTypes.any.isRequired,
    dateAccessor: PropTypes.func.isRequired,
    dateFormat: PropTypes.string.isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    startDate: PropTypes.any.isRequired,
    valueAccessor: PropTypes.func.isRequired
};

export default Chart(RunChart);
