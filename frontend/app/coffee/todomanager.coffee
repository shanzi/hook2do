RES_SETUP =
  update:
    method: 'PATCH'


class TodoManager
  constructor: (@$resource) ->
    @_ListsRes = @$resource '/api/lists/:id/', id: '@id', RES_SETUP
    @_TodosRes = @$resource '/api/todos/:id/', id: '@id', RES_SETUP

  getLists: ->
    return @lists if @lists
    @lists = @_ListsRes.query()
    return @lists

  getTodos: ->
    return @todos if @todos
    @todos = @_TodosRes.query()
    return @todos

  createList: (listItem, callback) ->
    newList = new @_ListsRes(listItem)
    newList.$save =>
      @lists.push newList
      callback(newList) if callback

  createTodo: (todoItem, callback) ->
    newTodo = new @_TodosRes(todoItem)
    newTodo.$save =>
      @getTodos().then => @todos.push(newTodo)
      callback(newTodo) if callback

  deleteList: (listItem) ->
    index = _.indexOf @lists, listItem
    console.log index
    @lists.splice index, 1
    console.log @lists
    listItem.$delete()

  deleteTodo: (todoItem) ->
    @todos = _.without @todos, todoItem
    todoItem.$delete()

module.exports = ($resource) ->
  return new TodoManager($resource)