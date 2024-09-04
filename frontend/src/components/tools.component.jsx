import Code from "@editorjs/code";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
// import SimpleImage from "@editorjs/simple-image";

async function uploadFileByURL(url) {
  try {
    const settings = {
      body: JSON.stringify({ url: url }),
      headers: {
        "Content-Type": "application/JSON",
      },
      method: "POST",
    };

    const response = await fetch("http://localhost:3003/blogPosts/uploadFileByUrl", settings);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const { error } = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error uploading image by URL:", error.message);
    return {
      success: 0,
      message: error.message,
    };
  }
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3003/blogPosts/uploadFile", {
      body: formData,
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const { error } = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error uploading image by URL:", error.message);
    return {
      success: 0,
      message: error.message,
    };
  }
}

export const tools = {
  code: Code,
  embed: Embed,
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading here",
      levels: [1, 2, 3, 4, 5],
      defaultLevel: 1,
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadFileByURL,
        uploadByFile: uploadFile,
      },
    },
  },
  inlineCode: InlineCode,
  link: Link,
  list: {
    class: List,
    inlineToolbar: true,
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
};
