/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			accentColor: {
				DEFAULT: "#4F46E5",
				light: "#A78BFA",
				dark: "#4338CA",
			},
			colors: {
				// background colors
				level1: "#F0F1F0",
				level2: "#FEFFFE",
				level3: "#F7F7F6",
				// text colors
				primary: "#F73D93",
				primaryText: "#000101",
				secondaryText: "#808181",
			},
			fontFamily: {
				sans: ["Figtree", "sans-serif"],
			},
			fontSize: {
				xs: ["0.75rem", { lineHeight: "1rem" }],
				sm: ["0.875rem", { lineHeight: "1.25rem" }],
				base: ["1rem", { lineHeight: "1.5rem" }],
				lg: ["1.125rem", { lineHeight: "1.75rem" }],
				xl: ["1.25rem", { lineHeight: "1.75rem" }],
				"2xl": ["1.5rem", { lineHeight: "2rem" }],
				"3xl": ["1.875rem", { lineHeight: "2.25rem" }],
				"4xl": ["2.25rem", { lineHeight: "2.5rem" }],
			},
			spacing: {
				"1/2": "50%",
				"1/3": "33.333%",
				"2/3": "66.666%",
				"1/4": "25%",
				"3/4": "75%",
			},
			borderRadius: {
				sm: "0.125rem",
				md: "0.375rem",
				lg: "0.5rem",
				xl: "0.75rem",
				"2xl": "1rem",
				full: "9999px",
			},
			boxShadow: {
				sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
				md: "0 4px 6px rgba(0, 0, 0, 0.1)",
				lg: "0 10px 15px rgba(0, 0, 0, 0.15)",
				xl: "0 20px 25px rgba(0, 0, 0, 0.2)",
				"2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
			},
			transitionProperty: {
				colors: "background-color, border-color, color, fill, stroke",
				opacity: "opacity",
				transform: "transform",
				all: "all",
			},
			transitionDuration: {
				short: "150ms",
				DEFAULT: "300ms",
				long: "500ms",
			},
			transitionTimingFunction: {
				ease: "ease",
				linear: "linear",
				in: "cubic-bezier(0.4, 0, 1, 1)",
				out: "cubic-bezier(0, 0, 0.2, 1)",
				"in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
			},
			transitionDelay: {
				short: "100ms",
				DEFAULT: "200ms",
				long: "400ms",
			},
			animation: {
				spin: "spin 1s linear infinite",
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				bounce: "bounce 1s infinite",
			},
			keyframes: {
				spin: {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(360deg)" },
				},
				pulse: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				bounce: {
					"0%, 100%": { transform: "translateY(-25%)" },
					"50%": { transform: "translateY(0)" },
				},
			},
		},
	},
	plugins: [],
};
