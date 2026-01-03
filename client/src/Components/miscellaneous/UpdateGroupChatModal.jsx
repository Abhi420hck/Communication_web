import {
  Box,
  Button,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { MdVisibility } from "react-icons/md";
import { Avatar } from "../ui/avatar";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove someone!",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `https://communication-web.onrender.com/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      // If user removed themselves, clear selected chat
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages(); // Refresh messages
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User Already in group!",
        type: "error",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone!",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `https://communication-web.onrender.com/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `https://communication-web.onrender.com/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName(""); // clear input
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`https://communication-web.onrender.com/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <IconButton display={{ base: "flex" }} onClick={() => setOpen(true)}>
          <MdVisibility />
        </IconButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle fontSize="35px" fontFamily="Work sans" textAlign="center">
            {selectedChat.chatName}
          </DialogTitle>
        </DialogHeader>

        <DialogBody display="flex" flexDir="column" alignItems="center">
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <Box
                key={u._id}
                px={2}
                py={1}
                borderRadius="lg"
                m={1}
                mb={2}
                variant="solid"
                fontSize={12}
                backgroundColor="purple.500"
                color="white"
                cursor="pointer"
                onClick={() => handleRemove(u)}
              >
                {u.name} {user._id === u._id ? "(You)" : ""} x
              </Box>
            ))}
          </Box>

          <Stack direction="row" w="100%" mb={3}>
            <Input
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              loading={renameloading}
              onClick={handleRename}
            >
              Update
            </Button>
          </Stack>

          <Input
            placeholder="Add User to group"
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
                <Box
                    key={user._id}
                    onClick={() => handleAddUser(user)}
                    cursor="pointer"
                    bg="#E8E8E8"
                    _hover={{ background: "#38B2AC", color: "white" }}
                    w="100%"
                    display="flex"
                    alignItems="center"
                    color="black"
                    px={3}
                    py={2}
                    mb={2}
                    borderRadius="lg"
                >
                    <Avatar mr={2} size="sm" name={user.name} src={user.pic} />
                    <Box>
                        <Text>{user.name}</Text>
                        <Text fontSize="xs"><b>Email : </b>{user.email}</Text>
                    </Box>
                </Box>
            ))
          )}
        </DialogBody>

        <DialogFooter>
          <Button onClick={() => handleRemove(user)} colorScheme="red">
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default UpdateGroupChatModal;