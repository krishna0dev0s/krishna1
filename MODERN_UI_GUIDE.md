# Modern UI Showcase - React & Chakra UI Components

A comprehensive, production-ready UI component library built with React, Chakra UI, and Framer Motion. This showcase demonstrates modern design patterns, accessibility best practices, and responsive design.

## 🎯 Features

### Core Components

1. **Navigation Bar (`Navbar.jsx`)**
   - Sticky navigation with logo and branding
   - Responsive mobile drawer menu
   - Light/Dark mode toggle
   - Smooth color transitions

2. **Hero Section (`HeroSection.jsx`)**
   - Eye-catching call-to-action design
   - Animated background elements
   - Gradient text effects
   - Framer Motion animations
   - Responsive grid layout

3. **Card Grid (`CardGrid.jsx`)**
   - Responsive card layout (1 col mobile, 2-3 cols desktop)
   - Hover animations and shadows
   - Badge system for highlighting
   - Price display and action buttons
   - Grid-based content organization

4. **Contact Form (`ContactForm.jsx`)**
   - Real-time form validation
   - Custom error messages per field
   - Email and phone validation patterns
   - Submit button with loading state
   - Toast notifications for feedback
   - Responsive field layout

5. **Modal Dialog (`ModalDialog.jsx`)**
   - Multiple modal types (info, success, warning)
   - Icon-based visual indicators
   - Checkbox for "Don't show again"
   - Backdrop blur effect
   - Accessible modal implementation
   - Smooth transitions

6. **Content Organizer (`ContentOrganizer.jsx`)**
   - **Accordion**: Collapsible FAQ sections with icons
   - **Tabs**: Organized getting started guide
   - Smooth transitions and animations
   - Icon indicators for visual clarity

7. **Tooltip & Popover (`TooltipPopover.jsx`)**
   - Contextual help tooltips
   - Interactive popovers with portals
   - Custom positioning and colors
   - Rich content support
   - Accessibility features

8. **Loader & Spinner (`LoaderSpinner.jsx`)**
   - Multiple spinner variants (sizes and colors)
   - Linear progress bars with animations
   - Circular progress indicators
   - Button loading states
   - Async operation handling

### Theme System (`chakra-theme.js`)

#### Color Palette
- **Brand**: Primary blue gradient (50-900)
- **Accent**: Purple gradient (50-900)
- **Success**: Green gradient (50-900)
- **Warning**: Amber gradient (50-900)
- **Danger**: Red gradient (50-900)

#### Typography
- **Body Font**: System fonts with fallbacks
- **Heading Font**: System fonts optimized for headings
- **Mono Font**: Fira Code for code display

#### Components Styling
- Custom button variants (solid, outline, ghost)
- Enhanced form inputs with focus states
- Styled cards with hover effects
- Accessible modals and tooltips
- Custom accordion and tab styles

#### Responsive Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## 📦 Installation

```bash
# Install dependencies
npm install

# The following packages are already included:
# - @chakra-ui/react
# - @emotion/react
# - @emotion/styled
# - framer-motion
```

## 🚀 Getting Started

### 1. Setup Chakra Provider

The main demo page (`app/modern-ui/page.jsx`) already wraps the app with ChakraProvider:

```jsx
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme/chakra-theme';

<ChakraProvider theme={theme}>
  {/* Your components here */}
</ChakraProvider>
```

### 2. Use Components

Import and use components in your pages:

```jsx
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CardGrid from '@/components/CardGrid';

export default function MyPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CardGrid />
    </>
  );
}
```

### 3. Access the Showcase

Navigate to: `http://localhost:3000/modern-ui`

## 🎨 Customizing the Theme

Edit `theme/chakra-theme.js` to customize:

```javascript
// Add new colors
const colors = {
  custom: {
    50: '#f0f0f0',
    500: '#1a1a1a',
    900: '#000000',
  },
};

// Update component styles
const components = {
  Button: {
    variants: {
      myCustomVariant: {
        bg: 'custom.500',
        // ... more styles
      },
    },
  },
};
```

## ♿ Accessibility

All components follow WCAG 2.1 guidelines:

- **Semantic HTML**: Proper heading hierarchy, semantic elements
- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Sufficient contrast ratios
- **Form Labels**: Proper label associations
- **Error Messages**: Clear, associative error messages

## 📱 Responsive Design

All components use Chakra UI's responsive array syntax:

```jsx
<Box
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  display={{ base: 'block', md: 'flex' }}
  gap={{ base: 2, md: 4 }}
/>
```

Breakpoints:
- `base`: Mobile (< 640px)
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

## 🌓 Dark Mode

Dark mode is automatically supported:

```jsx
import { useColorModeValue } from '@chakra-ui/react';

const Component = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  return <Box bg={bgColor} />;
};
```

## 🎬 Animations

Framer Motion is integrated for smooth animations:

```jsx
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const MotionBox = motion(Box);

<MotionBox
  animate={{ opacity: 1 }}
  initial={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
/>
```

## 📋 Component Props & Usage

### Navbar
```jsx
<Navbar />
// Includes: Logo, navigation links, dark mode toggle, mobile drawer
```

### HeroSection
```jsx
<HeroSection />
// Includes: Title, description, CTA buttons, animated background
```

### CardGrid
```jsx
<CardGrid title="My Products" />
// Displays: Responsive card grid with badges, prices, actions
```

### ContactForm
```jsx
<ContactForm />
// Includes: Form validation, error messages, submit handling, toast notifications
```

### Modal Dialog
```jsx
<ModalDialog />
// Includes: Multiple modal types, icons, interactive elements
```

### ContentOrganizer
```jsx
<ContentOrganizer />
// Includes: Tabs and accordion for organizing content
```

### TooltipPopover
```jsx
<TooltipPopover />
// Includes: Tooltips and interactive popovers with rich content
```

### LoaderSpinner
```jsx
<LoaderSpinner />
// Includes: Various spinner sizes, progress bars, button loading states
```

## 📁 Project Structure

```
components/
├── Navbar.jsx              # Navigation with responsive menu
├── HeroSection.jsx         # Hero with animations
├── CardGrid.jsx            # Responsive card grid
├── ContactForm.jsx         # Form with validation
├── ModalDialog.jsx         # Modal dialogs
├── ContentOrganizer.jsx    # Tabs & accordion
├── TooltipPopover.jsx      # Tooltips & popovers
└── LoaderSpinner.jsx       # Spinners & progress

theme/
└── chakra-theme.js         # Complete theme configuration

app/
└── modern-ui/
    └── page.jsx            # Main showcase page
```

## 🔧 Customization Examples

### Change Brand Color
```javascript
// In theme/chakra-theme.js
colors: {
  brand: {
    500: '#your-color-here',
    600: '#your-darker-color',
  }
}
```

### Add New Component Variant
```javascript
// In theme/chakra-theme.js
components: {
  Button: {
    variants: {
      myVariant: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600' },
      }
    }
  }
}
```

### Customize Responsive Breakpoints
```javascript
// In theme/chakra-theme.js
sizes: {
  container: {
    custom: '900px',
  }
}
```

## 🎯 Best Practices

1. **Use the Theme**: Always use theme colors, fonts, and sizes for consistency
2. **Responsive First**: Design for mobile first, then scale up
3. **Accessibility**: Test with keyboard and screen readers
4. **Performance**: Use React.memo and lazy loading for heavy components
5. **Validation**: Always validate form inputs with clear feedback
6. **Loading States**: Show spinners for all async operations
7. **Error Handling**: Provide helpful error messages and recovery options
8. **Testing**: Test components with different screen sizes and color modes

## 🚀 Deployment

The showcase is ready for production:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 Resources

- [Chakra UI Documentation](https://chakra-ui.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, Chakra UI, and Framer Motion**
