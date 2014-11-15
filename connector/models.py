import os
import base64
from django.db import models

from todos.models import ToDoItemList


class ResourceChannel(models.Model):

    TOKEN_LENGTH = 32

    todoList = models.ForeignKey(ToDoItemList)
    token = models.CharField(max_length=TOKEN_LENGTH)

    @staticmethod
    def generate_a_token():
        _token = base64.urlsafe_b64encode(os.urandom(
            ResourceChannel.TOKEN_LENGTH))[:ResourceChannel.TOKEN_LENGTH]
        return _token

    @staticmethod
    def bind_a_list(lst):
        _token = ResourceChannel.generate_a_token()
        r = ResourceChannel.objects.create(token=_token, todoList=lst)
        return r