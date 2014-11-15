(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var appCtrl, doneCtrl, inboxCtrl, listCtrl, menuCtrl, snoozedCtrl, todoManager;

appCtrl = require('./controllers/app');

menuCtrl = require('./controllers/menu');

inboxCtrl = require('./controllers/inbox');

snoozedCtrl = require('./controllers/snoozed');

doneCtrl = require('./controllers/done');

listCtrl = require('./controllers/list');

todoManager = require('./todomanager');

angular.module('todoApp', ['ngRoute', 'ngMaterial', 'ngResource', 'angular-loading-bar']).factory('$todoManager', todoManager).controller('appCtrl', appCtrl).controller('menuCtrl', menuCtrl).controller('inboxCtrl', inboxCtrl).controller('snoozedCtrl', snoozedCtrl).controller('doneCtrl', doneCtrl).controller('listCtrl', listCtrl).config(function($routeProvider) {
  return $routeProvider.when('/inbox', {
    templateUrl: '/static/templates/list.html',
    controller: 'inboxCtrl',
    controllerAs: 'list'
  }).when('/snoozed', {
    templateUrl: '/static/templates/list.html',
    controller: 'snoozedCtrl',
    controllerAs: 'list'
  }).when('/done', {
    templateUrl: '/static/templates/list.html',
    controller: 'doneCtrl',
    controllerAs: 'list'
  }).when('/list/:id', {
    templateUrl: '/static/templates/list.html',
    controller: 'listCtrl',
    controllerAs: 'list'
  }).otherwise({
    redirectTo: '/inbox'
  });
}).config(function($resourceProvider) {
  return $resourceProvider.defaults.stripTrailingSlashes = false;
}).config(function(cfpLoadingBarProvider) {
  return cfpLoadingBarProvider.includeSpinner = false;
}).config(function($httpProvider) {
  var csrf_token;
  csrf_token = document.querySelector('meta[name=csrf-token]').content;
  return $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token;
});



},{"./controllers/app":2,"./controllers/done":3,"./controllers/inbox":4,"./controllers/list":5,"./controllers/menu":6,"./controllers/snoozed":7,"./todomanager":8}],2:[function(require,module,exports){
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
var DoneController, ListController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ListController = require('./list');

DoneController = (function(_super) {
  __extends(DoneController, _super);

  function DoneController($todoManager) {
    DoneController.__super__.constructor.call(this, $todoManager);
  }

  DoneController.prototype.listClass = 'done';

  DoneController.prototype.todoFilter = function(value, index) {
    return value.status === "archived";
  };

  return DoneController;

})(ListController);

module.exports = DoneController;



},{"./list":5}],4:[function(require,module,exports){
var InboxController, ListController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ListController = require('./list');

InboxController = (function(_super) {
  __extends(InboxController, _super);

  function InboxController($todoManager) {
    InboxController.__super__.constructor.call(this, $todoManager);
  }

  InboxController.prototype.listClass = 'inbox';

  InboxController.prototype.todoFilter = function(value, index) {
    return value.itemlist === null && value.status === 'default';
  };

  return InboxController;

})(ListController);

module.exports = InboxController;



},{"./list":5}],5:[function(require,module,exports){
var ListController;

ListController = (function() {
  ListController.prototype.listClass = 'list';

  function ListController($todoManager, $routeParams) {
    this.$todoManager = $todoManager;
    if ($routeParams) {
      this.list_id = $routeParams.id;
    }
    this.todos = this.$todoManager.getTodos();
  }

  ListController.prototype.todoFilter = function(value, index) {
    return value.itemlist === this.list_id;
  };

  ListController.prototype.saveTodo = function(todo) {
    if (todo.content.trim()) {
      todo.content = todo.content.trim();
      return todo.$update();
    } else {
      return this.$todoManager.deleteTodo(todo);
    }
  };

  ListController.prototype.addTodo = function() {
    return this.$todoManager.createTodo({
      content: 'empty todo'
    }, (function(_this) {
      return function(newTodo) {
        var focusInput;
        newTodo.content = "";
        focusInput = function() {
          return $("#todo-id-" + newTodo.id).focus();
        };
        return setTimeout(focusInput, 100);
      };
    })(this));
  };

  ListController.prototype.doneAll = function() {};

  return ListController;

})();

module.exports = ListController;



},{}],6:[function(require,module,exports){
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



},{}],7:[function(require,module,exports){
var ListController, SnoozedController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ListController = require('./list');

SnoozedController = (function(_super) {
  __extends(SnoozedController, _super);

  function SnoozedController($todoManager) {
    SnoozedController.__super__.constructor.call(this, $todoManager);
  }

  SnoozedController.prototype.listClass = 'snoozed';

  SnoozedController.prototype.todoFilter = function(value, index) {
    return value.status === 'scheduled';
  };

  return SnoozedController;

})(ListController);

module.exports = SnoozedController;



},{"./list":5}],8:[function(require,module,exports){
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
        _this.todos.unshift(newTodo);
        if (callback) {
          return callback(newTodo);
        }
      };
    })(this));
  };

  TodoManager.prototype.deleteList = function(listItem) {
    var index;
    index = _.indexOf(this.lists, listItem);
    this.lists.splice(index, 1);
    return listItem.$delete();
  };

  TodoManager.prototype.deleteTodo = function(todoItem) {
    var index;
    index = _.indexOf(this.todos, todoItem);
    this.todos.splice(index, 1);
    return todoItem.$delete();
  };

  return TodoManager;

})();

module.exports = function($resource) {
  return new TodoManager($resource);
};



},{}]},{},[1]);
