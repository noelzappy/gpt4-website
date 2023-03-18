import React from "react";
import { Container, TextField } from "@mui/material";

export const ChatInput = ({ ...props }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "fixed",
        bottom: 20,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        display: "flex",
        pt: 2,
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="Type your message here..."
        {...props}
        sx={{
          width: "100%",
          maxHeight: 200,
        }}
        multiline
        rows={7}
      />
    </Container>
  );
};

export default ChatInput;
