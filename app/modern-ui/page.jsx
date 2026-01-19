'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import theme from '@/theme/chakra-theme';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CardGrid from '@/components/CardGrid';
import ContactForm from '@/components/ContactForm';
import ContentOrganizer from '@/components/ContentOrganizer';
import TooltipPopover from '@/components/TooltipPopover';
import LoaderSpinner from '@/components/LoaderSpinner';
import ModalDialog from '@/components/ModalDialog';

export default function ModernUIShowcase() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Card Grid */}
        <CardGrid title="Featured Components" />

        {/* Content Organizer (Tabs & Accordion) */}
        <ContentOrganizer />

        {/* Tooltip & Popover */}
        <Box py={16} bg="white" _dark={{ bg: 'gray.800' }}>
          <TooltipPopover />
        </Box>

        {/* Loaders & Spinners */}
        <LoaderSpinner />

        {/* Modal Dialog */}
        <Box py={16} bg="white" _dark={{ bg: 'gray.800' }}>
          <ModalDialog />
        </Box>

        {/* Contact Form */}
        <ContactForm />

        {/* Footer */}
        <Box
          bg="gray.900"
          color="white"
          py={12}
          textAlign="center"
          borderTop="1px solid"
          borderColor="gray.800"
        >
          <Box>
            <p>© 2024 Modern UI Showcase. Built with React, Chakra UI, and Framer Motion.</p>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
