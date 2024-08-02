# Stackoverflow question on streaming response from fastapi to react

Issue: Error occurs in `react` when trying to stream LLM response
from `fastapi`. The print statement in `fastapi` shows the response
is streaming, but an error is occurring in `react`.

Source:

## Initial setup

### python

Create environment from root and install packages:

`python -m venv venv`

`source venv/bin/activate`

`pip install -U -r backend/requirements.txt`

### node

Install frontend packages:

`npm install`

### ollama

Get [ollama/ollama](https://hub.docker.com/r/ollama/ollama) docker image and run, or install from [ollama.com](https://ollama.com/).

Pull a model: `ollama pull llama3`

## Run

Before running, make sure `ollama` is running.

In two separate terminals, run:

`fastapi dev backend/main.py`

`npm run dev`
