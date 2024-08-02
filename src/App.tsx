import { useState } from "react";
import NoStreamResponse from "./components/NoStreamResponse";
import StreamResponse from "./components/StreamResponse";

function App() {
  const [input] = useState("What color is the sky?");

  return (
    <div>
      <p>Question: {input}</p>
      <hr />
      <div style={{ display: "flex", gap: 50 }}>
        <NoStreamResponse input={input} />
        <StreamResponse input={input} />
      </div>
    </div>
  );
}

export default App;
