import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const colors = {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },
  accent: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

const fonts = {
  body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
  heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
  mono: `"Fira Code", monospace`,
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode('#ffffff', '#1a202c')(props),
      color: mode('#1a202c', '#e2e8f0')(props),
      lineHeight: 'tall',
    },
    html: {
      scrollBehavior: 'smooth',
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: mode('#f1f1f1', '#2d3748')(props),
    },
    '::-webkit-scrollbar-thumb': {
      bg: mode('#888', '#4a5568')(props),
      borderRadius: '4px',
      '&:hover': {
        bg: mode('#555', '#718096')(props),
      },
    },
  }),
};

const components = {
  Button: {
    defaultProps: {
      colorScheme: 'brand',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'brand.700',
        },
        transition: 'all 0.3s ease',
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
      ghost: {
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: 'lg',
      boxShadow: 'sm',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      _hover: {
        boxShadow: 'md',
        transform: 'translateY(-4px)',
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'brand.500',
    },
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'gray.400',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px rgba(14, 165, 233, 0.2)`,
          },
          transition: 'all 0.2s ease',
        },
      },
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: 'brand.500',
    },
    variants: {
      outline: {
        borderColor: 'gray.300',
        _hover: {
          borderColor: 'gray.400',
        },
        _focus: {
          borderColor: 'brand.500',
          boxShadow: `0 0 0 1px rgba(14, 165, 233, 0.2)`,
        },
        transition: 'all 0.2s ease',
      },
    },
  },
  Modal: {
    baseStyle: {
      dialogContainer: {
        zIndex: 1200,
      },
      dialog: {
        borderRadius: 'xl',
        boxShadow: '2xl',
      },
    },
  },
  Tooltip: {
    baseStyle: {
      bg: 'gray.800',
      color: 'white',
      borderRadius: 'md',
      fontSize: 'sm',
    },
  },
  Accordion: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'gray.200',
      },
      button: {
        _hover: {
          bg: 'gray.50',
        },
      },
    },
  },
  Tabs: {
    variants: {
      line: {
        tablist: {
          borderBottomColor: 'gray.200',
        },
        tab: {
          _selected: {
            color: 'brand.500',
            borderBottomColor: 'brand.500',
          },
        },
      },
    },
  },
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  colors,
  fonts,
  styles,
  components,
  config,
  sizes: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  radii: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
  },
});

export default theme;
