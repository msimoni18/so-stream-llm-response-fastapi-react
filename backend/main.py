import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*']
)

ollama = Ollama(
    base_url="http://localhost:11434",
    model="llama3"
)

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the "
    "answer concise."
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)

chain = (prompt | ollama | StrOutputParser())


class Question(BaseModel):
    question: str


@app.post('/nostream')
def no_stream_llm(question: Question):
    answer = chain.invoke({'input': question.question})
    print(answer)
    return {'answer': answer}


async def stream_answer(question):
    for chunk in chain.stream(question):
        print(chunk, end='', flush=True)
        yield f'data: {chunk}\n\n'
        await asyncio.sleep(0.25)


@app.get('/stream-with-get')
async def stream_response_from_llm_get(question: str):
    return StreamingResponse(stream_answer(question=question), media_type='text/event-stream')


@app.post('/stream-with-post')
async def stream_response_from_llm_post(question: Question):
    return StreamingResponse(stream_answer(question=question.question), media_type='text/event-stream')


# Stuff below not used
async def event_generator(stop):
    for i in range(stop):
        yield f"data: Message {i}\n\n"
        await asyncio.sleep(1)


@app.get("/stream3")
async def stream(stop: int):
    return StreamingResponse(event_generator(stop=stop), media_type="text/event-stream")


class Stream4(BaseModel):
    stop: int


@app.post("/stream4")
async def stream(inp: Stream4):
    return StreamingResponse(event_generator(stop=inp.stop), media_type="text/event-stream")
