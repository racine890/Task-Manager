debug: yes
Title: Server controller
Width: 300

Buttons.nb: 2
Button1: Start Server
Button1.id: 0
0.x: 20
0.y: 10
0.link: app/scripts/system/serve.gcs

Button2: Stop Server
Button2.id: 1
1.x: 150
1.y: 10
1.link: app/scripts/system/close.gcs

Text.nb: 1
Text1.id: 2
2.x: 150
2.y: 50

Onload: app/scripts/init.gcs
#OnDisplay: @demo

[@demo]
SetVar *arg_id 1
execute app/scripts/projects/export.gcs
end
[/@demo]