import React from 'react';
import {
  Box,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Button,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Portal,
  Icon,
} from '@chakra-ui/react';
import { InfoIcon, QuestionIcon } from '@chakra-ui/icons';

const TooltipPopover = () => {
  const popoverBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={8} py={8} px={4}>
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Tooltip & Popover Showcase
        </Text>
        <Text color="gray.600">
          Hover over buttons to see tooltips or click to see popovers
        </Text>
      </Box>

      {/* Tooltips Section */}
      <Box width="100%" maxW="600px">
        <Text fontSize="lg" fontWeight="600" mb={6} ml={2}>
          Tooltips (Hover to view)
        </Text>

        <HStack spacing={4} wrap="wrap" justify="center" gap={4}>
          <Tooltip
            label="Click here to get started"
            placement="top"
            hasArrow
            borderRadius="md"
            bg="brand.500"
            color="white"
          >
            <Button variant="solid">
              Get Started
            </Button>
          </Tooltip>

          <Tooltip
            label="Save your progress"
            placement="top"
            hasArrow
            bg="success.500"
            color="white"
          >
            <Button variant="outline" colorScheme="success">
              Save
            </Button>
          </Tooltip>

          <Tooltip
            label="Delete this item permanently"
            placement="top"
            hasArrow
            bg="danger.500"
            color="white"
          >
            <Button variant="outline" colorScheme="danger">
              Delete
            </Button>
          </Tooltip>

          <Tooltip
            label="Learn more about this feature"
            placement="top"
            hasArrow
            bg="accent.500"
            color="white"
          >
            <Icon as={InfoIcon} w={6} h={6} cursor="pointer" />
          </Tooltip>
        </HStack>
      </Box>

      {/* Popovers Section */}
      <Box width="100%" maxW="600px" borderTop="2px solid" borderColor={borderColor} pt={8}>
        <Text fontSize="lg" fontWeight="600" mb={6} ml={2}>
          Popovers (Click to open)
        </Text>

        <HStack spacing={4} wrap="wrap" justify="center" gap={4}>
          {/* Basic Popover */}
          <Popover>
            <PopoverTrigger>
              <Button variant="solid">
                Profile Info
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bg={popoverBg} borderColor={borderColor} borderRadius="lg">
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold" fontSize="lg">
                  User Profile
                </PopoverHeader>
                <PopoverBody>
                  <VStack spacing={3} align="start">
                    <Text fontSize="sm">
                      <strong>Name:</strong> John Doe
                    </Text>
                    <Text fontSize="sm">
                      <strong>Email:</strong> john@example.com
                    </Text>
                    <Text fontSize="sm">
                      <strong>Status:</strong> Active
                    </Text>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>

          {/* Help Popover */}
          <Popover>
            <PopoverTrigger>
              <Box cursor="pointer">
                <Icon as={QuestionIcon} w={6} h={6} color="brand.500" />
              </Box>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bg={popoverBg} borderColor={borderColor} borderRadius="lg">
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold" fontSize="lg">
                  Need Help?
                </PopoverHeader>
                <PopoverBody>
                  <VStack spacing={2} align="start">
                    <Text fontSize="sm">
                      📚 Check our documentation
                    </Text>
                    <Text fontSize="sm">
                      💬 Contact support team
                    </Text>
                    <Text fontSize="sm">
                      🎥 Watch video tutorials
                    </Text>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>

          {/* Settings Popover */}
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" colorScheme="brand">
                Settings
              </Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent bg={popoverBg} borderColor={borderColor} borderRadius="lg">
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold" fontSize="lg">
                  Preferences
                </PopoverHeader>
                <PopoverBody>
                  <VStack spacing={3} align="start">
                    <Text fontSize="sm">
                      ✓ Email notifications
                    </Text>
                    <Text fontSize="sm">
                      ✓ Dark mode enabled
                    </Text>
                    <Text fontSize="sm">
                      ✗ Two-factor authentication
                    </Text>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </HStack>
      </Box>
    </VStack>
  );
};

export default TooltipPopover;
