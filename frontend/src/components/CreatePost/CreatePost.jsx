import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

//+ This import will be moved from here later
import parse from "html-react-parser";

function CreatePost() {
  const [createPostInputs, setCreatePostInputs] = useState({});
  const [content, setContent] = useState("");
  const [testView, setTestView] = useState("");
  const [image, setImage] = useState(null);
  const imageRef = useRef();

  function handleChange(e) {
    setCreatePostInputs({ ...createPostInputs, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setTestView(content);

    setCreatePostInputs({});
    setContent("");
    imageRef.current.value = "";
  }

  function handleEditorChange(content /*  editor */) {
    setContent(content);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input type="text" name="title" value={createPostInputs.title || ""} onChange={handleChange} />
        </label>
        <label>
          Category
          <select name="category" value={createPostInputs.category || ""} onChange={handleChange}>
            <option disabled value="">
              Choose Category
            </option>
            <option value="study-abroad">Study Abroad</option>
            <option value="stay-motivated">Stay Motivated</option>
            <option value="lifestyle-and-health">Lifestyle and Health</option>
          </select>
        </label>
        <label>
          Cover Image
          <input
            type="file"
            accept="image/*"
            name="cover-image"
            onChange={(e) => setImage(e.target.files[0])}
            ref={imageRef}
          />
          <img src={image && URL.createObjectURL(image)} width={150} alt="" />
        </label>
        <label>
          Your content
          <div className="textarea" style={{ width: "80%", margin: "0 auto" }}>
            <Editor
              apiKey="by4gzefoj0woq1ibfwdotquj6kj4eup67v9xch3kl01m9z83"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
              }}
              // initialValue="Welcome to TinyMCE!"
              value={content}
              onEditorChange={handleEditorChange}
            />
          </div>
        </label>
        <button>Create Post</button>
      </form>
      <div>{parse(testView)}</div>
    </>
  );
}

export default CreatePost;
