import * as d3 from 'd3';
import Chart from './chart';
import React from 'react';

const HBar = (props) => {
    //Relative to the width of the SVG, sets the range of the scale:
    const minRangeValue = props.width * 0.20;
    const maxRangeValue = props.width * 0.65;

    //Relative to the data of the chart, sets the domain of the scale:
    //The max domain value is always the max value in the data plus a percentage
    const minDomainValue = 0;
    const maxDomainValue = d3.max(props.data, props.valueAccessor) * 1.1;
    
    //Setting the vertical arrangement
    //if a height for the bars is not provided,
    //it will be calculated according to the number of items in data
    const rowHeight = props.height / props.data.length;
    const barHeight = props.barHeight || (rowHeight - 1);
    const verticalAlignment = barHeight / 2;

    //d3 scales for the chart    
    const scale = d3.scaleLinear()
            .domain([minDomainValue, maxDomainValue])
            .range([minRangeValue, maxRangeValue]);

    const valueFormat = d3.format(props.valueFormat);

    return (
        <g className="h-bar-chart">
            { props.data.map((d, index) => {
                return <g 
                        data-chart-index={index}
                        key={index}
                        transform={`translate(0, ${index * rowHeight})`}>
                        <text
                            className="h-b-c-tag"
                            textAnchor="start"
                            x={0}
                            y={verticalAlignment}>
                            {props.tagAccessor(d)}
                        </text>
                        <line
                            className="h-b-c-ref-line"
                            x1={scale(minDomainValue)}
                            x2={scale(minDomainValue) + scale(maxDomainValue)}
                            y1={verticalAlignment}
                            y2={verticalAlignment} />
                        <rect
                            className="h-b-c-bar"
                            height={barHeight}
                            width={scale(props.valueAccessor(d))}
                            x={scale(minDomainValue)} />
                        <text
                            className="h-b-c-value"
                            textAnchor="end"
                            x={props.width}
                            y={verticalAlignment}>
                            {valueFormat(props.valueAccessor(d))}
                        </text>
                    </g>
                })
            }
        </g>
    );
};

var HBarChart = Chart(HBar);

HBarChart.displayName = 'HBarChart';

HBarChart.propTypes = {
    barHeight: React.PropTypes.number,
    tagAccessor: React.PropTypes.func.isRequired,
    valueAccessor: React.PropTypes.func.isRequired,
    valueFormat: React.PropTypes.string.isRequired
}

export default HBarChart;