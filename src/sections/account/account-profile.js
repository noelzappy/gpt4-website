import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { useUpdateProfileMutation } from "src/services/api";
import toast from "react-hot-toast";

export const AccountProfile = () => {
  const { user, setUser } = useAuth();

  const [image, setImage] = useState(user?.avatar);

  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (file) => {
    const vals = new FormData();
    vals.append("avatar", file);
    const { error, data } = await updateProfile(vals);
    if (error) {
      return toast("Image update failed.", {
        icon: "👎",
      });
    }

    setUser(data);

    toast("Image updated successfully", {
      icon: "👍",
    });
  };

  const chooseImage = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            src={image}
            sx={{
              height: 80,
              mb: 2,
              width: 80,
            }}
            onClick={chooseImage}
          />
          <input
            type="file"
            id="imageInput"
            hidden="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(URL.createObjectURL(file));
              handleSubmit(file);
            }}
          />
          <Typography gutterBottom variant="h5">
            {user?.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {user?.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};

// <CardActions>
//   <Button fullWidth variant="text" onClick={chooseImage} disabled={updateProfileLoading}>
//     Upload picture
//   </Button>
// </CardActions>;
