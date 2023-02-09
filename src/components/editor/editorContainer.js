import { convertToRaw, EditorState, ContentState, convertFromHTML } from "draft-js";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
const htmlToDraft = typeof window === "object" && require("html-to-draftjs").default;

export const convertStringHTMLToDraft = (stringHTML) => {
  const blocksFromHTML = htmlToDraft(stringHTML);
  // const blocksFromHTML = convertFromHTML(stringHTML);
  const contentState = ContentState.createFromBlockArray(blocksFromHTML);
  return EditorState.createWithContent(contentState);
};

export const convertDraftToStringHTML = (draftEditor) => {
  return draftToHtml(convertToRaw(draftEditor.getCurrentContent()));
};

export const toolbarConfig = {
  options: ["inline", "blockType", "fontSize", "fontFamily", "list", "textAlign", "history"],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["bold", "italic", "underline", "strikethrough", "monospace", "superscript", "subscript"],
  },
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote", "Code"],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  fontFamily: {
    options: ["Arial", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered", "ordered"],
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["left", "center", "right", "justify"],
  },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["undo", "redo"],
  },
};

export const toolbarCommentConfig = {
  options: ["inline", "list"],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["bold", "italic", "underline", "strikethrough", "monospace", "superscript", "subscript"],
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered"],
  },
};
