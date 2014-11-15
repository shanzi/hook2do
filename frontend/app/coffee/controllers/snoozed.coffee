ListController = require './list'

class SnoozedController extends ListController
  listClass: 'snoozed'

  showActions: false

  _todoFilter: (value, index) ->
    value.status == 'scheduled'

  constructor: ($todoManager) -> super($todoManager)

module.exports = SnoozedController
