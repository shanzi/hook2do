import os
import base64
from django.db import models

from todos.models import ToDoItem, ToDoItemList


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


class ResourceIdMapping(models.Model):

    owner = models.ForeignKey(ResourceChannel)
    resource_id = models.CharField(max_length=32)
    todoItem = models.ForeignKey(ToDoItem)

    def item_id(self):
        return self.owner.token + self.resource_id

    def token(self):
        return self.owner.token

    def content(self):
        return self.todoItem.content

    def status(self):
        return self.todoItem.status

    @staticmethod
    def create(token, resource_id, content):
        channel = ResourceChannel.objects.filter(token=token)
        item = channel.todoList.todos.create(content=content)
        mapping = ResourceIdMapping.objects.create(owner=channel,
                                                   resource_id=resource_id,
                                                   todoItem=item)
        return mapping

    @staticmethod
    def get(token, resource_id):
        return ResourceIdMapping.objects.get(owner__token=token,
                                             resource_id=resource_id)