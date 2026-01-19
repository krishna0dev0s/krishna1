/**
 * USAGE EXAMPLES FOR CHAKRA UI COMPONENTS
 * 
 * This file contains practical examples of how to use and customize
 * the modern UI components and theme.
 */

// ============================================================================
// 1. BASIC COMPONENT USAGE
// ============================================================================

import { Box, Button, Card, CardBody, Heading, Text, useColorMode } from '@chakra-ui/react';

// Simple button with theme colors
export const ButtonExample = () => (
  <Button colorScheme="brand" size="lg">
    Click Me
  </Button>
);

// Card component with hover effects
export const CardExample = () => (
  <Card>
    <CardBody>
      <Heading size="md">Card Title</Heading>
      <Text>This card has automatic hover effects from the theme.</Text>
    </CardBody>
  </Card>
);

// ============================================================================
// 2. COLOR MODE (DARK/LIGHT) USAGE
// ============================================================================

export const DarkModeExample = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Box>
      <Text>Current mode: {colorMode}</Text>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    </Box>
  );
};

// ============================================================================
// 3. RESPONSIVE DESIGN EXAMPLES
// ============================================================================

import { Container, SimpleGrid, Stack } from '@chakra-ui/react';

// Responsive grid that changes columns based on screen size
export const ResponsiveGridExample = () => (
  <Container maxW="7xl">
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={4}
    >
      {/* Cards will be 1 column on mobile, 2 on tablet, 3 on desktop */}
      <Card><CardBody>Item 1</CardBody></Card>
      <Card><CardBody>Item 2</CardBody></Card>
      <Card><CardBody>Item 3</CardBody></Card>
    </SimpleGrid>
  </Container>
);

// Responsive stack that switches direction
export const ResponsiveStackExample = () => (
  <Stack
    direction={{ base: 'column', md: 'row' }}
    spacing={{ base: 2, md: 4 }}
    align="center"
  >
    <Box>Item 1</Box>
    <Box>Item 2</Box>
    <Box>Item 3</Box>
  </Stack>
);

// ============================================================================
// 4. FORM VALIDATION EXAMPLES
// ============================================================================

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export const FormValidationExample = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    toast({
      title: 'Success',
      description: 'Form submitted successfully!',
      status: 'success',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={!!error}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="user@example.com"
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
      <Button type="submit" mt={4}>
        Submit
      </Button>
    </form>
  );
};

// ============================================================================
// 5. ANIMATION EXAMPLES WITH FRAMER MOTION
// ============================================================================

import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const AnimationExample = () => (
  <MotionBox
    animate={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6 }}
  >
    <Heading>Animated Title</Heading>
  </MotionBox>
);

export const HoverAnimationExample = () => (
  <MotionBox
    whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
    whileTap={{ scale: 0.95 }}
  >
    <Button>Click & Hover Me</Button>
  </MotionBox>
);

// ============================================================================
// 6. MODAL & DIALOG EXAMPLES
// ============================================================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

export const ModalExample = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>
            This is the content of the modal dialog.
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={onClose}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// ============================================================================
// 7. TOOLTIP & POPOVER EXAMPLES
// ============================================================================

import {
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
} from '@chakra-ui/react';

export const TooltipExample = () => (
  <Tooltip label="This is helpful information" hasArrow placement="top">
    <Button>Hover me</Button>
  </Tooltip>
);

export const PopoverExample = () => (
  <Popover>
    <PopoverTrigger>
      <Button>Click me</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverCloseButton />
      <PopoverHeader fontWeight="bold">
        Information
      </PopoverHeader>
      <PopoverBody>
        This is rich content that can include multiple elements.
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

// ============================================================================
// 8. LOADING STATE EXAMPLES
// ============================================================================

import { Spinner, Progress } from '@chakra-ui/react';

export const LoadingExample = () => (
  <Box>
    <Spinner color="brand.500" size="lg" />
    <Text>Loading...</Text>
  </Box>
);

export const ProgressExample = () => (
  <Box>
    <Progress value={65} colorScheme="brand" hasStripe isAnimated />
    <Text>65% Complete</Text>
  </Box>
);

export const ButtonLoadingExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Button
      isLoading={isLoading}
      loadingText="Loading..."
      onClick={handleClick}
    >
      Click to Load
    </Button>
  );
};

// ============================================================================
// 9. CUSTOM HOOK EXAMPLES
// ============================================================================

export const useCustomNotification = () => {
  const toast = useToast();

  return (title, description, status = 'info') => {
    toast({
      title,
      description,
      status,
      duration: 3,
      isClosable: true,
      position: 'top-right',
    });
  };
};

// Usage:
export const NotificationExample = () => {
  const notify = useCustomNotification();

  const handleSuccess = () => {
    notify('Success', 'Operation completed successfully!', 'success');
  };

  return <Button onClick={handleSuccess}>Show Notification</Button>;
};

// ============================================================================
// 10. THEME INTEGRATION EXAMPLES
// ============================================================================

import { useColorModeValue } from '@chakra-ui/react';

// Using theme colors in components
export const ThemeColorExample = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');

  return (
    <Box bg={bgColor} color={textColor} p={4} borderRadius="lg">
      <Text>This box uses theme colors that adapt to dark mode</Text>
    </Box>
  );
};

// Using theme typography
export const ThemeTypographyExample = () => (
  <Box fontFamily="body">
    <Heading as="h1" size="2xl" mb={4}>
      Large Heading
    </Heading>
    <Text fontSize="lg">Body text with theme font</Text>
  </Box>
);

// ============================================================================
// 11. ACCESSIBILITY EXAMPLES
// ============================================================================

import { Checkbox, Radio, RadioGroup } from '@chakra-ui/react';

export const AccessibilityExample = () => (
  <VStack spacing={4} align="start">
    {/* Form with proper labels */}
    <FormControl isRequired>
      <FormLabel htmlFor="username">Username</FormLabel>
      <Input id="username" placeholder="Enter your username" />
    </FormControl>

    {/* Checkbox with label */}
    <Checkbox>
      I agree to the terms and conditions
    </Checkbox>

    {/* Radio group with labels */}
    <RadioGroup>
      <Stack direction="row">
        <Radio value="option1">Option 1</Radio>
        <Radio value="option2">Option 2</Radio>
      </Stack>
    </RadioGroup>
  </VStack>
);

// ============================================================================
// 12. COMPLETE PAGE EXAMPLE
// ============================================================================

export const CompletePage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Header */}
      <Box bg="brand.500" color="white" py={4}>
        <Container maxW="7xl">
          <Heading>My App</Heading>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Welcome
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={12}>
          <Card>
            <CardBody>
              <Heading size="md" mb={2}>Card 1</Heading>
              <Text>Responsive card grid</Text>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Heading size="md" mb={2}>Card 2</Heading>
              <Text>Dark mode support</Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Button colorScheme="brand" size="lg">
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default CompletePage;
