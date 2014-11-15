
class SnoozeDialogController
  choices: []

  answer: (answer) ->
    @$mdDialog.hide(answer)

  cancel: ->
    @$mdDialog.cancel()

  addChoice: (readable, date) ->
    @choices.push
       datetimeReadable: readable
       datetimeText: "#{date.getMonth() + 1}/#{date.getDate()} #{date.getHours()}:00"
       datetime: date

  constructor: (@$mdDialog) ->
    @choices = []
    now = new Date()

    if now.getHours() < 19
      laterToday = new Date()
      laterToday.setHours(19)
      @addChoice 'Later Today', laterToday

    tomorrow = new Date()
    tomorrow.setHours 8
    tomorrow.setDate tomorrow.getDate() + 1
    @addChoice 'Tomorrow', tomorrow

    if 1 < now.getDay() < 6
      thisWeekend = new Date()
      thisWeekend.setHours 8
      thisWeekend.setDate thisWeekend.getDate() + 6 - now.getDay()
      @addChoice 'This Weekend', thisWeekend

    nextWeek = new Date()
    nextWeek.setHours 8
    nextWeek.setDate nextWeek.getDate() + 8 - now.getDay()
    @addChoice 'Next Week', nextWeek
    
  

module.exports = SnoozeDialogController
