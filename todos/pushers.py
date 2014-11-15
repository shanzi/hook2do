from datetime import datetime

from rest_framework.renderers import JSONRenderer
import pusher

from .serializers import ToDoItemSerializer, ToDoItemListSerializer
from hook2do.settings import PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET

my_pusher = pusher.Pusher(
    app_id=PUSHER_APP_ID,
    key=PUSHER_KEY,
    secret=PUSHER_SECRET,
)


def process_data(data):
    def parse(value):
        return value.isoformat() if isinstance(value, datetime) else value
    return {k:parse(v) for k, v in data.iteritems()}

def push_create_or_update_todo(sender, instance, created, **kwargs):
    event = 'update_todo'
    if created: event = 'create_todo'
    channel = 'h2d-' + instance.owner.username
    my_pusher[channel].trigger(event, process_data(ToDoItemSerializer(instance).data))


def push_delete_todo(sender, instance, **kwargs):
    channel = 'h2d-' + instance.owner.username
    my_pusher[channel].trigger('delete_todo', process_data(ToDoItemSerializer(instance).data))


def push_create_or_update_list(sender, instance, created, **kwargs):
    event = 'update_list'
    if created: event = 'create_list'
    channel = 'h2d-' + instance.owner.username
    my_pusher[channel].trigger(event, process_data(ToDoItemListSerializer(instance).data))


def push_delete_list(sender, instance, **kwargs):
    channel = 'h2d-' + instance.owner.username
    my_pusher[channel].trigger('delete_list', process_data(ToDoItemListSerializer(instance).data))
