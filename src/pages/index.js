import React, { useState } from "react";
import Head from "next/head";
import { Box, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ChatInput from "src/components/chat-input";
import { useCreateChatMutation } from "src/services/api";
import toast from "react-hot-toast";
import { useAuth } from "src/hooks/use-auth";
import { useRouter } from "next/router";

const Page = () => {
  const { setInitialMessage } = useAuth();

  const router = useRouter();

  const [message, setMessage] = useState("");

  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();

  const onSendMessage = async (msg) => {
    if (!msg) return;

    const chatSubject = msg.split(" ").slice(0, 4).join(" ");

    const { data, error } = await createChat({ subject: chatSubject });
    if (error) {
      return toast("Error creating chat", { type: "error" });
    }

    setInitialMessage(msg);

    router.push(`/chat/${data.id}`);
  };

  return (
    <>
      <Head>
        <title>Overview | GPT4 Access</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Box
          sx={{ mb: 5 }}
          m="auto"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          display="flex"
        >
          <Typography variant="h3">ChatGPT-4</Typography>
        </Box>
        <Box
          sx={{ maxWidth: "50%" }}
          m="auto"
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          display="flex"
        >
          <Typography
            variant="p"
            sx={{
              textAlign: "center",
            }}
          >
            Welcome to the future of AI chatbots. ChatGPT-4 is a chatbot that uses the latest in AI
            technology to create a conversation with you. It is powered by OpenAI&apos;s GPT-4
            model, which is the largest language model ever created. It is trained on 175 billion
            parameters and 45 terabytes of text data. It is capable of generating text that is
            indistinguishable from human-written text.
          </Typography>
        </Box>
        <Box m="auto">
          <ChatInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={() => onSendMessage(message)}
            isLoading={isCreatingChat}
            disabled={isCreatingChat}
          />
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
