import React from "react";
import { IconButton, Image, Text, VStack } from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const ProfileModal = ({ user, children, isOpen, onClose }) => {
  if (!user) return null;
  return (
    <DialogRoot 
      placement="center" 
      motionPreset="slide-in-bottom"
      open={isOpen}       // <--- Controlled by State
      onOpenChange={(e) => onClose && onClose()} // <--- Handle closing
    >
      {/* Only render Trigger if we have children (like the eye icon case) */}
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle fontSize="40px" fontFamily="Work sans" textAlign="center">
            {user.name}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
              Email: {user.email}
            </Text>
          </VStack>
        </DialogBody>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ProfileModal;