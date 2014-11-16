class NotificationManager

  constructor: ->
    if window.Notification and Notification.permission != 'granted'
      Notification.requestPermission (status)=>
        if Notification.status != status
          Notification.status = status

  show: (noti) ->
    if window.Notification and Notification.permission == 'granted'
      n = new Notification(noti)

module.exports = new NotificationManager()

