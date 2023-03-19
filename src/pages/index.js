import React, { useState } from "react";
import Head from "next/head";
import { Box, Typography, InputBase, Divider, IconButton, Paper, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useCreateChatMutation } from "src/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import ReactLoading from "react-loading";
const Page = () => {
  const router = useRouter();

  const [message, setMessage] = useState("");

  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();

  const onStartChat = async () => {
    if (!message) return;

    const chatSubject = message.split(" ").slice(0, 3).join(" ");

    const { data, error } = await createChat({ subject: chatSubject });
    if (error) {
      return toast("Error creating chat", { type: "error" });
    }

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
          <Paper
            sx={{
              p: "4px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #e0e0e0",
              maxWidth: "50%",
              alignSelf: "center",
              margin: "auto",
              mt: 5,
            }}
          >
            <InputBase
              sx={{
                ml: 3,
                flex: 1,
              }}
              placeholder="Give your chat a subject"
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!message) return;
                  onStartChat();
                }
              }}
            />

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
              onClick={onStartChat}
              disabled={isCreatingChat || !message}
            >
              {isCreatingChat ? (
                <ReactLoading type="spin" color="#000" height={24} width={24} />
              ) : (
                <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
                  <PaperAirplaneIcon />
                </SvgIcon>
              )}
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
