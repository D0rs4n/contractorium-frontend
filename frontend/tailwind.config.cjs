/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				darkGrey: '#393939',
				darkBlue: '#5890f2',
				navbarBg: '#202225',
				lightNavBar: '#303235',
				cardBg: '#333333',
				verified: '#578EF8'
			},
			fontFamily: {
				lato: ['Poppins', 'sans-serif']
			}
		}
	},
	plugins: []
};
