import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

//** MUI import
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
//** DraftWysiwyg import
import { toolbarCommentConfig } from "@/components/editor/editorContainer";
import ReactDraftWysiwyg from "@/core/components/react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
// import { convertToRaw, EditorState, ContentState, convertFromHTML } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// ** Component import
import { useGetUsersQuery } from "@/store/users/usersApi";

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  maxWidth: 240,
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "12px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

const CardMention = (props) => {
  const { user } = props;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt="Flora" src={user?.avatar} sx={{ width: 28, height: 28 }} />
      <MenuItemTitle>{user?.user_name}</MenuItemTitle>
    </Stack>
  );
};

function EditorComment(props) {
  const { comment, setComment, setIsEmpty } = props;
  const [users, setUsers] = useState();
  const [mentions, setMentions] = useState([]);
  const router = useRouter();
  const userId = router.query.userId;

  const { data, error, isLoading } = useGetUsersQuery();

  useEffect(() => {
    if (!userId) return;
    if (!data) return;
    setUsers(data.users);
    if (!users) return;
    const listUser = [];
    users.forEach((user, index) => {
      if(user.id !== Number(userId)){
        listUser.push({ text: <CardMention user={user} key={index}/>, value: user.user_name, url: user.id });
      }
    });
    setMentions(listUser);
  }, [data, users, userId]);

  const handleChangeComment = useCallback((data) => {
    const commentData = convertToRaw(data.getCurrentContent())
    if(commentData.blocks[0].text){
      setIsEmpty(false);
    }else{
      setIsEmpty(true);
    }
    setComment(data);
  }, []);

  return (
    <Card>
      <ReactDraftWysiwyg
        editorState={comment}
        onEditorStateChange={(data)=>handleChangeComment(data)}
        mention={{
          separator: " ",
          trigger: "@",
          suggestions: mentions,
        }}
        wrapperStyle={{
          minWidth: "100%",
        }}
        editorStyle={{
          minHeight: "160px",
          padding: "1%",
          backgroundColor: "#f9f9f9",
          padding: "4px 8px",
        }}
        toolbar={toolbarCommentConfig}
      />
    </Card>
  );
}

export default EditorComment;
