import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { Box, Typography, Card, Avatar } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ChatInput from "src/components/chat-input";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useGetChatQuery, useLazyGetMessagesQuery } from "src/services/api";
import ReactLoading from "react-loading";
import socket from "src/services/socket";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const router = useRouter();
  const { chatId } = router.query;
  const { user } = useAuth();

  const [getMessages, { data: allMessages, isLoading: isMessagesLoading }] =
    useLazyGetMessagesQuery();

  const { data: chat } = useGetChatQuery(chatId);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = useCallback(
    async (msg) => {
      const io = socket();

      if (!msg) return;

      const priorMessage = messages[messages.length - 2];

      const parentMessage = messages[0];

      const messageObj = {
        chat: chatId,
        message: msg.trim(),
        systemMessage: "You are ChatGPT. Answer concisely as possible",
        id: "local_message",
        sender: "user",
      };

      if (parentMessage) {
        messageObj.parentMessage = parentMessage.id;
        // messageObj.parentContent = parentMessage.message; // Disabled for testing
      }

      if (priorMessage) {
        messageObj.priorMessage = priorMessage.id;
//         messageObj.priorContent = priorMessage.message;
      }

      io.emit("message", messageObj);

      setMessages((prev) => [...prev, messageObj]);

      setMessage("");
    },
    [chatId, messages]
  );

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight + 1000,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

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
      toast(data.error, { icon: "🚨", position: "bottom-center" });

      console.log(data);
    });

    io.on("connect_error", () => {
      toast("We could not establish a connection to ChatGPT. Please try again", {
        icon: "🚨",
        position: "bottom-center",
      });
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
                  mt: 2,
                  p: 2,
                  backgroundColor: item.sender === "user" ? "#FBFBFB" : "white",
                }}
              >
                <Avatar
                  sx={{
                    cursor: "pointer",
                    height: 40,
                    width: 40,
                  }}
                  src={item.sender === "user" ? user?.avatar : "/assets/avatars/gpt.png"}
                />

                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");

                      return !inline && match ? (
                        <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {item.message}
                </ReactMarkdown>
              </Card>
            );
          })}

          {isTyping && (
            <Card
              sx={{
                mt: 1,
                p: 2,
              }}
            >
              <Typography variant="caption">{`ChatGPT is typing...`}</Typography>
            </Card>
          )}
        </Box>

        <Box m="auto">
          <ChatInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={() => onSendMessage(message)}
            isLoading={isLoading || isTyping}
            disabled={isLoading || isTyping || !chatId || !message}
          />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
