import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import { Box, Divider, Drawer, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useAuth } from "src/hooks/use-auth";
import { useGetChatsQuery, useLazyGetChatsQuery } from "src/services/api";
import toast from "react-hot-toast";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const { user } = useAuth();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [navItems, setNavItems] = useState(items);

  const { data: chats, isLoading, error } = useGetChatsQuery();
  const [getChats, { data: _chats }] = useLazyGetChatsQuery();

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
    getChats();
  }, [pathname, getChats]);

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
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
        <Divider sx={{ borderColor: "neutral.700" }} />
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
        <Divider sx={{ borderColor: "neutral.700" }} />
      </Box>
    </Scrollbar>
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
