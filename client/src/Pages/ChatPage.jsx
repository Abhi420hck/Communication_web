import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = ChatState(); // Access Global State

  return (
    <div style={{ width: "100%" }}>
      {/* 1. Top Bar (Search & Profile) */}
      {user && <SideDrawer />}
      
      {/* 2. Main Content Area */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {/* 3. My Chats (Left Side) */}
        {user && <MyChats />}
        
        {/* 4. Chat Box (Right Side) */}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;