import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import { SvgIcon } from "@mui/material";
import UserIcon from "@heroicons/react/24/solid/UserIcon";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();

  const handleSignOut = useCallback(() => {
    onClose?.();
    auth.signOut();
    router.push("/auth/login");
  }, [onClose, auth, router]);

  const navigate = useCallback(
    (routeName) => {
      onClose?.();
      router.push(routeName);
    },
    [onClose, router]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline"> {auth.user?.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {auth.user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate("/account");
          }}
        >
          <SvgIcon fontSize="small">
            <UserIcon />
          </SvgIcon>
          <Box sx={{ ml: 1.5 }}>Profile</Box>
        </MenuItem>
        <Divider />

        <MenuItem
          onClick={() => {
            navigate("/settings");
          }}
        >
          <SvgIcon fontSize="small">
            <CogIcon />
          </SvgIcon>
          <Box sx={{ ml: 1.5 }}>Settings</Box>
        </MenuItem>
        <Divider />

        <MenuItem onClick={handleSignOut} sx={{ mt: 1.5 }}>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
