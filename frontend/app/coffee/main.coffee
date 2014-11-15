appCtrl = require './controllers/app'
menuCtrl = require './controllers/menu'
inboxCtrl = require './controllers/inbox'
snoozedCtrl = require './controllers/snoozed'
doneCtrl = require './controllers/done'
listCtrl = require './controllers/list'

todoManager = require './todomanager'

angular.module('todoApp', [
  'ngRoute'
  'ngMaterial'
  'ngResource'

  'angular-loading-bar'
  ])

  #factory
  .factory '$todoManager', todoManager

  #controllers
  .controller 'appCtrl', appCtrl
  .controller 'menuCtrl', menuCtrl
  .controller 'inboxCtrl', inboxCtrl
  .controller 'snoozedCtrl', snoozedCtrl
  .controller 'doneCtrl', doneCtrl
  .controller 'listCtrl', listCtrl

  #configs
  .config ($routeProvider) ->
    $routeProvider
      .when '/inbox',
        templateUrl: '/static/templates/list.html'
        controller: 'inboxCtrl'
        controllerAs: 'list'
      .when '/snoozed',
        templateUrl: '/static/templates/list.html'
        controller: 'snoozedCtrl'
        controllerAs: 'list'
      .when '/done',
        templateUrl: '/static/templates/list.html'
        controller: 'doneCtrl'
        controllerAs: 'list'
      .when '/lists/:id',
        templateUrl: '/static/templates/list.html'
        controller: 'listCtrl'
        controllerAs: 'list'
      .otherwise
        redirectTo: '/inbox'

  .config ($resourceProvider) ->
    $resourceProvider.defaults.stripTrailingSlashes = false
  
  .config (cfpLoadingBarProvider) ->
    cfpLoadingBarProvider.includeSpinner = false

  .config ($httpProvider) ->
    csrf_token = document.querySelector('meta[name=csrf-token]').content
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token
