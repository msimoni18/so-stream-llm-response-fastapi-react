import { useState } from "react";
import {
  fetchEventSource,
  EventStreamContentType,
} from "@microsoft/fetch-event-source";

class FatalError extends Error {}

const StreamResponse = ({ input }: { input: string }) => {
  const [answer, setAnswer] = useState("");

  const handleClick = () => {
    fetchEventSource("http://localhost:8000/stream", {
      body: JSON.stringify({ question: input }),
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "text/event-stream",
      },

      async onopen(response) {
        console.log("onopen");
        console.log(response);

        if (
          response.ok &&
          response.headers.get("content-type") === EventStreamContentType
        ) {
          // setAnswer(response.answer)
          return; // everything's good
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          console.log("fatal error onopen");
          // client-side errors are usually non-retriable:
          // throw new FatalError();
        } else {
          console.log("another error onopen");
          // throw new RetriableError();
        }
      },
      onmessage(msg) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        console.log("onmessage");
        console.log(msg);
        if (msg.event === "FatalError") {
          throw new FatalError(msg.data);
        }
      },
      onclose() {
        console.log("onclose");
        // if the server closes the connection unexpectedly, retry:
        // throw new RetriableError();
      },
      onerror(err) {
        console.log("onerror");
        console.log(err);
        if (err instanceof FatalError) {
          throw err; // rethrow to stop the operation
        } else {
          // do nothing to automatically retry. You can also
          // return a specific retry interval here.
        }
      },
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={handleClick} style={{ height: 24 }}>
          Submit question with streaming
        </button>
      </div>
      <p>Response</p>
      <div style={{ border: 1, borderStyle: "solid", height: 100 }}>
        {answer}
      </div>
    </div>
  );
};

export default StreamResponse;
