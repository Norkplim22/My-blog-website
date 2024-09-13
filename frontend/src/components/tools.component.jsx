import Code from "@editorjs/code";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
// import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import HyperLink from "editorjs-hyperlink";
import Table from "@editorjs/table";
import Underline from "@editorjs/underline";
import ChangeCase from "editorjs-change-case";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
// import NestedList from "@editorjs/nested-list";
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

    const response = await fetch(`${import.meta.env.VITE_API}/blogPosts/uploadFileByUrl`, settings);

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
    const response = await fetch(`${import.meta.env.VITE_API}/blogPosts/uploadFile`, {
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
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["textAlignment"],
  },
  code: Code,
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading here",
      levels: [2, 3, 4, 5],
      defaultLevel: 2,
      tunes: ["textAlignment"],
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
  // linkTool: LinkTool,
  list: {
    class: List,
    inlineToolbar: true,
    // tunes: ["textAlignment"],
    config: {
      defaultStyle: "ordered",
    },
  },
  marker: Marker,
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  hyperlink: {
    class: HyperLink,
    config: {
      shortcut: "CMD+L",
      target: "_blank",
      rel: "nofollow",
      availableTargets: ["_blank", "_self"],
      availableRels: ["author", "noreferrer"],
      validate: false,
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  underline: Underline,
  changeCase: {
    class: ChangeCase,
    config: {
      showLocaleOption: true, // enable locale case options
      locale: ["tr", "TR", "tr-TR"],
    },
  },
  Color: {
    class: ColorPlugin,
    config: {
      colorCollections: [
        "#EC7878",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#0070FF",
        "#03A9F4",
        "#00BCD4",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFF",
      ],
      defaultColor: "#FF1300",
      // type: "text",
      customPicker: true, // add a button to allow selecting any color
    },
  },
  textAlignment: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
    },
  },
};
