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
import { useNavigate } from "react-router-dom";
import { getUA } from "@firebase/util";

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
    isOpen: isCommentOpen,
    onOpen: onCommentOpen,
    onClose: onCommentClose,
  } = useDisclosure();

  const auth = getAuth(app);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
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

  const [caption, setCaption] = useState(props?.posts?.caption as string);
  const [image, setImage] = useState(props?.posts?.image);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage(app);
  const navigate = useNavigate();
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setImageUrl(URL.createObjectURL(e?.target?.files[0]));
    //@ts-ignore
    setImage(e?.target?.files[0]);
  };
  const [updateLoading, setUpdateLoading] = useState(false);
  const updatePost = async () => {
    setUpdateLoading(true);
    if (image === props?.posts?.image) {
      //@ts-ignore
      await updateDoc(doc(db, "posts", props?.posts?.id), {
        caption: caption,
        image: image,
      }).then(() => {
        setUpdateLoading(false);
        toast({
          title: "Success",
          description: "Post updated successfully",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        onEditClose();
      });
    } else {
      //@ts-ignore
      const storageRef = ref(storage, `/images/${image.name + Date.now()}`);
      //@ts-ignore
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          setUpdateLoading(false);
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              //@ts-ignore
              await updateDoc(doc(db, "posts", props?.posts?.id), {
                caption: caption,
                image: url,
              })
                .then(() => {
                  setUpdateLoading(false);
                  onEditClose();
                  toast({
                    title: "Success",
                    description: "Post updated succesfully",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                  });
                })
                .catch((err) => {
                  setUpdateLoading(false);
                  onEditClose();
                  toast({
                    title: "Error",
                    description: err?.message,
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                  });
                });
            })
            .catch((err) => {
              onEditClose();
              setUpdateLoading(false);
              toast({
                title: "Error",
                description: err?.message,
                status: "error",
                duration: 1000,
                isClosable: true,
              });
            });
        }
      );
    }
  };
  const [loadyman, setLoadyman] = useState(false);
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const reportPost = () => {
    onReportClose();
    toast({
      title: "Success",
      description: "Post reported successfully",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    onSnapshot(
      collection(db, "posts", props?.posts?.id as string, "likes"),
      //@ts-ignore
      (snapshot) => setLikes(snapshot?.docs)
    );
  }, [db, props?.posts?.id]);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    setLiked(
      likes?.findIndex((like: any) => like?.id === auth?.currentUser?.uid) !==
        -1
    );
  }, [likes]);
  const likePost = async () => {
    if (liked) {
      await deleteDoc(
        doc(
          db,
          "posts",
          props?.posts?.id as string,
          "likes",
          auth?.currentUser?.uid as string
        )
      )
        .then(() => {
          toast({
            title: "Success",
            description: "like removed successfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          props?.posts?.id as string,
          "likes",
          auth?.currentUser?.uid as string
        ),
        { username: auth?.currentUser?.displayName }
      )
        .then(() => {
          toast({
            title: "Success",
            description: "Post liked successfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    }
  };
  const [saved, setSaved] = useState(false);
  const getSavedPosts = async () => {
    const docman = await getDoc(
      doc(
        db,
        "users",
        auth?.currentUser?.uid as string,
        "savedposts",
        props?.posts?.id as string
      )
    );
    if (docman.exists()) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  };
  useEffect(() => {
    getSavedPosts();
  }, [auth?.currentUser?.uid, props?.posts?.id, db]);
  const savePost = async () => {
    if (saved) {
      await deleteDoc(
        doc(
          db,
          "users",
          auth?.currentUser?.uid as string,
          "savedposts",
          props?.posts?.id as string
        )
      )
        .then(() => {
          setSaved(false);
          toast({
            title: "Success",
            description: "Post removed from saved posts",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "users",
          auth?.currentUser?.uid as string,
          "savedposts",
          props?.posts?.id as string
        ),
        {
          caption: props?.posts?.caption,
          image: props?.posts?.image,
          createdAt: props?.posts?.createdAt,
          username: props?.posts?.userName,
          userId: props?.posts?.userId,
          userPfp: props?.posts?.userPfp,
        }
      )
        .then(() => {
          setSaved(true);
          toast({
            title: "Success",
            description: "Post saved successfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    }
  };
  type CommentType = {
    comment: string;
    userName: string;
    userPfp: string;
    userId: string;
  };

  const { colorMode } = useColorMode();
  const [comments, setComments] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
};
