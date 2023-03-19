import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ChatInput from "src/components/chat-input";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/use-auth";

const Page = () => {
  const router = useRouter();
  const { initialMessage, setInitialMessage } = useAuth();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (msg) => {
    if (!msg) return;
  };

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      setInitialMessage(null);
    }
  }, [initialMessage, setInitialMessage]);

  return (
    <>
      <Head>
        <title>Chat | GPT4 Access</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Box m="auto">
          <ChatInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={() => onSendMessage(message)}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
