// ** React Imports
import { useState } from "react";

// ** MUI Import
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

// ** Icons Imports

// ** Custom Components

// ** Util Import
import { titleColor, titleColorVer2 } from "@/layouts/layoutContainer";
import { styled } from "@mui/material";

const TitleReport = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: titleColor,
  padding: theme.spacing(0,2),
}));

const CardCustomize = styled(Card)(({ theme }) => ({
  boxShadow: "0px 2px 10px 0px rgb(76,78,100,0.22)",
  borderRadius: "10px",
  padding: "0 16px  ",
}));

const colorText = "rgba(0,0,0,0.7)"

const RenderTabContent = ({ data }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{ "& .MuiTableCell-root": { py: (theme) => `${theme.spacing(1)} !important`, color: colorText } }}
          >
            <TableCell>Month</TableCell>
            <TableCell align="center">Commitment Point</TableCell>
            <TableCell align="center">Completed Point</TableCell>
            <TableCell align="right">Incomplete Point</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                "& .MuiTableCell-root": {
                  border: 0,
                  py: (theme) => `${theme.spacing(1)} !important`,
                  color: colorText,
                },
              }}
            >
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, whiteSpace: "nowrap"}}
                >
                  {row.month}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {`${row.commitment_point}`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >{`${row.complete_point}`}</Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, textAlign: "right" }}
                  color={row.incomplete_point >= 10 ? 'error' : ''}
                >
                  {row.incomplete_point}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
          <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  border: 0,
                  pt: (theme) => `${theme.spacing(3)} !important`,
                },
              }}
            >
              <TableCell>
                <Divider variant="fullWidth" sx={{margin: "16px 0"}}/>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: 24, whiteSpace: "nowrap", color: "text.primary" }}
                >
                  Total
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Divider variant="fullWidth" sx={{margin: "16px 0"}}/>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: 24
                  }}
                >
                  {data?.reduce((sum = 0, num) => sum + Number(num.commitment_point), 0)}
                </Typography>
              </TableCell>
              <TableCell>
                <Divider variant="fullWidth" sx={{margin: "16px 0"}}/>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: 24
                  }}
                >
                  {data?.reduce((sum = 0, num) => sum + Number(num.complete_point), 0)}
                </Typography>
              </TableCell>
              <TableCell>
                <Divider variant="fullWidth" sx={{margin: "16px 0"}}/>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "right",
                    fontSize: 24
                  }}
                  color="error"
                >
                   {data?.reduce((sum = 0, num) => sum + Number(num.incomplete_point), 0)}
                </Typography>
              </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TableStatistics = (props) => {
  // ** State

  const {statistics, year} = props
  const [value, setValue] = useState("google");

  return (
    <CardCustomize>
      <Stack spacing={0.5} marginY={2}>
        <TitleReport variant="h4" sx={{color: titleColorVer2}}>Summary of tasks</TitleReport>
        <TitleReport variant="body1" sx={{color: titleColorVer2}}>Summary point of tasks for 2022</TitleReport>
      </Stack>
      <TabContext value={value}>
        <TabPanel sx={{ p: 0, mb: 2.5 }} value="google">
          <RenderTabContent data={statistics} />
        </TabPanel>
      </TabContext>
    </CardCustomize>
  );
};

export default TableStatistics;
