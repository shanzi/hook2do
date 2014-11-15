SnoozeDialogController = require './snooze_dialog'

class ListController
  listClass: 'list'

  showActions: true

  _todoFilter: (value, index) ->
    value.itemlist == @list_id and value.status == 'default'

  todoFilter: ->
    return (value, index) => @_todoFilter(value, index)

  saveTodo: (todo) ->
    if todo.content.trim()
      todo.content = todo.content.trim()
      todo.$update()
    else
      @$todoManager.deleteTodo(todo)

  addTodo: ->
    listid = if @list_id then @list_id else null
    @$todoManager.createTodo content:'empty todo', itemlist: listid, (newTodo)=>
      newTodo.content = ""
      focusInput = =>
        $("#todo-id-#{newTodo.id}").focus()
      setTimeout focusInput, 100

  doneAll: ->

  todoDone: (todo) ->
    if todo.status == "archived"
      if todo.due_at
        todo.status = "scheduled"
      else
        todo.status = "default"
    else
      todo.status = "archived"
    todo.$update()

  todoSnooze: (todo) ->
    @$mdDialog.show(
      templateUrl: '/static/templates/snooze_picker.html'
      controller: SnoozeDialogController
      controllerAs: 'snooze'
      ).then (answer) =>
        todo.due_at = answer
        if todo.due_at
          todo.status = "scheduled"
        else
          todo.status = "default"
        todo.$update()

  todoDelete: (todo) ->
    @$todoManager.deleteTodo(todo)

  constructor: (@$todoManager, @$mdDialog, $routeParams) ->
    @list_id = parseInt($routeParams.id) if $routeParams
    @todos = @$todoManager.getTodos()


module.exports = ListController
