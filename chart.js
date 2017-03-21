import React from 'react';
import styles from './chart.css';

const getDisplayName = (WrappedChart) => {
  return WrappedChart.displayName || WrappedChart.name || 'Component';
};

export default (WrappedChart) => {
    class Chart extends React.Component {
        /**
         * Displays a tooltip with the content and at the indicated position
         * content: content of the tooltip
         * top: left upper corner position
         * left: left upper corner position
         */
        showTooltip(content, top, left) {
            this.tooltip.innerHTML = content;
            this.tooltip.style.left = `${left}px`;
            this.tooltip.style.top = `${top}px`;
            this.tooltip.style.display = 'block';
        }

        hideTooltip() {
            this.tooltip.style.display = 'none';
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
                                    showTooltip={(a, b, c) => this.showTooltip(a, b, c)}
                                    hideTooltip={() => this.hideTooltip()}
                                    {...this.props} />
                            </g>
                        </svg>
                    </div>
                    <div 
                        className="c-tooltip" 
                        ref={(div) => { this.tooltip = div; }} 
                        style={styles.tooltip}>
                    </div>
                </div>
            );
        }
    }

    Chart.displayName = `Chart(${getDisplayName(WrappedChart)})`;

    Chart.propTypes = {
        data: React.PropTypes.any.isRequired,
        height: React.PropTypes.number.isRequired,
        margin: React.PropTypes.object,
        width: React.PropTypes.number.isRequired
    };

    return Chart;
};
