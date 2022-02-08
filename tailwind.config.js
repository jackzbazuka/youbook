const colors = require('tailwindcss/colors')

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'glow-orange': '#FC431F',
				...colors,
			},
			scale: {
				102: '1.02',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
