import { Field, Input, VStack, Button, Text } from "@chakra-ui/react";
import { PasswordInput } from "../../Components/ui/password-input"; // Ensure this path is correct
import { useState } from "react";
import { MdAdsClick } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);

    // 1. Validation
    if (!name || !email || !password) {
      alert("Please fill in all required fields"); 
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // 2. Send Data to Backend
      // Note: We use the full URL because we haven't set up a proxy yet
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        { name, email, password, pic },
        config
      );

      // 3. Success!
      alert("Registration Successful!");
      localStorage.setItem("userInfo", JSON.stringify(data)); // Save token
      setLoading(false);
      navigate("/chats"); // Go to Chat Page

    } catch (error) {
      // 4. Error Handling
      console.error(error);
      alert("Error Occurred: " + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  return (
    <VStack gap="4" align="stretch">
      <Field.Root required>
        <Field.Label>Name</Field.Label>
        <Input 
          placeholder="Abhishek Korepilla" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
      </Field.Root>

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
        {/* We assume PasswordInput accepts onChange or passes props to underlying Input */}
        <PasswordInput 
          placeholder="Enter Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Profile URL (Optional)</Field.Label>
        <Input 
          placeholder="https://image/profile.img" 
          value={pic}
          onChange={(e) => setPic(e.target.value)}
        />
      </Field.Root>

      <Button 
        colorScheme="blue" 
        loading={loading} 
        onClick={submitHandler}
        mt={4}
      >
        <MdAdsClick /> Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;