appCtrl = require './controllers/app'
menuCtrl = require './controllers/menu'

todoManager = require './todomanager'

angular.module('todoApp', [
  'ngMaterial'
  #'ngRoute'
  'ngResource'

  'angular-loading-bar'
  ])

  #factory
  .factory '$todoManager', todoManager

  #controllers
  .controller 'appCtrl', appCtrl
  .controller 'menuCtrl', menuCtrl

  #configs
  .config ($resourceProvider) ->
    $resourceProvider.defaults.stripTrailingSlashes = false
  
  .config (cfpLoadingBarProvider) ->
    cfpLoadingBarProvider.includeSpinner = false

  .config ($httpProvider) ->
    csrf_token = document.querySelector('meta[name=csrf-token]').content
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token
