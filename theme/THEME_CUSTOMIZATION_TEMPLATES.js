/**
 * THEME CUSTOMIZATION TEMPLATES
 * 
 * Copy and paste these templates to quickly customize your theme.
 * Edit the values and add them to your theme/chakra-theme.js file.
 */

// ============================================================================
// TEMPLATE 1: ADD NEW COLOR PALETTE
// ============================================================================

const customColors = {
  // Sunset theme
  sunset: {
    50: '#fff8f3',
    100: '#ffe5d3',
    200: '#ffd4b3',
    300: '#ffb88f',
    400: '#ff9d6b',
    500: '#ff7f47',
    600: '#e66b2d',
    700: '#cc571f',
    800: '#b34313',
    900: '#8c3409',
  },

  // Ocean theme
  ocean: {
    50: '#f0f9ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Forest theme
  forest: {
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
};

// ============================================================================
// TEMPLATE 2: CUSTOM BUTTON VARIANTS
// ============================================================================

const customButtonVariants = {
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
      transform: 'translateY(0)',
    },
    transition: 'all 0.3s ease',
  },

  // Gradient button
  gradient: {
    bgGradient: 'linear(to-r, brand.500, accent.500)',
    color: 'white',
    _hover: {
      bgGradient: 'linear(to-r, brand.600, accent.600)',
      transform: 'translateY(-2px)',
      boxShadow: 'lg',
    },
  },

  // Glow button
  glow: {
    bg: 'brand.500',
    color: 'white',
    boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)',
    _hover: {
      boxShadow: '0 0 30px rgba(14, 165, 233, 0.7)',
      transform: 'translateY(-2px)',
    },
  },

  // Outline animated
  outlineAnimated: {
    borderColor: 'brand.500',
    color: 'brand.500',
    position: 'relative',
    _before: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      bg: 'brand.500',
      transition: 'left 0.3s ease',
      zIndex: -1,
    },
    _hover: {
      color: 'white',
      _before: {
        left: 0,
      },
    },
  },

  // Ghost elevated
  ghostElevated: {
    color: 'brand.500',
    _hover: {
      bg: 'brand.50',
      transform: 'translateY(-2px)',
      boxShadow: 'md',
    },
  },
};

// ============================================================================
// TEMPLATE 3: CUSTOM INPUT STYLES
// ============================================================================

const customInputVariants = {
  // Underline style
  underline: {
    field: {
      border: 'none',
      borderBottom: '2px solid',
      borderColor: 'gray.300',
      borderRadius: 0,
      paddingX: 0,
      paddingY: 2,
      _focus: {
        borderColor: 'brand.500',
        boxShadow: 'none',
      },
      _hover: {
        borderColor: 'gray.400',
      },
    },
  },

  // Filled rounded
  filledRounded: {
    field: {
      bg: 'gray.100',
      borderRadius: 'full',
      border: 'none',
      paddingX: 6,
      _focus: {
        bg: 'white',
        boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
        borderColor: 'brand.500',
      },
      _hover: {
        bg: 'gray.200',
      },
    },
  },

  // Gradient border
  gradientBorder: {
    field: {
      border: '2px solid transparent',
      backgroundImage: `linear-gradient(white, white), linear-gradient(135deg, #0ea5e9, #8b5cf6)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      _focus: {
        boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
      },
    },
  },
};

// ============================================================================
// TEMPLATE 4: CUSTOM CARD VARIANTS
// ============================================================================

const customCardVariants = {
  // Elevated card
  elevated: {
    bg: 'white',
    borderRadius: 'xl',
    boxShadow: 'lg',
    transition: 'all 0.3s ease',
    _hover: {
      boxShadow: '2xl',
      transform: 'translateY(-8px)',
    },
  },

  // Minimal card
  minimal: {
    bg: 'transparent',
    borderRadius: 'lg',
    borderWidth: '1px',
    borderColor: 'gray.200',
    transition: 'all 0.2s ease',
    _hover: {
      borderColor: 'brand.500',
      boxShadow: 'md',
    },
  },

  // Gradient border card
  gradientBorder: {
    bg: 'white',
    borderRadius: 'lg',
    borderWidth: '2px',
    borderImage: 'linear-gradient(135deg, #0ea5e9, #8b5cf6) 1',
    transition: 'all 0.3s ease',
    _hover: {
      boxShadow: '0 0 30px rgba(14, 165, 233, 0.2)',
    },
  },

  // Glass morphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: 'xl',
    borderWidth: '1px',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  },
};

// ============================================================================
// TEMPLATE 5: CUSTOM SHADOWS
// ============================================================================

const customShadows = {
  // Soft shadows
  soft: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },

  // Color shadows
  brand: '0 0 20px rgba(14, 165, 233, 0.3)',
  accent: '0 0 20px rgba(139, 92, 246, 0.3)',
  success: '0 0 20px rgba(34, 197, 94, 0.3)',
  danger: '0 0 20px rgba(239, 68, 68, 0.3)',

  // Inset shadows
  inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
};

// ============================================================================
// TEMPLATE 6: CUSTOM MODAL VARIANTS
// ============================================================================

const customModalVariants = {
  // Centered modal
  centered: {
    dialogContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialog: {
      borderRadius: 'xl',
      boxShadow: '2xl',
      maxWidth: '90%',
    },
  },

  // Slide-up modal
  slideUp: {
    dialogContainer: {
      animation: 'slideUp 0.3s ease-out',
    },
  },

  // Fade modal
  fade: {
    dialogContainer: {
      animation: 'fadeIn 0.3s ease-out',
    },
  },
};

// ============================================================================
// TEMPLATE 7: CUSTOM TRANSITIONS & ANIMATIONS
// ============================================================================

const customTransitions = {
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  faster: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  slowest: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================================================
// TEMPLATE 8: THEME PRESET - DARK MODERN
// ============================================================================

const darkModernTheme = {
  colors: {
    brand: {
      500: '#00d4ff',
      600: '#00a8cc',
    },
    accent: {
      500: '#ff006e',
      600: '#cc0056',
    },
    bg: {
      primary: '#0a0e27',
      secondary: '#16213e',
      tertiary: '#1a1a2e',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#0a0e27',
        color: '#e0e0e0',
      },
    },
  },
};

// ============================================================================
// TEMPLATE 9: THEME PRESET - SOFT PASTEL
// ============================================================================

const softPastelTheme = {
  colors: {
    brand: {
      500: '#a8d8ea',
      600: '#7ec8e3',
    },
    accent: {
      500: '#aa96da',
      600: '#9381c7',
    },
    secondary: {
      500: '#fcbad3',
      600: '#f9a8c4',
    },
  },
};

// ============================================================================
// TEMPLATE 10: RESPONSIVE CONFIGURATION
// ============================================================================

const customResponsiveConfig = {
  breakpoints: {
    xs: '0px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  containerSizes: {
    xs: '20rem',    // 320px
    sm: '24rem',    // 384px
    md: '28rem',    // 448px
    lg: '32rem',    // 512px
    xl: '36rem',    // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px
    '6xl': '72rem', // 1152px
    '7xl': '80rem', // 1280px
  },
};

// ============================================================================
// TEMPLATE 11: COMPLETE THEME IMPLEMENTATION EXAMPLE
// ============================================================================

/**
 * To use any of these templates:
 * 
 * 1. Copy the template code
 * 2. Paste it into your theme/chakra-theme.js
 * 3. Update the extendTheme call to include your customizations:
 * 
 * const theme = extendTheme({
 *   colors,
 *   fonts,
 *   styles,
 *   components: {
 *     Button: {
 *       variants: {
 *         ...customButtonVariants,
 *       }
 *     },
 *     Input: {
 *       variants: {
 *         ...customInputVariants,
 *       }
 *     },
 *     Card: {
 *       variants: {
 *         ...customCardVariants,
 *       }
 *     },
 *   },
 *   shadows: {
 *     ...customShadows,
 *   },
 *   config,
 *   sizes,
 *   radii,
 * });
 * 
 * export default theme;
 */

// ============================================================================
// TEMPLATE 12: COLOR GENERATOR UTILITY
// ============================================================================

/**
 * Generate a complete color palette from a base color
 * 
 * Usage:
 * const myColors = generateColorPalette('#0ea5e9');
 * 
 * Or use online tools:
 * - https://chir.ps/color
 * - https://tailwindcss.com/resources/tailwindcss-cheatsheet
 * - https://www.tints.dev
 */

function generateColorPalette(baseHex) {
  // This is a simplified example. For production, use:
  // npm install chroma-js
  // import chroma from 'chroma-js';
  
  // Then use: chroma.scale(['white', baseHex, 'black']).colors(10)
  
  return {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: baseHex,
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  };
}

export {
  customColors,
  customButtonVariants,
  customInputVariants,
  customCardVariants,
  customShadows,
  customModalVariants,
  customTransitions,
  darkModernTheme,
  softPastelTheme,
  customResponsiveConfig,
  generateColorPalette,
};
