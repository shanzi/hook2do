from rest_framework.renderers import JSONRenderer
import pusher

from .serializers import ToDoItemSerializer
from hook2do.settings import PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CHANNEL

my_pusher = pusher.Pusher(
    app_id=PUSHER_APP_ID,
    key=PUSHER_KEY,
    secret=PUSHER_SECRET,
)


def push_create_or_update(sender, instance, created, **kwargs):
    event = 'update'
    if created:
        event = 'create'
    my_pusher[PUSHER_CHANNEL].trigger(event, JSONRenderer().render(
        ToDoItemSerializer(instance).data))


def push_delete(sender, instance, **kwargs):
    my_pusher[PUSHER_CHANNEL].trigger('delete', JSONRenderer().render(
        ToDoItemSerializer(instance).data))
