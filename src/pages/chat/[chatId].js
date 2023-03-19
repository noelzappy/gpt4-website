import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { Box, Typography, Card } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ChatInput from "src/components/chat-input";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useLazyGetMessagesQuery } from "src/services/api";
import ReactLoading from "react-loading";
import socket from "src/services/socket";

const Page = () => {
  const router = useRouter();
  const { chatId } = router.query;

  const [getMessages, { data: allMessages, isLoading: isMessagesLoading }] =
    useLazyGetMessagesQuery();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = useCallback(
    async (msg) => {
      const io = socket();

      if (!msg) return;

      const priorMessage = messages[messages.length - 1];

      const parentMessage = messages[0];

      const messageObj = {
        chat: chatId,
        message: msg,
        // systemMessage: "You are a grad school lecturer. Answer concisely as possible",
        id: "local_message",
        sender: "user",
      };

      if (parentMessage) {
        messageObj.parentMessage = parentMessage.id;
        messageObj.parentContent = parentMessage.message;
      }

      if (priorMessage) {
        messageObj.priorMessage = priorMessage.id;
        messageObj.priorContent = priorMessage.message;
      }

      io.emit("message", messageObj);

      setMessages((prev) => [...prev, messageObj]);

      setMessage("");
    },
    [chatId, messages]
  );

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    getMessages(chatId);
  }, [chatId, getMessages]);

  useEffect(() => {
    if (allMessages) {
      const newMessages = allMessages.results.map((message) => {
        return {
          ...message,
          date: new Date(message.date).toISOString(),
        };
      });

      setMessages(newMessages);
    }
  }, [allMessages]);

  useEffect(() => {
    const io = socket();

    io.on("connect", () => {
      io.emit("joinChat", { chatId });
    });

    io.on("loadingMessages", () => {
      setIsLoading(true);
    });

    io.on("stopLoadingMessages", () => {
      setIsLoading(false);
    });

    io.on("typing", () => {
      setIsTyping(true);
    });

    io.on("stopTyping", () => {
      setIsTyping(false);
    });

    io.on("joinedChat", (data) => {
      const newMessages = data;
      newMessages.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setMessages(newMessages);
    });

    io.on("message", (data) => {
      setMessages((prev) => {
        const newMessages = [...prev, data].filter((item) => item.id !== "local_message");
        newMessages.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        return newMessages;
      });
    });

    io.on("appError", (data) => {
      setIsLoading(false);
      setIsTyping(false);
      toast(data.error, { icon: "🚨" });

      console.log(data);
    });

    io.on("connect_error", () => {
      toast("We could not establish a connection to ChatGPT. Please try again");
    });

    return () => {
      io.emit("leaveChat", { chatId });
      io.disconnect();
    };
  }, [chatId]);

  return (
    <>
      <Head>
        <title>Chat | GPT4 Access</title>
      </Head>

      <Box
        sx={{ mb: 5 }}
        m="auto"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        display="flex"
      >
        {(isMessagesLoading || isLoading) && (
          <ReactLoading type="spin" color="#000" height={30} width={30} />
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Box
          sx={{ maxWidth: "80%", pb: 5 }}
          m="auto"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          {messages.map((item) => {
            return (
              <Card
                key={item.id}
                sx={{
                  mt: 1,
                  p: 2,
                }}
              >
                <Typography key={item.id}>{item.message}</Typography>
              </Card>
            );
          })}
        </Box>

        <Box m="auto">
          <ChatInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={() => onSendMessage(message)}
            isLoading={isLoading || isTyping}
            disabled={isLoading || isTyping}
          />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
