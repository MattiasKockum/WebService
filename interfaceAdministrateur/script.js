const server_url="http://127.0.0.1:3001"
const get_bots = 'server/bots'
const post_bot = 'server/bot'
const del_bot = 'server/bot'
const patch_bot ='server/bot'
const chat_with_bot = 'server/chat'

var chatContent=""
$(document).ready(function () {
    function api(type, api,body,next){
        $.ajax({
            type: type,
            url: `${server_url}/${api}`,
            contentType: "application/json",
            data:JSON.stringify(body)
        }).done(function(data){
           next(data)
        })
    }


    //init robot list
    api("GET", get_bots,"", function (data) {
        if (data.code == 0) {
            for(var rob of data.data.bots){
                createRobotItem(rob.id,rob.name,rob.status)
            }
        }
    })
    //create a robot item 
    function createRobotItem(id,name,status) {
        var robots = document.getElementById("robots_list")
        var robot_tr = document.createElement("tr")
        robot_tr.id = `item_${id}`
        //name 
        var robot_td_name = document.createElement("td")
        robot_td_name.id=`name_${id}`
        robot_td_name.textContent = name
        robot_td_name.style = "width:150px"
        
        var robot_td_status = document.createElement("td")
        robot_td_status.id=`status_${id}`
        robot_td_status.textContent = status==1? "on":"off"
        //operator
        var btn_group = document.createElement("div")
        btn_group.id=`btngroup_${id}`
        btn_group.className="btn_group"
        var robot_td_operator = document.createElement("td")

        var button_chat = document.createElement("button")
        button_chat.id = `chat_${id}`
        button_chat.textContent = "chat"
        button_chat.className = "btn btn-default"
        button_chat.disabled = status==1?false:true
        btn_group.append(button_chat)
        button_chat.onclick = function () {
            var curID = this.id.split('_')[1]
            var curName = document.getElementById(`name_${curID}`).textContent
            document.getElementById("chat_robot_info").textContent = `${curName}|${curID}`
        }
        //delete
        var button_del = document.createElement("button")
        button_del.id = `del_${id}`
        button_del.textContent = "delete"
        button_del.className="btn btn-default"
        btn_group.append(button_del)
        button_del.onclick = function() {
            var curID = this.id.split('_')[1]
            var item_id = `item_${curID}`
            api("DELETE", del_bot, { id: curID }, (data) => {
                if(data.code==0){
                    document.getElementById(item_id).remove();
                }
                else{
                    alert('delete failed')
                }
            })
        }  

        //mod
        var button_mod = document.createElement("button")
        button_mod.id = `mod_${id}`
        button_mod.textContent = "modify"
        button_mod.className = "btn btn-default"
        btn_group.append(button_mod)
        button_mod.onclick = function(){
            var curID = this.id.split('_')[1]
            document.getElementById("mod_robot_name").value = document.getElementById(`name_${curID}`).textContent
            $('#modRobot').modal()
        //mod robot
            document.getElementById('mod_clicked').onclick = function () {
                var robotName = document.getElementById("mod_robot_name").value
               
                api("PATCH", patch_bot, {
                    id:curID,
                    name:robotName
                }, function (data) {
                    if (data.code == 0) {
                        document.getElementById(`name_${curID}`).textContent = robotName
                        $("#modRobot .close").click()
                    }
                    else {
                        alert("create failed")
                    }
                })
            }
        }

        //switch
        var button_switch = document.createElement("button")
        button_switch.id = `switch_${id}`
        button_switch.textContent = status == 1 ? "off" : "on"
        button_switch.className="btn btn-default"
        btn_group.append(button_switch)
        button_switch.onclick = function () {
            var curID = this.id.split('_')[1]
            console.log("ucrID",curID)
            var newStatus = document.getElementById(`status_${curID}`).textContent == "on" ? 0 : 1
            api("PATCH", patch_bot, {
                id:curID,
                status:newStatus
            }, function (data) {
                if (data.code == 0) {
                    document.getElementById(`status_${curID}`).textContent = newStatus==1?'on':'off'
                    document.getElementById(`switch_${curID}`).textContent = newStatus==1?'off':'on'
                    $(`#chat_${curID}`).attr("disabled",newStatus==1?false:true);
                }
                else {
                    alert("switch failed")
                }
            })
        }

        
        robot_td_operator.append(btn_group)
        robot_tr.append(robot_td_name)
        robot_tr.append(robot_td_status)
        robot_tr.append(robot_td_operator)

        robots.append(robot_tr)
    }

    //create robot
    document.getElementById('create_clicked').addEventListener("click", function () {
        var robotName = document.getElementById("create_robot_name").value
        api("POST", post_bot, {
            name:robotName
        }, function (data) {
            if (data.code == 0) {
                createRobotItem(data.data.id,data.data.name,data.data.status)
                $("#createRobot .close").click()
            }
            else {
                alert("create failed")
            }
        })
    })
    
    //send msg
    document.getElementById("button_send").addEventListener("click", function () {
        var botInfo = document.getElementById("chat_robot_info").textContent
        var curID = botInfo.split("|")[1]
        var curName = botInfo.split("|")[0]
        var msg = document.getElementById("msg_send").value
        console.log("chat bot:",curID)
        api("POST", chat_with_bot, {
            botID:curID,
            name: "me",
            msg:msg
        }, function (data) {
            if (data.code == 0) {
                chatContent = chatContent+
                              "me："+msg+ "\r"+
                               curName+"："+data.msg +"\r"
                var content =document.getElementById("chat_content") 
                content.value = chatContent
                content.scrollTop = content.scrollHeight;            
            }
            else {
                alert("send failed:"+data.msg)
            }
        })
    })

})