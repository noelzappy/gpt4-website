import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { useUpdateProfileMutation } from "src/services/api";
import toast from "react-hot-toast";

export const AccountProfileDetails = () => {
  const { user, setUser } = useAuth();

  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();

  const [values, setValues] = useState({
    name: user?.name,
    email: user?.email,
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const vals = new FormData();

    vals.append("name", values.name);
    vals.append("email", values.email);

    const { error, data } = await updateProfile(vals);

    if (error) {
      return toast("Profile update failed.", {
        icon: "👎",
      });
    }

    setUser(data);

    toast("Profile updated successfully", {
      icon: "👍",
    });
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" disabled={updateProfileLoading} onClick={handleSubmit}>
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
