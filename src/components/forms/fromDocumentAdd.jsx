// ** React Imports
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

// ** MUI Imports
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PerfectScrollbarComponent from "react-perfect-scrollbar";

// ** Icons Imports
import CircularProgress from '@mui/material/CircularProgress';

// ** Styled Components
import useDebounce from "@/hooks/useDebounce";
import {
  addDescriptions,
  addFile,
  addTaskId,
  addUserId,
  resetStoreDocument,
  selectDocument,
} from "@/store/documents/documentSlice";
import { useAddDocumentMutation } from "@/store/documents/documentsApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const defaultValues = {
  descriptions: "",
  file: "",
};

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 160,
    },
  },
};

const PerfectScrollbar = styled(PerfectScrollbarComponent)(({ theme }) => ({
  maxHeight: 168,
  // maxHeight: 620,
  marginTop: theme.spacing(2),
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
}));

const ScrollWrapper = ({ children }) => {
  return (
    <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
      {children ? children : <></>}
    </PerfectScrollbar>
  );
};

const FormDocumentAdd = (props) => {
  const { setOpen } = props;
  // ** States
  const [descriptions, setDescriptions] = useState("");
  const [files, setFiles] = useState();
  const [isFiles, setIsFiles] = useState(true);
  const [loading, setLoading] = useState(false);
  const debounce = useDebounce(descriptions,500)
  const storeDocument = useAppSelector(selectDocument);
  const dispatch = useAppDispatch();
  console.log(storeDocument);
  const [addDocument, result] = useAddDocumentMutation();

  // const { data, error, isLoading} = useGetTaskParamTaskTypeIdQuery(1);

  const router = useRouter();
  const userId = router.query.userId;
  const taskId = router.query.taskId;

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if(!debounce) return;
    dispatch(addDescriptions(debounce.trim()))
  }, [debounce])

  useEffect(() => {
    if (!userId) return;
    dispatch(addUserId(userId));
    if (!taskId) return;
    dispatch(addTaskId(taskId));
  }, [userId, taskId]);

  useEffect(() => {
    if (!files) {
      return;
    }
    console.log(files);
  }, [files]);

  useEffect(() => {
    if (!files) return;
    if (storeDocument.documentFiles.length === 0) return;
    console.log(storeDocument.documentFiles.length);
    if (storeDocument.documentFiles.length !== files.length) return;
    setLoading(false)
  }, [storeDocument, files]);

  const handleChangeDescriptions = (event) => {
    setDescriptions(event.target.value);
  };

  const handleChangeFiles = (event) => {
    const filesData = event.target.files;
    if(!filesData || filesData.length === 0 ) return;
    setLoading(true);
    setIsFiles(true);
    const fileArr = [];
    for (let i = 0; i < filesData.length; i++) {
      const file = filesData[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (e) => {
        const rawLog = reader.result.split(",")[1];
        const dataSend = {
          dataReq: {
            data: rawLog,
            name: file.name,
            type: file.type,
          },
          fname: "uploadFilesToGoogleDrive",
        };

        const fetchData = await fetch(
          "https://script.google.com/macros/s/AKfycbwdfmdl8u2yD8nGKgCdHTO0qRpsj7BpjKCws6_UrBJdFjf0p0vSwap-bbtIEdfGOnCnaA/exec",
          { method: "POST", body: JSON.stringify(dataSend) }
        );
        const data = await fetchData.json();
        console.log(data);
        dispatch(addFile(data))
        fileArr.push(file);
      }
    }
    setFiles(fileArr);
  };

  const reset = () => {
    setDescriptions('')
    setFiles(undefined)
    setIsFiles(true)
    setLoading(false)
  }

  const onSubmit = () => {
    if(storeDocument.documentFiles.length === 0) {
      setIsFiles(false);
      return;
    }
    if(!descriptions) return;
    console.log(storeDocument)
    console.log('call api')
    console.log('call api')
    dispatch(resetStoreDocument())
    addDocument(storeDocument)
    reset()
    setOpen(false)
  };



  useEffect(() => {
    if (result.isError) {
      toast.error("Created documents failed");
      return;
    }
    if (result.isSuccess) {
      toast.success("Created documents successfully");
      return;
    }
  }, [result]);

  return (
    <Card sx={{ maxWidth: 500, boxShadow: "none" }}>
      {/* <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }} /> */}
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="descriptions"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <TextField
                      value={descriptions}
                      label="Decription"
                      onChange={(e) => {
                        onChange(e);
                        handleChangeDescriptions(e);
                      }}
                      placeholder="Enter decription for documents"
                      error={Boolean(errors.descriptions)}
                      aria-describedby="validation-basic-first-name"
                    />
                  )}
                />
                {errors.descriptions && (
                  <FormHelperText sx={{ color: "error.main" }} id="validation-basic-first-name">
                    *This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>

              <Button variant="contained" component="label">
                Upload Files
                <input hidden multiple type="file" onChange={handleChangeFiles} />
              </Button>


              {!isFiles && (
                <FormHelperText sx={{ color: "error.main" }} id="validation-basic-first-name">
                  *Please choose files
                </FormHelperText>
              )}
              <Box marginTop={3} minHeight={100} paddingX={1}>
                <ScrollWrapper>
                  {files &&
                    files.map((file, index) => {
                      return (
                        <Typography variant="body1" key={index}>
                          {file.name}
                        </Typography>
                      );
                    })}
                    {loading && (
                      <Stack direction='row' minHeight={100} justifyContent='center' alignItems='center'>
                        <CircularProgress />
                      </Stack>
                    )}
                </ScrollWrapper>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="center" paddingTop={3}>
                <LoadingButton
                  sx={{minWidth: 100}}
                  size="large"
                  type="submit"
                  loading={loading}
                  variant="outlined"
                  loadingIndicator="Loading…"
                >
                  Add document
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormDocumentAdd;
