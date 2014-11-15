(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var appCtrl, menuCtrl, todoManager;

appCtrl = require('./controllers/app');

menuCtrl = require('./controllers/menu');

todoManager = require('./todomanager');

angular.module('todoApp', ['ngMaterial', 'ngResource', 'angular-loading-bar']).factory('$todoManager', todoManager).controller('appCtrl', appCtrl).controller('menuCtrl', menuCtrl).config(function($resourceProvider) {
  return $resourceProvider.defaults.stripTrailingSlashes = false;
}).config(function(cfpLoadingBarProvider) {
  return cfpLoadingBarProvider.includeSpinner = false;
}).config(function($httpProvider) {
  var csrf_token;
  csrf_token = document.querySelector('meta[name=csrf-token]').content;
  return $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token;
});



},{"./controllers/app":2,"./controllers/menu":3,"./todomanager":4}],2:[function(require,module,exports){
var AppController;

AppController = (function() {
  AppController.prototype.showMenu = function() {
    console.log('test');
    return this.$mdSidenav('left').open();
  };

  function AppController($mdSidenav) {
    this.$mdSidenav = $mdSidenav;
  }

  return AppController;

})();

module.exports = AppController;



},{}],3:[function(require,module,exports){
var MenuController;

MenuController = (function() {
  MenuController.currentID = -1;

  function MenuController($todoManager) {
    this.$todoManager = $todoManager;
    this.lists = this.$todoManager.getLists();
  }

  MenuController.prototype.showList = function(id) {
    return this.currentID = id;
  };

  MenuController.prototype.showInbox = function() {
    return this.currentID = -1;
  };

  MenuController.prototype.showSnoozed = function() {
    return this.currentID = -2;
  };

  MenuController.prototype.showDone = function() {
    return this.currentID = -3;
  };

  MenuController.prototype.isSelected = function(id) {
    return this.currentID === id;
  };

  MenuController.prototype.saveList = function(listitem) {
    if (listitem.name.trim()) {
      return listitem.$update();
    } else {
      listitem.name = list.item.name.trim();
      return this.$todoManager.deleteList(listitem);
    }
  };

  MenuController.prototype.addList = function() {
    return this.$todoManager.createList({
      name: 'unamed list'
    }, (function(_this) {
      return function(newlist) {
        var focusInput;
        _this.currentID = newlist.id;
        newlist.name = "";
        focusInput = function() {
          return $("#list-id-" + newlist.id).focus();
        };
        return setTimeout(focusInput, 100);
      };
    })(this));
  };

  return MenuController;

})();

module.exports = MenuController;



},{}],4:[function(require,module,exports){
var RES_SETUP, TodoManager;

RES_SETUP = {
  update: {
    method: 'PATCH'
  }
};

TodoManager = (function() {
  function TodoManager($resource) {
    this.$resource = $resource;
    this._ListsRes = this.$resource('/api/lists/:id/', {
      id: '@id'
    }, RES_SETUP);
    this._TodosRes = this.$resource('/api/todos/:id/', {
      id: '@id'
    }, RES_SETUP);
  }

  TodoManager.prototype.getLists = function() {
    if (this.lists) {
      return this.lists;
    }
    this.lists = this._ListsRes.query();
    return this.lists;
  };

  TodoManager.prototype.getTodos = function() {
    if (this.todos) {
      return this.todos;
    }
    this.todos = this._TodosRes.query();
    return this.todos;
  };

  TodoManager.prototype.createList = function(listItem, callback) {
    var newList;
    newList = new this._ListsRes(listItem);
    return newList.$save((function(_this) {
      return function() {
        _this.lists.push(newList);
        if (callback) {
          return callback(newList);
        }
      };
    })(this));
  };

  TodoManager.prototype.createTodo = function(todoItem, callback) {
    var newTodo;
    newTodo = new this._TodosRes(todoItem);
    return newTodo.$save((function(_this) {
      return function() {
        _this.getTodos().then(function() {
          return _this.todos.push(newTodo);
        });
        if (callback) {
          return callback(newTodo);
        }
      };
    })(this));
  };

  TodoManager.prototype.deleteList = function(listItem) {
    var index;
    index = _.indexOf(this.lists, listItem);
    console.log(index);
    this.lists.splice(index, 1);
    console.log(this.lists);
    return listItem.$delete();
  };

  TodoManager.prototype.deleteTodo = function(todoItem) {
    this.todos = _.without(this.todos, todoItem);
    return todoItem.$delete();
  };

  return TodoManager;

})();

module.exports = function($resource) {
  return new TodoManager($resource);
};



},{}]},{},[1]);
