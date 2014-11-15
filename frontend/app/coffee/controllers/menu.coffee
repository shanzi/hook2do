
class MenuController
  @currentID: -1

  showList: (id) ->
    @currentID = id
    @$location.path("/lists/#{id}")

  showInbox: ->
    @currentID = -1

  showSnoozed: ->
    @currentID = -2

  showDone: ->
    @currentID = -3

  isSelected: (id) ->
    @currentID == id

  saveList: (listitem) ->
    if listitem.name.trim()
      listitem.$update()
    else
      listitem.name = listitem.name.trim()
      @$todoManager.deleteList(listitem)
      if @lists.length
        last = _.last(@lists)
        @$location.path("/lists/#{last.id}")
        @currentID = last.id
      else
        @$location.path('/inbox')

  addList: ->
    @$todoManager.createList name:'unamed list', (newlist) =>
      @currentID = newlist.id
      @$location.path("/lists/#{newlist.id}")
      newlist.name = ""
      focusInput = =>
        $("#list-id-#{newlist.id}").focus()
      setTimeout focusInput, 100

  selectItem: ->
    path = @$location.path()
    if path.match /^\/inbox/
      @currentID = -1
    else if path.match /^\/snoozed/
      @currentID = -2
    else if path.match /^\/done/
      @currentID = -3
    else
      match = path.match /^\/lists\/(\d+)\/?$/
      if match
        id = match[1]
        @currentID = parseInt(id)
      else
        @$location.path('/inbox')

  constructor: (@$rootScope, @$todoManager, @$location) ->
    @lists = @$todoManager.getLists()
    @$rootScope.$on '$locationChangeSuccess', => @selectItem()

module.exports = MenuController
