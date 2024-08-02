import { useState } from "react";

interface Response {
  answer: string;
}

const NoStreamResponse = ({ input }: { input: string }) => {
  const [answer, setAnswer] = useState("");

  const handleClick = () => {
    const handleResponse = (response: Response) => {
      console.log(response);
      setAnswer(response.answer);
    };

    fetch("http://localhost:8000/nostream", {
      body: JSON.stringify({ question: input }),
      method: "POST",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => handleResponse(response))
      .catch((error) => console.error(error));
  };
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={handleClick} style={{ height: 24 }}>
          Submit question with no stream
        </button>
      </div>
      <p>Response</p>
      <div style={{ border: 1, borderStyle: "solid", height: 100 }}>
        {answer}
      </div>
    </div>
  );
};

export default NoStreamResponse;
