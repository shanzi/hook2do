from django.template import RequestContext
from django.shortcuts import render_to_response

# Create your views here.
def home(request):
    if not request.user.is_authenticated():
        return render_to_response('home.html')
    csrfContext = RequestContext(request)
    return render_to_response('app.html', {'username': request.user.username}, csrfContext)


def signup(request):
    return render_to_response('signup.html')
