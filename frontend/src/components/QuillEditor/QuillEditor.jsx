import { forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    [("bold", "italic", "underline", "strike", "blockquote")],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "color", "video"],
    [{ "code-block": true }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "code-block",
  "color",
];

const QuillEditor = forwardRef((props, ref) => <ReactQuill ref={ref} {...props} modules={modules} formats={formats} />);
QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
