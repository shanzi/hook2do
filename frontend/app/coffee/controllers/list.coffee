
class ListController
  listClass: 'list'

  showActions: true

  constructor: (@$todoManager, $routeParams) ->
    @list_id = parseInt($routeParams.id) if $routeParams
    @todos = @$todoManager.getTodos()

  _todoFilter: (value, index) ->
    value.itemlist == @list_id

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


module.exports = ListController
