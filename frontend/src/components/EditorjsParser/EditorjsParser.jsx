import DOMPurify from "dompurify";

export default function renderBlock(block) {
  // Example allowing <span> and other necessary tags and attributes
  const cleanHtml = DOMPurify.sanitize(block.data.text, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "span", "u"],
    ALLOWED_ATTR: ["href", "target", "rel", "style"], // Allow style attribute for inline styles
  });

  switch (block.type) {
    case "header":
      if (block.data.level === 2) {
        return (
          <h2 key={block.id} style={{ textAlign: block.data.alignment || "left", marginTop: "2rem" }}>
            {block.data.text}
          </h2>
        );
      } else if (block.data.level === 3) {
        return (
          <h3 key={block.id} style={{ textAlign: block.data.alignment || "left", marginTop: "2rem" }}>
            {block.data.text}
          </h3>
        );
      } else if (block.data.level === 4) {
        return (
          <h4 key={block.id} style={{ textAlign: block.data.alignment || "left", marginTop: "2rem" }}>
            {block.data.text}
          </h4>
        );
      } else {
        return (
          <h5 key={block.id} style={{ textAlign: block.data.alignment || "left", marginTop: "2rem" }}>
            {block.data.text}
          </h5>
        );
      }

    case "paragraph":
      return (
        <p
          style={{
            color: block.data.color || "inherit", // Use block color if available
            textAlign: block.data.alignment || "left",
            lineHeight: "1.8",
            margin: "2rem 0",
            fontSize: "1.8rem",
            fontFamily: "inherit",
          }}
          key={block.id}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      );

    case "list":
      return block.data.style === "unordered" ? (
        <ul style={{ padding: "1rem 4rem", lineHeight: "1.8", fontSize: "1.8rem" }} key={block.id}>
          {block.data.items.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item) }} />
          ))}
        </ul>
      ) : (
        <ol style={{ padding: "1rem 4rem", lineHeight: "1.8", fontSize: "1.8rem" }} key={block.id}>
          {block.data.items.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item) }} />
          ))}
        </ol>
      );

    case "code":
      return (
        <pre key={block.id}>
          <code>{block.data.code}</code>
        </pre>
      );

    case "embed":
      return (
        <div
          key={block.id}
          style={{
            width: "100%",
            height: "40rem",
            position: "relative",
          }}
        >
          <iframe
            src={block.data.embed}
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: "0",
              right: "0",
              left: "0",
              bottom: "0",
            }}
          ></iframe>
          <p>{block.data.caption}</p>
        </div>
      );

    case "image":
      return (
        <div key={block.id}>
          <img src={block.data.file.url} alt={block.data.caption || "Image"} width={300} style={{ width: "100%" }} />
          {block.data.caption && <p>{block.data.caption}</p>}
        </div>
      );

    case "inlineCode":
      return (
        <pre key={block.id}>
          <code>{block.data.text}</code>
        </pre>
      );

    case "link":
      return (
        <a key={block.id} href={block.data.link} target="_blank" rel="noopener noreferrer">
          {block.data.text}
        </a>
      );

    case "marker":
      return <mark key={block.id}>{block.data.text}</mark>;

    case "quote":
      return (
        <blockquote key={block.id}>
          <p>{block.data.text}</p>
          <cite>{block.data.caption}</cite>
        </blockquote>
      );

    case "hyperlink":
      return (
        <a key={block.id} href={block.data.link} target="_blank" rel="noopener noreferrer">
          {block.data.text}
        </a>
      );

    case "table":
      return (
        <table key={block.id}>
          <tbody>
            {block.data.content.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    default:
      return null;
  }
}
