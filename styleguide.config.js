const path = require('path');
const webpackConfig = require('./webpack.dev.config.js');

module.exports = {
    title: 'Documentation',
    webpackConfig,
    getExampleFilename(componentPath) {
        const filename = path.basename(componentPath).replace(/\.js?$/, '.md');
        return `${__dirname}/docs/samples/${filename}`;
    },
    sections: [
        {
            name: 'Documentation',
            content: 'README.md',
        },
        {
            name: 'Components',
            components: 'src/components/**/*.js',
        },
    ],
    ribbon: {
        url: 'https://github.com/RubenAgDev/react-d3-charts.git',
        text: 'Clone me on GitHub',
    },
    skipComponentsWithoutExample: false,
    styles: {
        Playground: {
            preview: {
                backgroundColor: '#EFEFEF'
            }
        }
    }
};
