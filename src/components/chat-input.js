import React from "react";
import { SvgIcon } from "@mui/material";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ReactLoading from "react-loading";

export const ChatInput = ({ disabled, onSend, isLoading, ...props }) => {
  return (
    <Paper
      component="form"
      sx={{
        p: "4px",
        position: "fixed",
        bottom: 20,
        display: "flex",
        alignItems: "center",
        width: "80%",
        border: "1px solid #e0e0e0",
        ml: 3,
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (!disabled && onSend && !isLoading) {
            onSend();
          }
        }
      }}
    >
      <InputBase
        sx={{
          ml: 3,
          flex: 1,
        }}
        placeholder="Enter your message here..."
        multiline
        maxRows={7}
        autoFocus
        {...props}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        aria-label="directions"
        onClick={onSend}
        disabled={disabled}
      >
        {isLoading ? (
          <ReactLoading type="spin" color="#000" height={24} width={24} />
        ) : (
          <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
            <PaperAirplaneIcon />
          </SvgIcon>
        )}
      </IconButton>
    </Paper>
  );
};

export default ChatInput;
