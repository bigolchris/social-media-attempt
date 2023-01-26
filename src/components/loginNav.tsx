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

import { ImSearch } from "react-icons/im";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const LoginNav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  const handleLogin = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await setDoc(doc(db, "users", result?.user?.uid), {
          userName: result?.user?.displayName,
          bio: "big ol dongs",
          uid: result?.user?.uid,
          profilePic: result?.user?.photoURL,
          email: result?.user?.email,
        })
          .then(() => {
            setLoading(false);
            navigate("/");
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
};

export default LoginNav;
