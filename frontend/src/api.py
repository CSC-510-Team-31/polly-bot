import requests as http
import os
import json

from dotenv import load_dotenv


class BackendClient(object):
    def __init__(self):
        load_dotenv()
        self.token = self.load_token()
        self.api_hostname = os.getenv("API_HOSTNAME")
        self.session = http.Session()

        self.session.headers.update({'Content-Type': 'application/json'})
        if self.token:
            self.session.headers.update({'AUTH_TOKEN': self.token})

    def load_token(self):
        if os.path.exists('.token'):
            with open('.token', 'r') as infile:
                return infile.read().strip()
        return None

    def save_token(self, token):
        with open('.token', 'w') as outfile:
            outfile.write(token)
    
    def ping(self):
        return self.session.get(self.api_hostname + "/hello")

    def createRoom(self, data):
        resp: http.Response = self.session.post(self.api_hostname + "/create-room", json.dumps(data))
        self.save_token(resp.json()['token'])
        return resp.json()['room']

    def createMCQuestion(self, data):
        resp: http.Response = self.session.post(self.api_hostname + "/create-mcq-question", json.dumps(data))
        self.save_token(resp.json()['token'])
        return (resp.json()['question'], resp.json()['options'])

    def enterRoom(self, data):
        resp: http.Response = self.session.post(self.api_hostname + "/enter-room", json.dumps(data)).json()
        self.save_token(resp.json()['token'])
        return resp.json()['questionData']

    def voteMCQuestion(self, data):
        return self.session.post(self.api_hostname + "/vote-mcq", json.dumps(data)).json()['playerAnswer']
    
    async def fetchAnalytics(self, data):
        return self.session.post(self.api_hostname + "/fetch-analytics", json.dumps(data)).json()['analytics']

if __name__ == '__main__':
    client = BackendClient()
    print(client.createRoom({'name': 'test'}))