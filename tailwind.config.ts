import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./auth/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		'font-inter',
		'font-roboto',
		'font-adieu',
		'font-josefin-sans'
	],
	theme: {
		extend: {
			colors: {
				'profile-background': 'rgba(234, 238, 242, 1)',
				'sugar': 'rgba(252, 251, 249, 1)',
				'sugar-dogsup': 'rgba(252, 251, 249, 1)',
				'midnight-dogsup': 'rgba(16, 15, 31, 1)',
				'midnight': 'rgba(16, 15, 31, 1)',
				'violet-dogsup': 'rgba(200, 169, 239, 1)',
				'violet': 'rgba(200, 169, 239, 1)',
				'virgot-dogsup': 'rgba(250, 133, 196, 1)',
				'virgot': 'rgba(250, 133, 196, 1)',
				'oxford-dogsup': '#343254',
				'oxford': '#343254',
			},
			fontSize: {
				'xs': '.75rem',
				'sm': '.875rem',
				'tiny': '.875rem',
				'base': '1rem',
				'lg': '1.125rem',
				'xl': '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.875rem',
				'4xl': '2.25rem',
				'5xl': '3rem',
				'6xl': '4rem',
				'7xl': '5rem',
			},
		},
	},
	
	plugins: [],
};
export default config;
