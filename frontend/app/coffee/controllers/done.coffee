ListController = require './list'

class DoneController extends ListController
  constructor: ($todoManager) -> super($todoManager)

  listClass: 'done'

  todoFilter: (value, index) ->
    value.status == "archived"


module.exports = DoneController
