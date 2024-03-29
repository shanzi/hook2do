notification = require './notification'

RES_SETUP =
  update:
    method: 'PATCH'


class TodoManager
  constructor: (@$resource, @$rootScope) ->
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
      @todos.unshift(newTodo)
      callback(newTodo) if callback

  deleteList: (listItem) ->
    index = _.indexOf @lists, listItem
    @lists.splice index, 1
    listItem.$delete()

  deleteTodo: (todoItem) ->
    index = _.indexOf @todos, todoItem
    @todos.splice index, 1
    todoItem.$delete()

  _digest: ->
    @$rootScope.$broadcast '$realtimeEventReceived'

  createToDoEvent: (data) ->
    delayed = => @updateToDoEvent data
    _.delay delayed, 1000

  updateToDoEvent: (data) ->
    oldTodo = _.findWhere @todos, id: data.id
    if oldTodo
      oldDate = new Date(oldTodo.updated_at)
      newDate = new Date(data.updated_at)
      return if newDate <= oldDate
      for k in _.keys data
        oldTodo[k] = data[k]
      createdDate = new Date(data.created_at)
      if newDate.valueOf() - createdDate.valueOf() < 10000
        notification.show 'To-Do: ' + data.content
    else
      @todos.unshift new @_TodosRes(data)
    @_digest()

  deleteToDoEvent: (data) ->
    oldTodo = _.findWhere @todos, id: data.id
    @deleteTodo(oldTodo) if oldTodo

  createToDoListEvent: (data) ->
    delayed = => @updateToDoListEvent data
    _.delay delayed, 1000

  updateToDoListEvent: (data) ->
    oldList = _.findWhere @lists, id: data.id
    if oldList
      oldDate = new Date(oldList.updated_at)
      newDate = new Date(data.updated_at)
      return if newDate <= oldDate
      for k, v of data
        oldList[k] = v
      createdDate = new Date(data.created_at)
      if newDate.valueOf() - createdDate.valueOf() < 10000
        notification.show 'List: ' + data.content
    else
      @lists.unshift new @_ListsRes(data)
    @_digest()

  deleteToDoListEvent: (data) ->
    oldList = _.findWhere @lists, id: data.id
    @deleteList(oldList) if oldList


module.exports = ($resource, $rootScope) ->
  todoManager = new TodoManager($resource, $rootScope)

  pusher = new Pusher 'd16e07d8451c2b4af29c'
  channelname = 'h2d-' + $('meta[name=username]').attr('content')

  console.log channelname
  defaultChannel = pusher.subscribe channelname

  defaultChannel.bind 'create_todo', (data) => todoManager.createToDoEvent data
  defaultChannel.bind 'update_todo', (data) => todoManager.updateToDoEvent data
  defaultChannel.bind 'delete_todo', (data) => todoManager.deleteToDoEvent data

  defaultChannel.bind 'create_list', (data) => todoManager.createToDoListEvent data
  defaultChannel.bind 'update_list', (data) => todoManager.updateToDoListEvent data
  defaultChannel.bind 'delete_list', (data) => todoManager.deleteToDoListEvent data

  return todoManager
