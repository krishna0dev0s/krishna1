import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Badge,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';

const CardGrid = ({ title = 'Our Products' }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const products = [
    {
      id: 1,
      title: 'Responsive Design',
      description: 'Mobile-first approach that looks great on all devices.',
      badge: 'Popular',
      price: '$99',
    },
    {
      id: 2,
      title: 'Dark Mode Support',
      description: 'Built-in dark mode with smooth transitions.',
      badge: 'New',
      price: '$79',
    },
    {
      id: 3,
      title: 'Accessible Components',
      description: 'WCAG 2.1 compliant components for inclusive design.',
      badge: 'Featured',
      price: '$129',
    },
    {
      id: 4,
      title: 'Animation Library',
      description: 'Smooth animations powered by Framer Motion.',
      badge: 'Premium',
      price: '$149',
    },
    {
      id: 5,
      title: 'Theme Customization',
      description: 'Unlimited color schemes and typography options.',
      badge: 'Pro',
      price: '$199',
    },
    {
      id: 6,
      title: '24/7 Support',
      description: 'Dedicated support team ready to help you anytime.',
      badge: 'Included',
      price: 'Free',
    },
  ];

  const getBadgeColor = (badge) => {
    const colors = {
      Popular: 'brand',
      New: 'success',
      Featured: 'accent',
      Premium: 'danger',
      Pro: 'warning',
      Included: 'success',
    };
    return colors[badge] || 'gray';
  };

  return (
    <Box py={16} id="components">
      <Container maxW="6xl">
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" mb={4}>
            {title}
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="600px" mx="auto">
            Explore our collection of modern, responsive components designed for
            production-ready applications.
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={6}
          autoRows="max-content"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              overflow="hidden"
              height="100%"
              display="flex"
              flexDirection="column"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: 'lg',
                transform: 'translateY(-8px)',
              }}
            >
              <CardHeader pb={0}>
                <HStack justify="space-between" mb={2}>
                  <Heading size="md">{product.title}</Heading>
                  <Badge colorScheme={getBadgeColor(product.badge)}>
                    {product.badge}
                  </Badge>
                </HStack>
              </CardHeader>

              <CardBody flex="1" py={4}>
                <Text color="gray.600" lineHeight="relaxed">
                  {product.description}
                </Text>
              </CardBody>

              <CardFooter pt={0} gap={3} direction="column" width="100%">
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="brand.500"
                  mb={2}
                >
                  {product.price}
                </Text>
                <Button
                  variant="solid"
                  width="100%"
                  size="sm"
                >
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default CardGrid;
