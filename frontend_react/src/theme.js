// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      100: "#E3F2F9",
      200: "#C5E4F3",
      300: "#A2D4EC",
      400: "#7AC1E4",
      500: "#47A9DA",
      600: "#0088CC",
      700: "#007AB8",
      800: "#006BA1",
      900: "#005885",
    },
    brand: {
      100: "#f7fafc",
      900: "#1a202c",
    },
  },
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Open Sans', sans-serif",
    mono: "'Menlo', monospace"
  }
});
export default theme;

