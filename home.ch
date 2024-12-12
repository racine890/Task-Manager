debug: yes
Title: Server controller
Width: 300

AppIcon: app/res/icon.png

Buttons.nb: 2
Buttons.foreground: #AEEEDA
Buttons.background: #120FAE
Buttons.width: 150
Buttons.size: 30

Button1: Start Server
Button1.id: 0
0.x: 25
0.y: 10
0.link: app/scripts/system/serve.gcs

Button2: Stop Server
Button2.id: 1
1.x: 173
1.y: 10
1.link: app/scripts/system/close.gcs

Text.nb: 1

Text1: Server is closed
Text1.id: 2
2.x: 150
2.y: 55

Onload: app/scripts/init.gcs