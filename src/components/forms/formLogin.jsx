// ** React Imports
import { useRouter } from "next/router";
import { forwardRef, useState } from "react";

// ** MUI Imports
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
// ** Third Party Imports
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// ** Icons Imports
import { useLazyGetLoginQuery } from "@/store/users/usersApi";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Styled Components
const defaultValues = {
  email: "",
  password: "",
};

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const router = useRouter();
  const [getLoginQuery] = useLazyGetLoginQuery();
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    setLoginFailed(false);
  }
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setLoginFailed(false);
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onSubmit = () => {
    login(email, password);
  };

  const login = async (email, password) => {
    const res = await getLoginQuery({ email, password });
    if (res.isError) {
      toast.success("Erorr Login from server");
      return;
    }
    const user = res.data.users[0];
    if (!user) {
      setLoginFailed(true);
      return;
    }
    localStorage.setItem('user',JSON.stringify(user))
    toast.success('Login successfully!')
    router.replace(`/${user.id}/overviews`)
  };

  return (
    <Card
      sx={{ width: 460, height: "auto", boxShadow: "0 2px 8px 0 rgba(76,78,100,0.22)", zIndex: 1 }}
    >
      <CardContent sx={{ px: 6 }}>
        <Box component="div" display="flex" justifyContent="center" paddingY={2}>
          <Typography variant="h3" color="primary" fontFamily="fantasy">
            LQA'S SMTASKS
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, letterSpacing: "0.18px", color: "rgba(0,0,0,0.6)" }}
          >
            {`Welcome to LQA'S SMTASKS! 👋🏻`}
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "13.6px" }}>
            Please sign-in to your account and start the adventure
          </Typography>
        </Box>

        {loginFailed && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Login failed! Incorrect email or password!
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type="email"
                      value={email}
                      label="Email"
                      onChange={(event) => {
                        onChange(event);
                        handleChangeEmail(event);
                      }}
                      error={Boolean(errors.email)}
                      placeholder="youremail@gmail.com"
                      aria-describedby="validation-basic-email"
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: "error.main" }} id="validation-basic-email">
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="validation-basic-password" error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={password}
                      label="Password"
                      onChange={(event) => {
                        onChange(event);
                        handleChangePassword(event);
                      }}
                      id="validation-basic-password"
                      error={Boolean(errors.password)}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: "error.main" }} id="validation-basic-password">
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} marginBottom={4}>
              <Button fullWidth size="large" type="submit" variant="contained">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
