module.exports = () => ({
    plugins: [
        require('postcss-nested'),
        require('postcss-mixins'),
        require('postcss-custom-media'),
    ],
});