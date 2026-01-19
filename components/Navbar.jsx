import React, { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  useColorModeValue,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Components', href: '#components' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <Box bg={navBg} py={4} boxShadow="sm" position="sticky" top={0} zIndex={100}>
      <Container maxW="7xl">
        <Flex justify="space-between" align="center">
          {/* Logo */}
          <Flex align="center" gap={2}>
            <Box
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, brand.500, accent.500)"
              bgClip="text"
            >
              ModernUI
            </Box>
          </Flex>

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={8} display={{ base: 'none', md: 'flex' }} align="center">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                as="a"
                href={link.href}
                color={textColor}
                _hover={{ color: 'brand.500' }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          {/* Actions */}
          <Flex gap={2} align="center">
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle color mode"
            />

            <Button
              variant="solid"
              size="sm"
              display={{ base: 'none', md: 'flex' }}
            >
              Get Started
            </Button>

            <IconButton
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
            />
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={8}>
            <Stack spacing={4}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  as="a"
                  href={link.href}
                  justifyContent="flex-start"
                  fontSize="lg"
                  onClick={onClose}
                >
                  {link.label}
                </Button>
              ))}
              <Button variant="solid" width="full">
                Get Started
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
