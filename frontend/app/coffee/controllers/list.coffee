
class ListController
  listClass: 'list'

  constructor: (@$todoManager, $routeParams) ->
    @list_id = $routeParams.id if $routeParams
    @todos = @$todoManager.getTodos()

  todoFilter: (value, index) ->
    value.itemlist == @list_id

  saveTodo: (todo) ->
    if todo.content.trim()
      todo.content = todo.content.trim()
      todo.$update()
    else
      @$todoManager.deleteTodo(todo)

  addTodo: ->
    @$todoManager.createTodo content:'empty todo', (newTodo)=>
      newTodo.content = ""
      focusInput = =>
        $("#todo-id-#{newTodo.id}").focus()
      setTimeout focusInput, 100

  doneAll: ->


module.exports = ListController
