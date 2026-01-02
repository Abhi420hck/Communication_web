import { useEffect, useState, useRef } from "react"; // <--- 1. Import useRef
import { Box, Text, Input, IconButton, Spinner } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { toaster } from "./ui/toaster";
import { MdArrowBack } from "react-icons/md";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import "./styles.css";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
const ENDPOINT = "http://localhost:5000"; // Server URL

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // 2. Define Socket with useRef (Stable storage)
  const socket = useRef(); 
  
  const { user, selectedChat, setSelectedChat } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      
      setMessages(data);
      setLoading(false);

      // Join the room using .current
      socket.current.emit("join chat", selectedChat._id);
      
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        type: "error",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        setNewMessage(""); // Clear input immediately
        
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        // 3. Use socket.current to emit
        socket.current.emit("new message", data);
        
        setMessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: "Error Occured!",
          description: "Failed to send the Message",
          type: "error",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  // 4. Initialize Socket
  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));
  }, []);

  // 5. Message Listener
  useEffect(() => {
    // We need to use a clean listener to avoid duplicates
    const socketInstance = socket.current;
    
    socketInstance.on("message received", (newMessageRecieved) => {
      if (
        !selectedChat || // If chat is not selected or doesn't match
        selectedChat._id !== newMessageRecieved.chat._id
      ) {
         // Notification logic (optional)
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });

    // Cleanup function to turn off listener to avoid duplicates
    return () => {
      socketInstance.off("message received");
    };
  }); // Remove dependency array to listen on every render update

  useEffect(() => {
    fetchMessages();
    // Keep the backup logic for selectedChat comparison
    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<MdArrowBack />}
              onClick={() => setSelectedChat("")}
            />
            
            {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
            ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}/>
                </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Box mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;