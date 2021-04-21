const path = require('path');


module.exports = {
	entry: './src/containers/app',
	mode: 'production',
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public/js/'),
		publicPath: path.resolve(__dirname, 'public/js/'),
		clean: true
	},
	watch: false,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env'],
							['@babel/preset-react']
						],
						plugins: [
							'@babel/transform-runtime',
						]
					}
				}
			}
		]
	}
}
