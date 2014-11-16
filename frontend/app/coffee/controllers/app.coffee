

class AppController
  theme: 'default'
  title: ''

  showMenu: ->
    @$mdSidenav('left').open()

  changeTheme: ->
    path = @$location.path()
    if path.match /^\/inbox/
      @theme = 'default'
      @title = 'Inbox'
    else if path.match /^\/snoozed/
      @theme = 'yellow'
      @title = 'Snoozed'
    else if path.match /^\/done/
      @theme = 'green'
      @title = 'Done'
    else if path.match /^\/lists\/(\d+)\/?$/
      @theme = 'grey'
      @title = 'List'
    else
      @$location.path('/inbox')

  constructor: (@$mdSidenav, @$rootScope, @$location) ->
    @$rootScope.$on '$locationChangeSuccess', => @changeTheme()
    @$rootScope.$on '$realtimeEventReceived', => @$rootScope.$digest()

module.exports = AppController
