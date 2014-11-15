from django.conf.urls import patterns, include, url

from rest_framework.routers import DefaultRouter

from .views import ResourceChannelViewSet

router = DefaultRouter()

router.register('channels', ResourceChannelViewSet, base_name='channels')

urlpatterns = patterns(
    '', 
    url(r'', include(router.urls)),
)
