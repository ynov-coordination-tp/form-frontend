/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['Inter', 'system-ui', 'sans-serif'],
				cinzel: ['Cinzel', 'serif']
			}
		}
	},
	plugins: []
};
