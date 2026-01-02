import { Box, Center, VStack, Text, Image } from "@chakra-ui/react";
import { useState } from "react";
import Signup from "../Components/Authentication/Signup.jsx";
import Login from "../Components/Authentication/Login.jsx";
import { SegmentGroup } from "@chakra-ui/react";

const HomePage = () => {
  const [currentTab, setCurrentTab] = useState("Signup");

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        w="100%"
        maxW="420px"
        bg="white"
        p="6"
        borderRadius="lg"
        boxShadow="md"
      >
        {/* 🔹 Title + Logo */}
        <VStack spacing={2} mb={6}>
          {/* Logo (optional) */}
          <Image
            src="https://tse4.mm.bing.net/th/id/OIP.QFqJi6q-ETW-xt-7-NqKIwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"   // put logo.png inside public/
            alt="Communication Web Logo"
            boxSize="60px"
          />

          <Text fontSize="2xl" fontWeight="bold">
            Communication Web
          </Text>

          <Text fontSize="sm" color="gray.500">
            Connect • Chat • Communicate
          </Text>
        </VStack>

        {/* 🔹 Tabs */}
        <SegmentGroup.Root
          defaultValue="Signup"
          onValueChange={(e) => setCurrentTab(e.value)}
          css={{
            "--segment-indicator-bg": "colors.teal.500",
            "--segment-indicator-shadow": "shadows.md",
          }}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={["Signup", "Login"]} />
        </SegmentGroup.Root>

        {/* 🔹 Form */}
        <Box mt="6">
          {currentTab === "Login" ? <Login /> : <Signup />}
        </Box>
      </Box>
    </Center>
  );
};

export default HomePage;
