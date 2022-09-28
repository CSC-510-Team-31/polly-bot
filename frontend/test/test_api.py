import json
from urllib import request
import pytest

from requests import Session
from http import HTTPStatus
from api import BackendClient
from unittest.mock import patch

def mock_json_resp():
    # Fixture that returns a static JSON data.
    return json.dumps({
        'message': 'test message',
        'token': 'test token',
        'room': 'test room',
        'question': 'test question',
        'options': 'test options',
        'questionData': 'test question data',
        'playerAnswer': 'test player answer',
        'analytics': 'test analytics'
    })

@patch.object(Session, 'get')
def test_ping(mock_get):
    """Given a GET request to BackendClient, return and verify the mock JSON"""
    mock_get.return_value = mock_json_resp()

    test_client = BackendClient()

    ping_msg = test_client.ping()
    assert json.loads(ping_msg)['message'] == 'test message'