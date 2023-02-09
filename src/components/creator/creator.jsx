import { useEffect, useState } from "react";

//** MUI import
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

//** Icon import
import { titleColor } from "@/layouts/layoutContainer";
import { useGetUserByIdQuery } from "@/store/users/usersApi";
import Avatar from "@mui/material/Avatar";

const ContentCreator = styled(Box)(({ theme }) => ({
  minWidth: "46%",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const TitleDetail = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 16,
  color: titleColor,
  paddingLeft: theme.spacing(1),
  minWidth: 100,
}));

function Creator(props) {
  const { task } = props;
  const [user, setUser] = useState();
  const { data, error, isLoading } = useGetUserByIdQuery(task?.created_by, {
    skip: task === undefined,
  });

  useEffect(() => {
    if (!data) return;
    setUser(data.users[0]);
  }, [data]);

  return (
      <Stack direction="row" alignItems="center" mt={1} spacing={2}>
        <TitleDetail variant="subtitle2">
          Creator
        </TitleDetail>
        <ContentCreator>
          <Avatar alt="Flora" src={user?.avatar} sx={{ width: 36, height: 36, marginRight: 2 }} />
          <Typography variant="body1">{user?.user_name}</Typography>
        </ContentCreator>
      </Stack>
  );
}

export default Creator;
