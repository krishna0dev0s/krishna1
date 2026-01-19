import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Text,
  VStack,
  HStack,
  Icon,
  Box,
  Checkbox,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';

const ModalDialog = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState('info');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');

  const modalContent = {
    info: {
      title: 'Welcome to Our Platform',
      icon: InfoIcon,
      iconColor: 'brand.500',
      description:
        'This is a comprehensive guide to get you started with our platform. Take some time to explore the features and get familiar with the interface.',
      details: [
        'Complete your profile',
        'Set up your preferences',
        'Explore all available features',
      ],
    },
    success: {
      title: 'Success!',
      icon: CheckCircleIcon,
      iconColor: 'success.500',
      description: 'Your account has been created successfully! You can now start using all the features of our platform.',
      details: [
        'Check your email for confirmation',
        'Complete your profile setup',
        'Start creating your first project',
      ],
    },
    warning: {
      title: 'Important Notice',
      icon: WarningIcon,
      iconColor: 'warning.500',
      description:
        'This action cannot be undone. Please review the information below carefully before proceeding.',
      details: [
        'This will permanently delete your data',
        'You cannot recover deleted items',
        'All associated records will be removed',
      ],
    },
  };

  const current = modalContent[modalType];

  const handleOpen = (type) => {
    setModalType(type);
    onOpen();
  };

  return (
    <Box py={16}>
      <VStack spacing={4}>
        <Button
          colorScheme="brand"
          onClick={() => handleOpen('info')}
        >
          Open Info Modal
        </Button>
        <Button
          colorScheme="success"
          onClick={() => handleOpen('success')}
        >
          Open Success Modal
        </Button>
        <Button
          colorScheme="warning"
          onClick={() => handleOpen('warning')}
        >
          Open Warning Modal
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={bgColor} borderRadius="xl" boxShadow="2xl">
          <ModalCloseButton />
          <ModalHeader pt={8}>
            <HStack spacing={3} mb={2}>
              <Icon
                as={current.icon}
                w={6}
                h={6}
                color={current.iconColor}
              />
              <Text fontSize="xl" fontWeight="bold">
                {current.title}
              </Text>
            </HStack>
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4} align="start">
              <Text color="gray.600" lineHeight="tall">
                {current.description}
              </Text>

              <VStack
                spacing={2}
                align="start"
                bg={useColorModeValue('gray.50', 'gray.700')}
                p={4}
                borderRadius="md"
                width="100%"
              >
                {current.details.map((detail, index) => (
                  <HStack key={index} spacing={3}>
                    <Box
                      w={2}
                      h={2}
                      borderRadius="full"
                      bg="brand.500"
                    />
                    <Text fontSize="sm">{detail}</Text>
                  </HStack>
                ))}
              </VStack>

              <Checkbox
                isChecked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              >
                Don't show this again
              </Checkbox>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3} pb={6}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={onClose}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ModalDialog;
