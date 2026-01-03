import {
  Box,
  Button,
  Text,
  HStack,
  Input,
  Spinner,
  Stack,
  Separator,
} from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../ui/menu";
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Toaster, toaster } from "../ui/toaster";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdSearch,
  MdNotifications,
  MdKeyboardArrowDown,
} from "react-icons/md";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // ✅ NEW STATE FOR PROFILE MODAL
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please enter something in search",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        `https://communication-web.onrender.com/api/user?search=${search}`,
        config
      );
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error occurred!",
        description: "Failed to load search results",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `https://communication-web.onrender.com/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
    } catch (error) {
      toaster.create({
        title: "Error fetching the chat",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        {/* SEARCH */}
        <DrawerRoot placement="start">
          <DrawerTrigger asChild>
            <Button variant="ghost">
              <MdSearch />
              <Text display={{ base: "none", md: "flex" }} px={4}>
                Search User
              </Text>
            </Button>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              <DrawerTitle>Search Users</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <HStack pb={2}>
                <Input
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </HStack>

              {loading ? (
                <Spinner />
              ) : (
                <Stack gap={2}>
                  {searchResult.map((u) => (
                    <Box
                      key={u._id}
                      onClick={() => accessChat(u._id)}
                      cursor="pointer"
                      bg="#E8E8E8"
                      _hover={{ bg: "#38B2AC", color: "white" }}
                      px={3}
                      py={2}
                      borderRadius="lg"
                    >
                      <Avatar size="sm" name={u.name} src={u.pic} />
                      <Text>{u.name}</Text>
                      <Text fontSize="xs">
                        <b>Email:</b> {u.email}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              )}

              {loadingChat && <Spinner />}
            </DrawerBody>
            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerRoot>

        {/* TITLE */}
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        {/* RIGHT MENU */}
        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost">
                <MdNotifications fontSize="2xl" />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem>No New Messages</MenuItem>
            </MenuContent>
          </MenuRoot>

          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost" p={1}>
                <Avatar size="sm" name={user.name} src={user.pic} />
                <MdKeyboardArrowDown />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onClick={() => setProfileOpen(true)}>
                My Profile
              </MenuItem>
              <Separator />
              <MenuItem onClick={logoutHandler} color="red.500">
                Logout
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>

      {/* ✅ PROFILE MODAL (OUTSIDE MENU) */}
      <ProfileModal
        user={user}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <Toaster />
    </>
  );
};

export default SideDrawer;
