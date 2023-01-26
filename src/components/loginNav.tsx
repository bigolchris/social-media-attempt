import React, { useState } from "react";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Tooltip,
  useColorMode,
  IconButton,
  useToast,
} from "@chakra-ui/react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getFirestore } from "firebase/firestore";
