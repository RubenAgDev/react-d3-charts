import React from 'react';
import styles from '../rsc/chart.css';
import PropTypes from 'prop-types';

const getDisplayName = (WrappedChart) => {
  return WrappedChart.displayName || WrappedChart.name || 'Component';
};

/**
 * HOC to build other charts
 */
export default (WrappedChart) => {
    class Chart extends React.Component {
        constructor(props) {
            super(props);

            this.showTooltip = this.showTooltip.bind(this);
            this.hideTooltip = this.hideTooltip.bind(this);
            this.saveTooltipRef = this.saveTooltipRef.bind(this);
        }
        /**
         * Displays a tooltip with the content and at the indicated position
         * content: content of the tooltip
         * top: left upper corner position
         * left: left upper corner position
         */
        showTooltip(content, top, left) {
            this.tooltip.innerHTML = content;
            this.tooltip.style.left = `${left + 10}px`;
            this.tooltip.style.top = `${top + 10}px`;
            this.tooltip.style.display = 'block';
        }

        hideTooltip() {
            this.tooltip.style.display = 'none';
        }

        saveTooltipRef(div) {
            this.tooltip = div;
        }

        render() {
            let svgMargin = this.props.margin || {top: 0, right: 0, bottom: 0, left: 0};  
            let svgWidth = this.props.width + svgMargin.left + svgMargin.right;
            let svgHeight = this.props.height + svgMargin.top + svgMargin.bottom;
            return (
                <div className="chart">
                    <div className="c-svg-container">
                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            preserveAspectRatio="xMinYMin meet">
                            <g transform={`translate(${svgMargin.left}, ${svgMargin.top})`}>
                                <WrappedChart 
                                    showTooltip={this.showTooltip}
                                    hideTooltip={this.hideTooltip}
                                    {...this.props} />
                            </g>
                        </svg>
                    </div>
                    <div 
                        className="c-tooltip" 
                        ref={this.saveTooltipRef} 
                        style={styles.tooltip}>
                    </div>
                </div>
            );
        }
    }

    Chart.displayName = `Chart(${getDisplayName(WrappedChart)})`;

    Chart.propTypes = {
        height: PropTypes.number.isRequired,
        margin: PropTypes.object,
        width: PropTypes.number.isRequired
    };

    return Chart;
};
