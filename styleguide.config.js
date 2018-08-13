const path = require('path');
const webpackConfig = require('./webpack.dev.config.js');

module.exports = {
    assetsDir: `${__dirname}/docs/static/`,
    title: 'Documentation',
    webpackConfig,
    getExampleFilename(componentPath) {
        const filename = path.basename(componentPath).replace(/\.jsx?$/, '.md');
        return `${__dirname}/docs/samples/${filename}`;
    },
    sections: [
        {
            name: 'Introduction',
            content: 'README.md',
        },
        {
            name: 'Components',
            components: 'src/components/**/*.jsx',
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
