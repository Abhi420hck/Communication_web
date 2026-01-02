import { Field, Input, VStack, Button } from "@chakra-ui/react";
import { PasswordInput } from "../../Components/ui/password-input";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import used for navigation
import { useState } from "react";
import { MdAdsClick } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate(); // <--- 1. Initialize Navigate
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    setLoading(true); // Start loading animation

    // 2. Validation with Return
    if (!email || !password) {
      alert("Please enter all fields");
      setLoading(false);
      return; // <--- Stop here if empty!
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // 3. Fix: Send ONLY email and password
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }, // <--- specific fields for login
        config
      );

      alert("Login Successful!");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats"); // Redirect
      
    } catch (error) {
      console.error(error);
      alert("Error Occurred: " + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  return (
    <VStack gap="4" align="stretch">
      <Field.Root required>
        <Field.Label>Email</Field.Label>
        <Input
          placeholder="me@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field.Root>

      <Field.Root required>
        <Field.Label>Password</Field.Label>
        <PasswordInput
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field.Root>

      {/* 4. Fix: Button calls submitHandler */}
      <Button 
        colorScheme="blue" 
        loading={loading} 
        onClick={submitHandler}
        mt={4}
      >
        <MdAdsClick /> Login
      </Button>

      {/* Optional: Guest User Button */}
      <Button 
        variant="outline" 
        colorPalette="red"
        onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
        }}
      >
        Get Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;