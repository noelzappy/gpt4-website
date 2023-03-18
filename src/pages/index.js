import Head from "next/head";
import { Box, Container, TextField, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import ChatInput from "src/components/chat-input";

const Page = () => (
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
          technology to create a conversation with you. It is powered by OpenAI&apos;s GPT-4 model,
          which is the largest language model ever created. It is trained on 175 billion parameters
          and 45 terabytes of text data. It is capable of generating text that is indistinguishable
          from human-written text.
        </Typography>
      </Box>
      <ChatInput />
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
