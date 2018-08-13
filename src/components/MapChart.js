import React from 'react';
import Chart from './Chart';
import * as d3 from 'd3';
import WorldCountries from '../rsc/world_countries.js';
import * as topojson from 'topojson';
import PropTypes from 'prop-types';

const MapChart = (props) => {
    // Formating the value in the chart using D3
    const valueFormat = d3.format(props.valueFormat);

    // Number of 'ticks' for colors
    const ticks = props.ticks || 6;

    // Max value in the domain
    const maxValue = d3.max(props.data, props.valueAccessor);

    // Min value in the domain
    const minValue = d3.min(props.data, props.valueAccessor);

    // Tick size calculation
    const tickSize = (maxValue - minValue) / ticks;

    // Returns the index for color based on the 'tick', 0 based
    const getTickIndex = (value) => {
        let index = -1;
        if(value) {
            if(value > tickSize) {
                index = Math.floor(value / tickSize) - 1;
            } else {
                index = 0;
            }
        }

        return index;
    };

    const handleMouseMove = (e) => {
        let tooltipContent = `${e.target.getAttribute('title')}: ${valueFormat(e.target.getAttribute('data-chart-value'))}`;
        props.showTooltip(tooltipContent, e.clientY, e.clientX);
    }

    const handleMouseOut = (e) => {
        props.hideTooltip();
    }

    // Returns a function that can render the actual map using a GeoJSON
    const path = () => {
        return d3.geoPath()
            .projection(d3.geoMercator()
            .scale((props.width + 1) / 2 / Math.PI)
            .translate([props.width / 2, props.height / 2]) // Centers the map in the container
            .precision(.1));
    }

    // Renders the countries of the world
    const countries = () => {
        let features= topojson.feature(WorldCountries, WorldCountries.objects.countries).features;
        return (
            <g className='m-c-countries'>{features.map((d) =>
                    <path 
                        d={path()(d)}
                        data-chart-value={props.accessor(props.data, d.properties.cc)}
                        data-chart-index={getTickIndex(props.accessor(props.data, d.properties.cc))}
                        id={d.id}
                        key={d.id}
                        title={d.properties.name}
                        onMouseMove={handleMouseMove}
                        onMouseOut={handleMouseOut} />)
                }
            </g>
        );
    }

    return (
        <g className='map-chart'>
            <rect 
                className='m-c-background'
                fill='white'
                width={props.width} 
                height={props.height} />
            <g>
                { countries() }
                <path className='m-c-countries-borders'
                    fill='none'
                    strokeWidth='1px'
                    d={path()(topojson.mesh(WorldCountries, WorldCountries.objects.countries, (a, b) => { return a !== b; }))} />
            </g>
        </g>
    );
}

MapChart.displayName = 'MapChart';

MapChart.propTypes = {
    accessor: PropTypes.func.isRequired,
    data: PropTypes.any.isRequired,
    ticks: PropTypes.number,
    valueAccessor: PropTypes.func.isRequired,
    valueFormat: PropTypes.string.isRequired
}

export default Chart(MapChart);
