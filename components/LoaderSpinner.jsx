import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  CircularProgress,
  Progress,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoaderSpinner = () => {
  const [isLoading, setIsLoading] = useState({
    spinner1: false,
    spinner2: false,
    spinner3: false,
  });

  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLoadingStart = async (key) => {
    setIsLoading((prev) => ({ ...prev, [key]: true }));

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading((prev) => ({ ...prev, [key]: false }));
    toast({
      title: 'Operation Complete',
      description: 'The async operation finished successfully!',
      status: 'success',
      duration: 2,
      isClosable: true,
    });
  };

  return (
    <Box py={16} bg={bgColor}>
      <Container maxW="5xl">
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" mb={4}>
            Loaders & Spinners
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Various loading states and spinners for async operations
          </Text>
        </Box>

        <VStack spacing={12}>
          {/* Spinners Section */}
          <Box width="100%">
            <Heading as="h3" size="md" mb={6}>
              Spinner Variants
            </Heading>

            <HStack
              spacing={8}
              wrap="wrap"
              justify="center"
              bg={cardBg}
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              gap={8}
            >
              {/* Basic Spinner */}
              <VStack spacing={3}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="brand.500"
                  size="xl"
                />
                <Text fontSize="sm" fontWeight="600">
                  Default
                </Text>
              </VStack>

              {/* Custom Size Spinner */}
              <VStack spacing={3}>
                <Spinner
                  thickness="6px"
                  speed="0.8s"
                  emptyColor="accent.200"
                  color="accent.500"
                  size="lg"
                />
                <Text fontSize="sm" fontWeight="600">
                  Large
                </Text>
              </VStack>

              {/* Small Spinner */}
              <VStack spacing={3}>
                <Spinner
                  thickness="3px"
                  speed="0.6s"
                  emptyColor="success.200"
                  color="success.500"
                  size="md"
                />
                <Text fontSize="sm" fontWeight="600">
                  Small
                </Text>
              </VStack>

              {/* Animated Custom Spinner */}
              <VStack spacing={3}>
                <MotionBox
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Spinner
                    thickness="4px"
                    speed="1s"
                    emptyColor="danger.200"
                    color="danger.500"
                    size="lg"
                  />
                </MotionBox>
                <Text fontSize="sm" fontWeight="600">
                  Animated
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Progress Bars Section */}
          <Box width="100%">
            <Heading as="h3" size="md" mb={6}>
              Progress Indicators
            </Heading>

            <VStack
              spacing={6}
              bg={cardBg}
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              {/* Linear Progress */}
              <Box width="100%">
                <Text fontWeight="600" mb={3}>
                  Linear Progress - 65%
                </Text>
                <Progress
                  value={65}
                  colorScheme="brand"
                  size="lg"
                  borderRadius="full"
                  hasStripe
                  isAnimated
                />
              </Box>

              {/* Different States */}
              <Box width="100%">
                <Text fontWeight="600" mb={3}>
                  Multiple Progress Levels
                </Text>
                <VStack spacing={3} width="100%">
                  <Box width="100%">
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Complete (100%)
                    </Text>
                    <Progress value={100} colorScheme="success" borderRadius="full" />
                  </Box>
                  <Box width="100%">
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      In Progress (50%)
                    </Text>
                    <Progress value={50} colorScheme="brand" borderRadius="full" hasStripe isAnimated />
                  </Box>
                  <Box width="100%">
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Loading (30%)
                    </Text>
                    <Progress value={30} colorScheme="warning" borderRadius="full" />
                  </Box>
                </VStack>
              </Box>

              {/* Circular Progress */}
              <HStack spacing={6} justify="center" width="100%">
                <VStack spacing={2}>
                  <CircularProgress value={75} color="brand.500" size="100px">
                    <Box fontSize="lg" fontWeight="bold">
                      75%
                    </Box>
                  </CircularProgress>
                  <Text fontSize="sm">Circular</Text>
                </VStack>

                <VStack spacing={2}>
                  <CircularProgress
                    value={45}
                    color="accent.500"
                    size="100px"
                    thickness={4}
                  >
                    <Box fontSize="lg" fontWeight="bold">
                      45%
                    </Box>
                  </CircularProgress>
                  <Text fontSize="sm">Thick</Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Button Loading States */}
          <Box width="100%">
            <Heading as="h3" size="md" mb={6}>
              Button Loading States
            </Heading>

            <HStack
              spacing={4}
              wrap="wrap"
              justify="center"
              bg={cardBg}
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              gap={4}
            >
              <Button
                isLoading={isLoading.spinner1}
                loadingText="Processing..."
                colorScheme="brand"
                onClick={() => handleLoadingStart('spinner1')}
              >
                Click to Load
              </Button>

              <Button
                isLoading={isLoading.spinner2}
                loadingText="Saving..."
                colorScheme="success"
                variant="outline"
                onClick={() => handleLoadingStart('spinner2')}
              >
                Save Data
              </Button>

              <Button
                isLoading={isLoading.spinner3}
                loadingText="Uploading..."
                colorScheme="accent"
                onClick={() => handleLoadingStart('spinner3')}
              >
                Upload File
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoaderSpinner;
