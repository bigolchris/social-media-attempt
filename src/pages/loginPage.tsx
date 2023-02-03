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

import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  useEffect(() => {
    document.title = "PLACE_HOLDER | Login";
  }, []);
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
          createdAt: serverTimestamp(),
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
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex overflow="hidden" flexDirection="column" height="100vh" width="100vw">
      <LoginNav />
      <Flex
        justifyContent="center"
        alignItems="center"
        width="100vw"
        height="73vh"
        overflow="hidden"
      >
        <Flex flexDirection="column" gap="1.4rem">
          <Flex flexDirection="column" alignItems="center">
            <Heading as="h4" size="xl">
              Make Friends
            </Heading>
            <Heading as="h4" size="xl">
              PLACE_HOLDER
            </Heading>
          </Flex>
          <Tooltip label="idk man" openDelay={350}>
            <Button
              isLoading={loading}
              leftIcon={<AiOutlineFire />}
              colorScheme="purple"
              variant="solid"
              borderRadius={24}
              size="lg"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
