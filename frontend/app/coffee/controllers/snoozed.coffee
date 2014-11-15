ListController = require './list'

class SnoozedController extends ListController
  constructor: ($todoManager) -> super($todoManager)

  listClass: 'snoozed'

  todoFilter: (value, index) ->
    value.status == 'scheduled'


module.exports = SnoozedController
