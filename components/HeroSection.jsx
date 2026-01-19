import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';

const HeroSection = () => {
  const bgColor = useColorModeValue('white', 'gray.900');

  return (
    <Box bg={bgColor} minH="calc(100vh - 80px)" display="flex" alignItems="center" py={20}>
      <Container maxW="6xl" width="100%">
        <Flex direction="column" align="center" textAlign="center" gap={6}>
          <Text
            fontSize="sm"
            fontWeight="600"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Welcome to Modern UI
          </Text>

          <Heading as="h1" size="3xl" fontWeight="900" lineHeight="1.2" maxW="800px">
            Build Beautiful, Responsive Interfaces with{' '}
            <Box as="span" bgGradient="linear(to-r, brand.500, accent.500)" bgClip="text">
              Modern React Components
            </Box>
          </Heading>

          <Text fontSize="xl" color="gray.600" maxW="600px" lineHeight="tall">
            Create stunning web applications with our comprehensive collection of accessible,
            customizable, and production-ready components powered by Chakra UI.
          </Text>

          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={4}>
            <Button size="lg" variant="solid" px={8}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" px={8}>
              Learn More
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;
