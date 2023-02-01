import React, { useState, useEffect } from "react";
import LoginNav from "../components/loginNav";

import {
  Button,
  Flex,
  Heading,
  Image,
  Tooltip,
  useToast,
} from "@chakra-ui/react";

import { AiOutlineFire } from "react-icons/ai";

import { app } from "../firebase";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";
