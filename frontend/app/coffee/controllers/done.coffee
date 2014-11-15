ListController = require './list'

class DoneController extends ListController
  listClass: 'done'

  showActions: false

  _todoFilter: (value, index) ->
    value.status == "archived"

  constructor: ($todoManager, $mdDialog) -> super($todoManager, $mdDialog)


module.exports = DoneController
