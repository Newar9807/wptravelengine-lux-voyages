const path = require('path');
const config = require('@wordpress/scripts/config/webpack.config');

module.exports = (env, argv) => {
    return {
        ...config,
        mode: 'development',
        entry: {
            public: [
                './src/public/js/index.js',
                './src/public/sass/index.scss'
            ],
            admin: './src/admin/js/index.js',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        externals: {
            '@wptravelengine/public/fragments': 'window.wptravelengine.publicFragments',
        },
    }
}
