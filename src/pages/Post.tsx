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
