import React, { useState, useEffect } from "react";

import {
  Flex,
  Heading,
  Avatar,
  IconButton,
  Image,
  Tooltip,
  Button,
  useDisclosure,
  useToast,
  Input,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Radio,
  useColorMode,
} from "@chakra-ui/react";

import {
  BiDotsVerticalRounded,
  BiCommentDetail,
  BiEdit,
  BiTrash,
} from "react-icons/bi";

import {
  BsHeart,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";

import { MdOutlineReportProblem } from "react-icons/md";
import { format } from "timeago.js";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import {
  doc,
  deleteDoc,
  getFirestore,
  setDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  getDoc,
  addDoc,
  DocumentData,
  query,
  updateDoc,
} from "firebase/firestore";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

type Props = {
  posts?: {
    caption: string;
    createdAt: string;
    image: string;
    userName: string;
    userId: string;
    userPfp: string;
    id: string;
  };
};

const Post = (props: Props) => {
  const {
    isOpen: isEditOpen,
    onOpen: onCommentOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const cancelRef = React.useRef();
  const db = getFirestore(app);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const deletePost = async () => {
    setLoading(true);
    await deleteDoc(doc(db, "posts", props?.posts?.id as string))
      .then(() => {
        setLoading(false);
        onClose();
        toast({
          title: "Success",
          description: "Post deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
};
