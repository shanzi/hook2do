

class AppController

  showMenu: ->
    console.log 'test'
    @$mdSidenav('left').open()

  constructor: (@$mdSidenav) ->

module.exports = AppController
