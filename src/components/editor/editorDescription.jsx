import { useCallback } from "react";
//** MUI import
import Card from "@mui/material/Card";
//** DraftWysiwyg import
import { toolbarConfig } from "@/components/editor/editorContainer";
import ReactDraftWysiwyg from "@/core/components/react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
function EditorDescription(props) {
  const { description, setDescription, show, setIsEmpty } = props;

  const handleChangeDescription = useCallback((data) => {
    const commentData = convertToRaw(data.getCurrentContent())
    if(commentData.blocks[0].text){
      setIsEmpty(false);
    }else{
      setIsEmpty(true);
    }
    setDescription(data);
  }, []);

  return (
    <Card>
      <ReactDraftWysiwyg
        editorState={description}
        onEditorStateChange={handleChangeDescription}
        wrapperStyle ={{
          minWidth: "100%",
        }}
        editorStyle={{
          minHeight: "100px",
          padding: "1%",
          backgroundColor: "#f9f9f9",
          padding: "4px 8px",
        }}
        toolbar={toolbarConfig}
      />
    </Card>
  );
}

export default EditorDescription;
