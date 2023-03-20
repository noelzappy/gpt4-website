import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import {
  Box,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useAuth } from "src/hooks/use-auth";
import { useGetChatsQuery, useLazyGetChatsQuery, usePaymentMutation } from "src/services/api";
import toast from "react-hot-toast";
import Script from "next/script";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon";
import socket from "src/services/socket";
import { numberFormatter } from "src/utils/number";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [navItems, setNavItems] = useState(items);

  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState(1);

  const { data: chats, isLoading, error } = useGetChatsQuery();
  const [getChats, { data: _chats }] = useLazyGetChatsQuery();
  const [paymentMade] = usePaymentMutation();

  const onBuyCredits = () => {
    if (!amount) return;

    const ref = `ref-${Math.floor(Math.random() * 1000000000 + 1)}_${user.id}`;

    const handler = PaystackPop.setup({
      key: "pk_test_d689c720e92b9e8628c8e44bd72bc21b5fc00bbf",
      email: user.email,
      amount: amount * 100,
      ref: "" + ref,
      currency: "GHS",
      onClose: function () {},
      callback: function (response) {
        const payment = {
          paymentReference: response.reference,
        };
        paymentMade(payment);
      },
    });
    handler.openIframe();
  };

  useEffect(() => {
    if (error) {
      toast("Error fetching chats", { icon: "🚨" });
    }

    if (chats) {
      const newItems = chats.results.map((chat) => {
        return {
          title: chat.subject,
          path: `/chat/${chat.id}`,
        };
      });

      setNavItems([...items, ...newItems]);
    }
  }, [error, chats]);

  useEffect(() => {
    if (_chats) {
      const newItems = _chats.results.map((chat) => {
        return {
          title: chat.subject,
          path: `/chat/${chat.id}`,
        };
      });

      setNavItems([...items, ...newItems]);
    }
  }, [_chats]);

  useEffect(() => {
    const io = socket();

    io.on("connect", () => {
      console.log("Connected to socket");
    });

    io.on(`credits-${user.id}`, (data) => {
      setOpenDialog(false);
      setUser(data);
    });
  }, []);

  useEffect(() => {
    getChats();
  }, [pathname, getChats]);

  const content = (
    <>
      <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <DialogTitle>Buy Credits</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Credits are a form of virtual currency that you can use to pay for responses from the
            ChatGPT-4. You are given free credits when you sign up. You can also buy more credits to
            be able to exceed the free limit.
          </DialogContentText>
          <br />
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount ($)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={onBuyCredits}>Purchase</Button>
        </DialogActions>
      </Dialog>
      <Scrollbar
        sx={{
          height: "85vh",
          "& .simplebar-content": {
            height: "85vh",
          },
          "& .simplebar-scrollbar:before": {
            background: "neutral.400",
          },
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box>
              <Box
                component={NextLink}
                href="/"
                sx={{
                  display: "inline-flex",
                  height: 32,
                  width: 32,
                }}
              >
                <Logo />
              </Box>
              <Box
                sx={{
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: 1,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  p: "12px",
                }}
              >
                <div>
                  <Typography color="inherit" variant="subtitle1">
                    {user?.name}
                  </Typography>
                  <Typography color="neutral.400" variant="body2">
                    GPT4 Chatbot
                  </Typography>
                </div>
                <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
                  <ChevronUpDownIcon />
                </SvgIcon>
              </Box>
            </Box>

            <Box
              component="nav"
              sx={{
                flexGrow: 1,
                px: 2,
                py: 3,
              }}
            >
              <Stack
                component="ul"
                spacing={0.5}
                sx={{
                  listStyle: "none",
                  p: 0,
                  m: 0,
                }}
              >
                {navItems.map((item, index) => {
                  const active = item.path ? pathname === item.path : false;

                  return (
                    <SideNavItem
                      active={active}
                      disabled={item.disabled}
                      external={item.external}
                      icon={item.icon}
                      key={item.id || index}
                      path={item.path}
                      title={item.title}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Scrollbar>
      <Box>
        <Box
          sx={{
            px: 2,
            py: 3,
            position: "fixed",
            bottom: 0,
            backgroundColor: "background.default",
            alignItems: "center",
            borderRadius: 1,
            justifyContent: "space-between",
            mt: 2,
            p: "12px",
            alignSelf: "center",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle2" color="neutral.500">
            CREDIT BALANCE: {numberFormatter(user?.credits || 0, 2)}
          </Typography>
          <Button
            fullWidth
            onClick={() => {
              setOpenDialog(true);
            }}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Buy More Credits
          </Button>
        </Box>
      </Box>

      <Script src="https://js.paystack.co/v1/inline.js" />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
