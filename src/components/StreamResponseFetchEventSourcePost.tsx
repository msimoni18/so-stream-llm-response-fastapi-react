import { useState, useEffect } from "react";
import {
  fetchEventSource,
  EventStreamContentType,
} from "@microsoft/fetch-event-source";

// class RetriableError extends Error {}
class FatalError extends Error {}

const StreamResponseFetchEventSourcePost = ({ input }: { input: string }) => {
  const [answer, setAnswer] = useState("");
  const [startStream, setStartStream] = useState(false);

  useEffect(() => {
    if (startStream) {
      setAnswer("");

      fetchEventSource("http://localhost:8000/stream-with-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
        async onopen(response) {
          if (
            response.ok &&
            response.headers.get("content-type") === EventStreamContentType
          ) {
            console.log("everything is good");
            return; // everything's good
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            // client-side errors are usually non-retriable:
            throw new FatalError();
          } else {
            // NOTE: This triggers for POST, but not GET. Not sure why
            console.log("retriableerror");
            // throw new RetriableError();
          }
        },
        onmessage(event) {
          // if the server emits an error message, throw an exception
          // so it gets handled by the onerror callback below:
          if (event.event === "FatalError") {
            throw new FatalError(event.data);
          }
          console.log(event);
          setAnswer((prevMessages) => prevMessages + event.data);
        },
        onclose() {
          // if the server closes the connection unexpectedly, retry:
          console.log("onclose");
          // throw new RetriableError();
        },
        onerror(err) {
          if (err instanceof FatalError) {
            throw err; // rethrow to stop the operation
          } else {
            console.log("onerror");
            // do nothing to automatically retry. You can also
            // return a specific retry interval here.
          }
        },
      });

      return () => {
        setStartStream(false);
      };
    }
  }, [startStream, input]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={() => setStartStream(true)} style={{ height: 24 }}>
          Stream with fetchEventSource (POST)
        </button>
      </div>
      <p>Response</p>
      <div style={{ border: 1, borderStyle: "solid", height: 100 }}>
        {answer}
      </div>
    </div>
  );
};

export default StreamResponseFetchEventSourcePost;
