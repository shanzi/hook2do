ListController = require './list'

class InboxController extends ListController
  listClass: 'inbox'

  _todoFilter: (value, index) ->
    value.itemlist == null and value.status == 'default'

  constructor: ($todoManager, $mdDialog) -> super($todoManager, $mdDialog)


module.exports = InboxController
