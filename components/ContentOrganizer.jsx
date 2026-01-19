import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckCircleIcon } from '@chakra-ui/icons';

const ContentOrganizer = () => {
  const accordionBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const panelBg = useColorModeValue('gray.50', 'gray.700');

  const faqData = [
    {
      question: 'What is Chakra UI?',
      answer:
        'Chakra UI is a React component library that provides accessible, customizable, and composable React components. It helps developers build applications faster while maintaining accessibility standards.',
    },
    {
      question: 'How do I customize the theme?',
      answer:
        'You can customize the theme using the `extendTheme` function from Chakra UI. This allows you to override colors, fonts, sizes, and component styles globally or for specific components.',
    },
    {
      question: 'Is Chakra UI responsive?',
      answer:
        'Yes! Chakra UI is built with responsiveness in mind. You can use responsive array syntax to apply different styles at different breakpoints.',
    },
    {
      question: 'Can I use Chakra UI with Next.js?',
      answer:
        'Absolutely! Chakra UI works seamlessly with Next.js. You just need to wrap your app with the ChakraProvider in your layout or _app.js file.',
    },
  ];

  const tabsData = [
    {
      label: 'Installation',
      content: `npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`,
    },
    {
      label: 'Setup',
      content: `Wrap your application with ChakraProvider in your root layout or _app.js file to enable Chakra UI styles and features globally.`,
    },
    {
      label: 'Usage',
      content: `Import components from @chakra-ui/react and use them in your JSX. Chakra components are highly composable and can be combined to create complex UIs.`,
    },
  ];

  return (
    <Box py={16} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="5xl">
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" mb={4}>
            Frequently Asked Questions & Documentation
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Find answers to common questions and learn how to get started.
          </Text>
        </Box>

        {/* Tabs Section */}
        <Box mb={16}>
          <Heading as="h3" size="lg" mb={6}>
            Getting Started Tabs
          </Heading>
          <Tabs variant="line" colorScheme="brand">
            <TabList borderBottomColor={borderColor}>
              {tabsData.map((tab) => (
                <Tab
                  key={tab.label}
                  _selected={{
                    color: 'brand.500',
                    borderBottomColor: 'brand.500',
                  }}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabsData.map((tab) => (
                <TabPanel key={tab.label} py={6}>
                  <Box
                    bg={accordionBg}
                    p={6}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <Text lineHeight="tall" fontSize="base">
                      {tab.content}
                    </Text>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>

        {/* Accordion Section */}
        <Box>
          <Heading as="h3" size="lg" mb={6}>
            FAQ Accordion
          </Heading>
          <Accordion allowToggle>
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                mb={3}
                bg={accordionBg}
                overflow="hidden"
              >
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      py={4}
                      px={6}
                      _hover={{
                        bg: panelBg,
                      }}
                      transition="background 0.2s ease"
                    >
                      <HStack spacing={3} flex="1" textAlign="left">
                        <Icon
                          as={CheckCircleIcon}
                          color="brand.500"
                          w={5}
                          h={5}
                        />
                        <Text fontWeight="600" fontSize="base">
                          {item.question}
                        </Text>
                      </HStack>
                      <ChevronDownIcon
                        transform={isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}
                        transition="transform 0.2s ease"
                      />
                    </AccordionButton>

                    <AccordionPanel bg={panelBg} pb={4} px={6}>
                      <Text color="gray.600" lineHeight="tall">
                        {item.answer}
                      </Text>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
};

export default ContentOrganizer;
