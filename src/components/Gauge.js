import React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc, line as d3Line, curveMonotoneX as d3CurveMonotoneX } from 'd3-shape';
import { easeQuadInOut as d3EaseQuadInOut } from 'd3-ease';
import { format as d3Format } from 'd3-format';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { interpolateHsl as d3InterpolateHsl } from 'd3-interpolate';
import { rgb as d3Rgb } from 'd3-color';
// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition'; // Required to decorate D3 elements with transition, although is not used explicity

import '../assets/css/Gauge.css';

const DEFAULT_CONFIG = {
    arcInset: 20,
    pointerWidth: 10,
    pointerTailLength: 5,
    pointerHeadLengthPercent: 0.9,
    minAngle: -70,
    maxAngle: 70,
    labelInset: 10,
};

const deg2Rad = (deg) => {
    return deg * (Math.PI / 180);
};

const heatMapColorFinder = (startColor = '#e82609', endColor = '#7ffa5d') => {
    return d3InterpolateHsl(d3Rgb(startColor), d3Rgb(endColor));
};

/**
 * Visualize a any numeric value as a Gauge chart. 
 */
class Gauge extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.d3Refs = {
            powerGauge: null,
            pointer: null,
            arc: null,
        };
    }

    componentDidMount() {
        // before rendering remove the existing gauge?
        d3Select(this.gaugeDiv)
            .select('svg')
            .remove();
        
        this.getGauge(this.gaugeDiv);
    }

    getGauge(container) {
        const config = Object.assign({}, DEFAULT_CONFIG, this.props);
        
        const arcWidth = config.width / 5;
        const range = config.maxAngle - config.minAngle;
        const r = config.width / 2;
        const pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);
        
        // a linear scale that maps domain values to a percent from 0..1
        const scale = d3ScaleLinear()
            .range([0, 1])
            .domain([config.minValue, config.maxValue]);

        const ratio = scale(config.value);
        
        const svg = d3Select( container )
            .append('svg:svg')
            .attr('width', config.width)
            .attr('height', config.height);

        const centerTx = `translate(${r}, ${r})`;

        const arcs = svg.append('g')
            .attr('class', 'arcs-container')
            .attr('transform', centerTx);

        if (config.showHeatMapColors) {
            config.segments = 9;
        }

        if (config.colorSegments || config.segments > 0) {
            const noTicks = config.segments || config.colorSegments.length;
            const tickData = [];
            for (let i = 0; i < noTicks; i++) {
                tickData[i] = 1 / noTicks;
            }
            const arcColorFinder = heatMapColorFinder(config.startColor, config.endColor);
            const tickArc = d3Arc()
                .innerRadius(r - arcWidth - config.arcInset)
                .outerRadius(r - config.arcInset)
                .startAngle((d, i) => {
                    const ratio = d * i;
                    return deg2Rad(config.minAngle + (ratio * range));
                })
                .endAngle((d, i) => {
                    const ratio = d * (i + 1);
                    return deg2Rad(config.minAngle + (ratio * range));
                });
            
            arcs.selectAll('path')
                .data(tickData)
                .enter()
                .append('path')
                .attr('fill', (d, i) => {
                    if (config.colorSegments) {
                        return config.colorSegments[i];
                    }

                    return arcColorFinder(d * i);
                })
                .attr('d', tickArc);
        } else {
            // Draws the whole arc of the gauge
            arcs.append('path')
                .attr('class', 'gauge-arc')
                .attr('d', d3Arc()
                    .innerRadius(r - arcWidth - config.arcInset)
                    .outerRadius(r - config.arcInset)
                    .startAngle(deg2Rad(config.minAngle + (ratio * range)))
                    .endAngle(deg2Rad(config.maxAngle))
                );
            
            // Drawing the filled segment in the gauge
            this.d3Refs.arc = arcs.append('path')
                .attr('class', 'gauge-segment')
                .attr('data-amber-chart-value', `${config.value}`)
                .attr('d', d3Arc()
                    .innerRadius(r - arcWidth - config.arcInset)
                    .outerRadius(r - config.arcInset)
                    .startAngle(deg2Rad(config.minAngle))
                    .endAngle(deg2Rad(config.minAngle + (ratio * range)))
                );
        }
        
        const lineData = [
            [config.pointerWidth / 2, 0],
            [0, -pointerHeadLength],
            [-(config.pointerWidth / 2), 0],
            [0, config.pointerTailLength],
            [config.pointerWidth / 2, 0]
        ];

        const pg = svg.append('g').data([lineData])
            .attr('class', 'gauge-pointer')
            .attr('transform', centerTx);

        
        const pointerAngle = (config.minAngle + (ratio * range));
        this.d3Refs.pointer = pg.append('path')
            .attr('d', d3Line().curve(d3CurveMonotoneX))
            .attr('transform', `rotate(${config.pointerTransition ? config.minAngle : pointerAngle})`);

        // Update with the actual value. Shows the animation from 0 to props.value
        if (config.pointerTransition) {
            this.d3Refs.pointer.transition()
                .duration(1500)
                .ease(d3EaseQuadInOut)
                .attr('transform', `rotate(${pointerAngle})`);
        }
    }

    render() {
        let { value } = this.props;

        if (this.props.valueFormat) {
            value = this.props.valueFormat === '%' ? `${value}%` : d3Format(this.props.valueFormat)(value);
        }

        return (
            <div className='amber-gauge'>
                { this.props.heading }
                <div className='amber-gauge-data'>
                    <span className='amber-gauge-value'>{value}</span>{this.props.differential && <span className={`amber-gauge-differential${this.props.differential.startsWith('-') ? '-red' : '-green'}`}>{this.props.differential}</span>}
                </div>
                <div ref={(el) => this.gaugeDiv = el} />
                <div className='amber-gauge-footer' style={{ marginTop: `-${this.props.height / 2.5}px` }}>
                    { this.props.footer }
                </div>
            </div>
        );
    }
}

Gauge.propTypes = {
    /** Array of colors that will be displayed as segments in the gauge */
    colorSegments: PropTypes.arrayOf(PropTypes.string),
    /** Represents and increment or decrement to the current value in comparison with a previous value */
    differential: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Footer of the gauge */
    footer: PropTypes.node,
    /** Heading of the gauge */
    heading: PropTypes.node,
    /** Min value of the guage arc */
    minValue: PropTypes.number,
    /** Max value of the gauge arc */
    maxValue: PropTypes.number,
    /** Width of the SVG clip */
    width: PropTypes.number,
    /** Height of the SVG clip */
    height: PropTypes.number,
    /** Indicates whether the pointer must transition using animation */
    pointerTransition: PropTypes.bool,
    /** Divides the arc of the gauge in an specific number segments. This prop overrides the colorSegments prop */
    segments: PropTypes.number,
    /** Indicates whether the colors in the arc must be the colors of a heat map, i.e. interpolates red to green */
    showHeatMapColors: PropTypes.bool,
    /** Start color of the arcs of the gauge if a number of segments is provided */
    startColor: PropTypes.string,
    /** End color of the arcs of the gauge if a number of segments is provided */
    endColor: PropTypes.string,
    /** Value for the gauge chart, between min and max values */
    value: PropTypes.number,
    /** Specified the format of the value if needed. See more: https://github.com/d3/d3-format */
    valueFormat: PropTypes.string,
};

// define the default proptypes
Gauge.defaultProps = {
    minValue: 0,
    maxValue: 100,
    width: 300,
    height: 300,
    pointerTransition: true,
    segments: 0,
    showHeatMapColors: false,
    value: 0,
    valueFormat: '',
};

export default Gauge;
