import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import {FromLogin} from '@/components/forms'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { useCheckTasksQuery, useLazyCheckTasksQuery } from "@/store/tasks/tasksApi";

const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,
  bottom: '7%',
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '10%'
  }
}))

function Login() {
  // const [checkTasksQuery] = useLazyCheckTasksQuery();
  const {data, isLoading, isError} = useCheckTasksQuery();

  useEffect(()=>{
    if(!data) return;
  },[data])

  useEffect(()=>{
    if(isError) {
      toast.error("Error! check tasks from server");
    };
  },[isError])

  return (
    <>
      <Stack direction='row' justifyContent='center' height={'100vh'} alignItems='center' sx={{backgroundColor:"#f7f7f9"}}>
        <FromLogin />
        <MaskImg alt='mask' src={'/images/pages/auth-v1-register-mask-light.png'} sx={{zIndex: 0}}/>
      </Stack>
    </>
  );
}

export default Login;
