from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    '',
    url('', include('frontend.urls')),
    url(r'^api/', include('todos.urls')),
)
