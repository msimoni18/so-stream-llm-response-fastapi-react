import { useState } from "react";
import NoStreamResponse from "./components/NoStreamResponse";
import StreamResponseEventSource from "./components/StreamResponseEventSource";
import StreamResponseFetchEventSourcePost from "./components/StreamResponseFetchEventSourcePost";

function App() {
  const [input] = useState("What color is the sky?");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
      <p>Question: {input}</p>
      <NoStreamResponse input={input} />
      <StreamResponseEventSource input={input} />
      <StreamResponseFetchEventSourcePost input={input} />
    </div>
  );
}

export default App;
