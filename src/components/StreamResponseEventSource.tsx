import { useState, useEffect } from "react";

const StreamResponseEventSource = ({ input }: { input: string }) => {
  const [answer, setAnswer] = useState("");
  const [startStream, setStartStream] = useState(false);

  useEffect(() => {
    if (startStream) {
      setAnswer("");
      const eventSource = new EventSource(
        `http://localhost:8000/stream-with-get?question=${input}`
      );

      eventSource.onmessage = function (event) {
        console.log(event);
        setAnswer((prevAnswer) => prevAnswer + event.data);
      };

      eventSource.onerror = function (err) {
        console.error("EventSource failed.");
        console.error(err);
        eventSource.close();
      };

      return () => {
        setStartStream(false);
        eventSource.close();
      };
    }
  }, [startStream, input]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={() => setStartStream(true)} style={{ height: 24 }}>
          Stream with EventSource
        </button>
      </div>
      <p>Response</p>
      <div style={{ border: 1, borderStyle: "solid", height: 100 }}>
        {answer}
      </div>
    </div>
  );
};

export default StreamResponseEventSource;
