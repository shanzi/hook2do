

class AppController
  theme: 'default'

  showMenu: ->
    @$mdSidenav('left').open()

  changeTheme: ->
    path = @$location.path()
    if path.match /^\/inbox/
      @theme = 'default'
    else if path.match /^\/snoozed/
      @theme = 'yellow'
    else if path.match /^\/done/
      @theme = 'green'
    else if path.match /^\/lists\/(\d+)\/?$/
      @theme = 'grey'
    else
      @$location.path('/inbox')

  constructor: (@$mdSidenav, @$rootScope, @$location) ->
    @$rootScope.$on '$locationChangeSuccess', => @changeTheme()
    @$rootScope.$on '$realtimeEventReceived', => @$rootScope.$digest()

module.exports = AppController
