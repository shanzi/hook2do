
class MenuController
  @currentID: -1

  constructor: (@$todoManager) ->
    @lists = @$todoManager.getLists()

  showList: (id) ->
    @currentID = id

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
      listitem.name = list.item.name.trim()
      @$todoManager.deleteList(listitem)

  addList: ->
    @$todoManager.createList name:'unamed list', (newlist) =>
      @currentID = newlist.id
      newlist.name = ""
      focusInput = =>
        $("#list-id-#{newlist.id}").focus()
      setTimeout focusInput, 100

module.exports = MenuController
