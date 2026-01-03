import {
  Box,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { Avatar } from "../ui/avatar";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://communication-web.onrender.com/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false); // Close Modal
      toaster.create({
        title: "New Group Chat Created!",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        type: "error",
      });
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <span onClick={() => setOpen(true)}>{children}</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle fontSize="35px" fontFamily="Work sans" textAlign="center">
            Create Group Chat
          </DialogTitle>
        </DialogHeader>

        <DialogBody display="flex" flexDir="column" alignItems="center">
          <Stack gap={4} width="100%">
            <Input
              placeholder="Chat Name"
              mb={3}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            
            <Input
              placeholder="Add Users eg: John, Jane"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Selected Users Tags */}
            <Box display="flex" flexWrap="wrap" gap={2}>
              {selectedUsers.map((u) => (
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
                  onClick={() => handleDelete(u)}
                >
                  {u.name} x
                </Box>
              ))}
            </Box>

            {/* Render Search Results */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <Box
                    key={user._id}
                    onClick={() => handleGroup(user)}
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
          </Stack>
        </DialogBody>

        <DialogFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Create Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default GroupChatModal;