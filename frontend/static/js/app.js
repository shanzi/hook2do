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
  }).when('/lists/:id', {
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



},{"./controllers/app":2,"./controllers/done":3,"./controllers/inbox":4,"./controllers/list":5,"./controllers/menu":6,"./controllers/snoozed":8,"./todomanager":9}],2:[function(require,module,exports){
var AppController;

AppController = (function() {
  AppController.prototype.theme = 'default';

  AppController.prototype.showMenu = function() {
    return this.$mdSidenav('left').open();
  };

  AppController.prototype.changeTheme = function() {
    var path;
    path = this.$location.path();
    if (path.match(/^\/inbox/)) {
      return this.theme = 'default';
    } else if (path.match(/^\/snoozed/)) {
      return this.theme = 'yellow';
    } else if (path.match(/^\/done/)) {
      return this.theme = 'green';
    } else if (path.match(/^\/lists\/(\d+)\/?$/)) {
      return this.theme = 'grey';
    } else {
      return this.$location.path('/inbox');
    }
  };

  function AppController($mdSidenav, $rootScope, $location) {
    this.$mdSidenav = $mdSidenav;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$rootScope.$on('$locationChangeSuccess', (function(_this) {
      return function() {
        return _this.changeTheme();
      };
    })(this));
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

  DoneController.prototype.listClass = 'done';

  DoneController.prototype.showActions = false;

  DoneController.prototype._todoFilter = function(value, index) {
    return value.status === "archived";
  };

  function DoneController($todoManager, $mdDialog) {
    DoneController.__super__.constructor.call(this, $todoManager, $mdDialog);
  }

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

  InboxController.prototype.listClass = 'inbox';

  InboxController.prototype._todoFilter = function(value, index) {
    return value.itemlist === null && value.status === 'default';
  };

  function InboxController($todoManager, $mdDialog) {
    InboxController.__super__.constructor.call(this, $todoManager, $mdDialog);
  }

  return InboxController;

})(ListController);

module.exports = InboxController;



},{"./list":5}],5:[function(require,module,exports){
var ListController, SnoozeDialogController;

SnoozeDialogController = require('./snooze_dialog');

ListController = (function() {
  ListController.prototype.listClass = 'list';

  ListController.prototype.showActions = true;

  ListController.prototype._todoFilter = function(value, index) {
    return value.itemlist === this.list_id && value.status === 'default';
  };

  ListController.prototype.todoFilter = function() {
    return (function(_this) {
      return function(value, index) {
        return _this._todoFilter(value, index);
      };
    })(this);
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
    var listid;
    listid = this.list_id ? this.list_id : null;
    return this.$todoManager.createTodo({
      content: 'empty todo',
      itemlist: listid
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

  ListController.prototype.todoDone = function(todo) {
    if (todo.status === "archived") {
      if (todo.due_at) {
        todo.status = "scheduled";
      } else {
        todo.status = "default";
      }
    } else {
      todo.status = "archived";
    }
    return todo.$update();
  };

  ListController.prototype.todoSnooze = function(todo) {
    return this.$mdDialog.show({
      templateUrl: '/static/templates/snooze_picker.html',
      controller: SnoozeDialogController,
      controllerAs: 'snooze'
    }).then((function(_this) {
      return function(answer) {
        todo.due_at = answer;
        if (todo.due_at) {
          todo.status = "scheduled";
        } else {
          todo.status = "default";
        }
        return todo.$update();
      };
    })(this));
  };

  ListController.prototype.todoDelete = function(todo) {
    return this.$todoManager.deleteTodo(todo);
  };

  function ListController($todoManager, $mdDialog, $routeParams) {
    this.$todoManager = $todoManager;
    this.$mdDialog = $mdDialog;
    if ($routeParams) {
      this.list_id = parseInt($routeParams.id);
    }
    this.todos = this.$todoManager.getTodos();
  }

  return ListController;

})();

module.exports = ListController;



},{"./snooze_dialog":7}],6:[function(require,module,exports){
var MenuController;

MenuController = (function() {
  MenuController.currentID = -1;

  MenuController.prototype.showList = function(id) {
    this.currentID = id;
    return this.$location.path("/lists/" + id);
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
    var last;
    if (listitem.name.trim()) {
      return listitem.$update();
    } else {
      listitem.name = listitem.name.trim();
      this.$todoManager.deleteList(listitem);
      if (this.lists.length) {
        last = _.last(this.lists);
        this.$location.path("/lists/" + last.id);
        return this.currentID = last.id;
      } else {
        return this.$location.path('/inbox');
      }
    }
  };

  MenuController.prototype.addList = function() {
    return this.$todoManager.createList({
      name: 'unamed list'
    }, (function(_this) {
      return function(newlist) {
        var focusInput;
        _this.currentID = newlist.id;
        _this.$location.path("/lists/" + newlist.id);
        newlist.name = "";
        focusInput = function() {
          return $("#list-id-" + newlist.id).focus();
        };
        return setTimeout(focusInput, 100);
      };
    })(this));
  };

  MenuController.prototype.selectItem = function() {
    var id, match, path;
    path = this.$location.path();
    if (path.match(/^\/inbox/)) {
      return this.currentID = -1;
    } else if (path.match(/^\/snoozed/)) {
      return this.currentID = -2;
    } else if (path.match(/^\/done/)) {
      return this.currentID = -3;
    } else {
      match = path.match(/^\/lists\/(\d+)\/?$/);
      if (match) {
        id = match[1];
        return this.currentID = parseInt(id);
      } else {
        return this.$location.path('/inbox');
      }
    }
  };

  function MenuController($rootScope, $todoManager, $location) {
    this.$rootScope = $rootScope;
    this.$todoManager = $todoManager;
    this.$location = $location;
    this.lists = this.$todoManager.getLists();
    this.$rootScope.$on('$locationChangeSuccess', (function(_this) {
      return function() {
        return _this.selectItem();
      };
    })(this));
  }

  return MenuController;

})();

module.exports = MenuController;



},{}],7:[function(require,module,exports){
var SnoozeDialogController;

SnoozeDialogController = (function() {
  SnoozeDialogController.prototype.choices = [];

  SnoozeDialogController.prototype.answer = function(answer) {
    return this.$mdDialog.hide(answer);
  };

  SnoozeDialogController.prototype.cancel = function() {
    return this.$mdDialog.cancel();
  };

  SnoozeDialogController.prototype.addChoice = function(readable, date) {
    return this.choices.push({
      datetimeReadable: readable,
      datetimeText: "" + (date.getMonth() + 1) + "/" + (date.getDate()) + " " + (date.getHours()) + ":00",
      datetime: date
    });
  };

  function SnoozeDialogController($mdDialog) {
    var laterToday, nextWeek, now, thisWeekend, tomorrow, _ref;
    this.$mdDialog = $mdDialog;
    this.choices = [];
    now = new Date();
    if (now.getHours() < 19) {
      laterToday = new Date();
      laterToday.setHours(19);
      this.addChoice('Later Today', laterToday);
    }
    tomorrow = new Date();
    tomorrow.setHours(8);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.addChoice('Tomorrow', tomorrow);
    if ((1 < (_ref = now.getDay()) && _ref < 6)) {
      thisWeekend = new Date();
      thisWeekend.setHours(8);
      thisWeekend.setDate(thisWeekend.getDate() + 6 - now.getDay());
      this.addChoice('This Weekend', thisWeekend);
    }
    nextWeek = new Date();
    nextWeek.setHours(8);
    nextWeek.setDate(nextWeek.getDate() + 8 - now.getDay());
    this.addChoice('Next Week', nextWeek);
  }

  return SnoozeDialogController;

})();

module.exports = SnoozeDialogController;



},{}],8:[function(require,module,exports){
var ListController, SnoozedController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ListController = require('./list');

SnoozedController = (function(_super) {
  __extends(SnoozedController, _super);

  SnoozedController.prototype.listClass = 'snoozed';

  SnoozedController.prototype.showActions = false;

  SnoozedController.prototype._todoFilter = function(value, index) {
    return value.status === 'scheduled';
  };

  function SnoozedController($todoManager, $mdDialog) {
    SnoozedController.__super__.constructor.call(this, $todoManager, $mdDialog);
  }

  return SnoozedController;

})(ListController);

module.exports = SnoozedController;



},{"./list":5}],9:[function(require,module,exports){
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
