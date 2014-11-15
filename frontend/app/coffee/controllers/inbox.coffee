ListController = require './list'

class InboxController extends ListController
  constructor: ($todoManager) -> super($todoManager)

  listClass: 'inbox'

  todoFilter: (value, index) ->
    value.itemlist == null and value.status == 'default'


module.exports = InboxController
