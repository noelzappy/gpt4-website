import { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useUpdateProfileMutation } from "src/services/api";
import toast from "react-hot-toast";

export const SettingsPassword = () => {
  const [values, setValues] = useState({
    password: "",
    confirm: "",
  });

  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const val = new FormData();
    val.append("password", values.password);

    const { error } = await updateProfile(val);

    if (error) {
      return toast("Password update failed.", {
        icon: "👎",
      });
    }

    toast("Password updated successfully", {
      icon: "👍",
    });
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            <TextField
              fullWidth
              label="Password (Confirm)"
              name="confirm"
              onChange={handleChange}
              type="password"
              value={values.confirm}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="contained" disabled={updateProfileLoading} type="submit">
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
