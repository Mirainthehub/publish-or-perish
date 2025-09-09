// Design tokens for consistent theming and accessibility
export const tokens = {
  // Colors with WCAG AA compliance (4.5:1 contrast ratio)
  colors: {
    // Primary palette
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    
    // Semantic colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Main green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },
    
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Main yellow
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f'
    },
    
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Main red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },
    
    // Neutral grays
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    
    // Game-specific tokens
    tokens: {
      funding: {
        bg: '#fef3c7', // warning-100
        border: '#f59e0b', // warning-500
        text: '#92400e', // warning-800
        icon: '💰'
      },
      collaboration: {
        bg: '#dbeafe', // primary-100
        border: '#3b82f6', // primary-500
        text: '#1e40af', // primary-800
        icon: '🤝'
      },
      special: {
        bg: '#f3e8ff', // purple-100
        border: '#a855f7', // purple-500
        text: '#6b21a8', // purple-800
        icon: '⭐'
      }
    }
  },
  
  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }]
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // Spacing scale (based on 4px grid)
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    5: '1.25rem', // 20px
    6: '1.5rem',  // 24px
    8: '2rem',    // 32px
    10: '2.5rem', // 40px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
    20: '5rem',   // 80px
    24: '6rem'    // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  
  // Transitions
  transition: {
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet portrait
    lg: '1024px',  // Tablet landscape / Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px' // Extra large desktop
  },
  
  // Accessibility
  accessibility: {
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '#3b82f6', // primary-500
      offset: '2px'
    },
    highContrast: {
      borderWidth: '4px',
      outlineWidth: '3px'
    },
    reducedMotion: {
      transition: 'none',
      animation: 'none'
    }
  },
  
  // Component-specific tokens
  components: {
    button: {
      borderRadius: '0.375rem', // md
      padding: {
        sm: '0.5rem 0.75rem',   // 2 3
        md: '0.75rem 1rem',     // 3 4
        lg: '1rem 1.5rem'       // 4 6
      },
      fontSize: {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem'
      }
    },
    
    card: {
      borderRadius: '0.5rem', // lg
      padding: '1.5rem',      // 6
      shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },
    
    input: {
      borderRadius: '0.375rem', // md
      padding: '0.75rem',       // 3
      borderWidth: '1px',
      focusBorderWidth: '2px'
    }
  }
};

// Utility functions for responsive design
export const responsive = {
  // Media queries
  media: {
    sm: `@media (min-width: ${tokens.breakpoints.sm})`,
    md: `@media (min-width: ${tokens.breakpoints.md})`,
    lg: `@media (min-width: ${tokens.breakpoints.lg})`,
    xl: `@media (min-width: ${tokens.breakpoints.xl})`,
    '2xl': `@media (min-width: ${tokens.breakpoints['2xl']})`,
    
    // Utility queries
    mobile: `@media (max-width: ${tokens.breakpoints.md})`,
    tablet: `@media (min-width: ${tokens.breakpoints.md}) and (max-width: ${tokens.breakpoints.lg})`,
    desktop: `@media (min-width: ${tokens.breakpoints.lg})`,
    
    // Accessibility queries
    reducedMotion: '@media (prefers-reduced-motion: reduce)',
    highContrast: '@media (prefers-contrast: high)',
    darkMode: '@media (prefers-color-scheme: dark)'
  },
  
  // Responsive utilities
  grid: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 md:grid-cols-2',
    cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    cols6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  },
  
  // Common responsive patterns
  spacing: {
    section: 'py-8 md:py-12 lg:py-16',
    stack: 'space-y-4 md:space-y-6 lg:space-y-8',
    inline: 'space-x-2 md:space-x-4 lg:space-x-6'
  },
  
  text: {
    heading: 'text-2xl md:text-3xl lg:text-4xl',
    subheading: 'text-xl md:text-2xl lg:text-3xl',
    body: 'text-sm md:text-base lg:text-lg'
  }
};

// Accessibility helpers
export const a11y = {
  // ARIA live region announcements
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  },
  
  // Focus management
  focus: {
    trap: (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
      
      element.addEventListener('keydown', handleTabKey);
      firstElement?.focus();
      
      return () => element.removeEventListener('keydown', handleTabKey);
    },
    
    visible: (element: HTMLElement) => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  },
  
  // Color contrast utilities
  contrast: {
    // Calculate relative luminance
    luminance: (rgb: [number, number, number]) => {
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    },
    
    // Calculate contrast ratio
    ratio: (rgb1: [number, number, number], rgb2: [number, number, number]) => {
      const l1 = a11y.contrast.luminance(rgb1);
      const l2 = a11y.contrast.luminance(rgb2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    },
    
    // Check WCAG compliance
    isCompliant: (rgb1: [number, number, number], rgb2: [number, number, number], level: 'AA' | 'AAA' = 'AA') => {
      const ratio = a11y.contrast.ratio(rgb1, rgb2);
      return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
    }
  }
};

// Theme composition utilities
export const theme = {
  // Get color with opacity
  alpha: (color: string, opacity: number) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },
  
  // Build component variants
  variants: {
    button: (variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error') => {
      const variants = {
        primary: {
          bg: tokens.colors.primary[500],
          text: '#ffffff',
          border: tokens.colors.primary[500],
          hover: {
            bg: tokens.colors.primary[600],
            border: tokens.colors.primary[600]
          }
        },
        secondary: {
          bg: 'transparent',
          text: tokens.colors.primary[600],
          border: tokens.colors.primary[300],
          hover: {
            bg: tokens.colors.primary[50],
            border: tokens.colors.primary[400]
          }
        },
        success: {
          bg: tokens.colors.success[500],
          text: '#ffffff',
          border: tokens.colors.success[500],
          hover: {
            bg: tokens.colors.success[600],
            border: tokens.colors.success[600]
          }
        },
        warning: {
          bg: tokens.colors.warning[500],
          text: '#ffffff',
          border: tokens.colors.warning[500],
          hover: {
            bg: tokens.colors.warning[600],
            border: tokens.colors.warning[600]
          }
        },
        error: {
          bg: tokens.colors.error[500],
          text: '#ffffff',
          border: tokens.colors.error[500],
          hover: {
            bg: tokens.colors.error[600],
            border: tokens.colors.error[600]
          }
        }
      };
      return variants[variant];
    }
  },
  
  // Dark mode overrides
  dark: {
    colors: {
      background: tokens.colors.gray[900],
      surface: tokens.colors.gray[800],
      text: tokens.colors.gray[100],
      textSecondary: tokens.colors.gray[300],
      border: tokens.colors.gray[700]
    }
  }
};
