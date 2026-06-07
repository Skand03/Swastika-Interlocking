/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#fef9ee",
        "secondary-fixed-dim": "#88d982",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#217128",
        "surface-variant": "#e7e2d8",
        "tertiary": "#50604c",
        "surface-container-low": "#f9f3e9",
        "surface-container-high": "#ede8dd",
        "on-tertiary-fixed": "#101f0f",
        "on-primary-fixed-variant": "#793000",
        "tertiary-fixed": "#d5e8ce",
        "on-error": "#ffffff",
        "primary-container": "#c35200",
        "on-secondary-fixed": "#002204",
        "error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#3b4b38",
        "surface-bright": "#fef9ee",
        "secondary": "#1b6d24",
        "on-error-container": "#93000a",
        "surface-container": "#f3ede3",
        "error": "#ba1a1a",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#584237",
        "on-primary-fixed": "#341100",
        "primary-fixed": "#ffdbcb",
        "surface-tint": "#9f4200",
        "on-surface": "#1d1c16",
        "inverse-on-surface": "#f6f0e6",
        "primary": "#9b4000",
        "tertiary-container": "#687964",
        "tertiary-fixed-dim": "#b9ccb3",
        "on-background": "#1d1c16",
        "surface-dim": "#dfd9d0",
        "outline-variant": "#e0c0b1",
        "on-primary-container": "#fffbff",
        "outline": "#8c7165",
        "on-tertiary-container": "#f7fff1",
        "surface-container-highest": "#e7e2d8",
        "inverse-surface": "#32302a",
        "background": "#fef9ee",
        "inverse-primary": "#ffb692",
        "on-secondary-fixed-variant": "#005312",
        "secondary-container": "#a0f399",
        "primary-fixed-dim": "#ffb692",
        "on-tertiary": "#ffffff",
        "secondary-fixed": "#a3f69c",
        "on-primary": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "margin-mobile": "16px",
        "base": "8px",
        "gutter": "24px",
        "container-max": "1280px",
        "card-padding": "24px"
      },
      fontFamily: {
        "label-sm": ["Plus Jakarta Sans"],
        "display-lg-mobile": ["Montserrat"],
        "display-lg": ["Montserrat"],
        "body-lg": ["Plus Jakarta Sans"],
        "body-md": ["Plus Jakarta Sans"],
        "headline-md": ["Montserrat"]
      },
      fontSize: {
        "label-sm": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "display-lg-mobile": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "display-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["24px", {"lineHeight": "1.4", "fontWeight": "600"}]
      }
    }
  },
  plugins: [],
}
