// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// ** Icons Imports

// ** Custom Components
import {
  titleColor
} from "@/layouts/layoutContainer";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

const TitleOverview = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0, 2),
}));

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  maxHeight: 242,
  // maxHeight: 620,
  marginTop: theme.spacing(2),
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
}));

const ScrollWrapper = ({ children }) => {
  return (
    <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
      {children}
    </PerfectScrollbar>
  );
};
const CardMembers = (props) => {
  const { members } = props;
  return (
    <Card>
      {/* <CardHeader
        title="Members"
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
            color: "rgba(0,0,0,0.7)",
            fontWeight: 600,
          },
        }}
      /> */}
      <Stack mt={2}>
        <TitleOverview variant="h5" sx={{ color: "#3b4b95", }}>
          Members
        </TitleOverview>
        <TitleOverview variant="subtitle1" sx={{ color: "rgba(0,0,0,0.4)", fontSize: 15, fontWeight: 500}}>
          Members join the system
        </TitleOverview>
      </Stack>
      <ScrollWrapper>
        <CardContent sx={{py: 0}}>
          {members &&
            members.map((member, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    variant="rounded"
                    sx={{ mr: 3, width: 38, height: 38 }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ mr: 2, display: "flex", mb: 0.4, flexDirection: "column" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {member.user_name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="caption">{member.email}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </CardContent>
      </ScrollWrapper>
    </Card>
  );
};

export default CardMembers;
