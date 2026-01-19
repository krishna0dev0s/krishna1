import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  useToast,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: 'Success!',
        description: 'Your message has been sent successfully.',
        status: 'success',
        duration: 3,
        isClosable: true,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')} id="contact">
      <Container maxW="2xl">
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" mb={4}>
            Get In Touch
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </Text>
        </Box>

        <Box
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={8}
          boxShadow="sm"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <HStack spacing={4} width="100%" gap={{ base: 4, md: 4 }}>
                <FormControl isInvalid={!!errors.name} isRequired flex="1">
                  <FormLabel fontWeight="600" mb={2}>
                    Full Name
                  </FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    size="lg"
                    borderRadius="md"
                    transition="all 0.2s ease"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.email} isRequired flex="1">
                  <FormLabel fontWeight="600" mb={2}>
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    size="lg"
                    borderRadius="md"
                    transition="all 0.2s ease"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel fontWeight="600" mb={2}>
                  Phone Number (Optional)
                </FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  size="lg"
                  borderRadius="md"
                  transition="all 0.2s ease"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.message} isRequired>
                <FormLabel fontWeight="600" mb={2}>
                  Message
                </FormLabel>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  size="lg"
                  minH="150px"
                  borderRadius="md"
                  resize="vertical"
                  transition="all 0.2s ease"
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                width="100%"
                size="lg"
                isLoading={isLoading}
                loadingText="Sending..."
              >
                Send Message
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactForm;
