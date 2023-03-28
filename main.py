import openai, jsonpickle, json
from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
import os, uuid

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
model = "gpt-4" # "gpt-3.5-turbo" # "gpt-4-32k"

def saveResponse(request, response):
    unique = uuid.uuid4();
    f = open(f"response-{unique}.txt", "w")
    f.write(request)
    f.write("\n")
    f.write(response)
    f.close()

@app.route('/start', methods=['POST'])
@cross_origin()
def start():
    print("Call openai GPT")
    storyType = request.json.get("storyType")
    openai.api_key = request.json.get("apiKey")
    chat = openai.ChatCompletion.create(
          model=model,
          messages=[
                {"role": "user", "content": "write a page of a " + storyType + " story, and at the end give me 3 choices to continue the story"},
            ]
    )
    print("Call returned")
    print(chat)
    story = chat.choices[0].message.content
    saveResponse(storyType, story)
    return Response(response=jsonpickle.encode({'status': 'ok', 'story': story}), status=200, mimetype="application/json")

@app.route('/continue', methods=['POST'])
@cross_origin()
def expand():
    print("Call openai GPT")
    storyType = request.json.get("storyType")
    openai.api_key = request.json.get("apiKey")
    story = request.json.get("storyType")
    choice = request.json.get("choice")
    chat = openai.ChatCompletion.create(
          model=model,
          messages=[
                {"role": "user", "content": "write a page of a " + storyType + " story, and at the end give me 3 choices to continue the story"},
                {"role": "assistant", "content": story},
                {"role": "user", "content": choice},
            ]
    )
    print("Call returned")
    print(chat)
    story = chat.choices[0].message.content
    return Response(response=jsonpickle.encode({'status': 'ok', 'story': story}), status=200, mimetype="application/json")

@app.route('/image', methods=['POST'])
@cross_origin()
def image():
    print("Call openai GPT")
    storyType = request.json.get("storyType")
    openai.api_key = request.json.get("apiKey")
    story = request.json.get("storyType")
    chat = openai.ChatCompletion.create(
          model=model,
          messages=[
                {"role": "user", "content": "write a page of a " + storyType + " story, and at the end give me 3 choices to continue the story"},
                {"role": "assistant", "content": story},
                {"role": "user", "content": "give a prompt to generate an image which illustrate this story"},
            ]
    )
    print("Call returned")
    print(chat)
    prompt = chat.choices[0].message.content
    print("Call Dalle2")
    img = openai.Image.create(
          prompt=prompt,
          n=1,
          size="512x512"
    )
    print("Call returned")
    print(img)
    url = img["data"][0]["url"]
    return Response(response=jsonpickle.encode({'status': 'ok', 'prompt': prompt, 'url': url}), status=200, mimetype="application/json")

app.run(host="127.0.0.1", port=5003)