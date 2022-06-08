let token = document.cookie.split("=")[1];

function createRequest(method, body){

    let myHeaders = new Headers();

    let myInit = {}

    if(method === "GET" || method === "DELETE"){

        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders.append('Accept', 'application/json');
        myHeaders.append('Set-Cookie', 'passPhrase=Hop');
        myHeaders.append('authorization',`Bearer ${token}`);

        myInit = { 
            method: method,
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
        };
    }else{
        console.log(JSON.stringify(body))
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('authorization',`Bearer ${token}`);

        myInit = { 
            method: method,
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(body)
        };

    }

    return myInit;
}

function reloadList(){

    while (botsList.firstChild) {
          botsList.removeChild(botsList.firstChild);
    }

    let myURL = `http://78.127.116.49:3001/bots`;

    let myInit = createRequest("GET",null);

    fetch(myURL,myInit)
    .then((httpResponse)=>{
        for(let field of httpResponse.headers){
            console.log(`raw = ${field}`);
        }	
        return httpResponse.json();
    })
    .then((setOfBots)=>{
        for(let bot of setOfBots){
            let bot_display = document.createElement("li");
            bot_display.id= `${bot.id} element`;
            bot_display.className = "bot-list-element";
            bot_display.paramId = bot.id;
            let bot_display_text = document.createElement("p");
            bot_display_text.id = `${bot.id} text`
            bot_display_text.textContent = bot.name;
            bot_display_text.className = "bot-list-element-text";
            bot_display_text.paramId = bot.id;
            bot_display.appendChild(bot_display_text);
            bot_display.addEventListener("click", selectBot);
            botsList.appendChild(bot_display);
        }
    })
    .catch((err)=>{
        console.log(`ERROR : ${err}`);
    });
}

function selectBot(event){

    let items = botsList.getElementsByTagName("li");

    for (let i=0; i<items.length; ++i){
        console.log(items[i].getElementsByTagName("p")[0].className);
        items[i].className = "bot-list-element";
        items[i].getElementsByTagName("p")[0].className = "bot-list-element-text";
    }

    event = event || window.event;
    let id = event.target.paramId;
    document.getElementById(`${id} element`).className = "bot-selected-list-element";
    document.getElementById(`${id} text`).className = "bot-selected-list-element-text";

    while (botMainDiv.firstChild) {
        botMainDiv.removeChild(botMainDiv.firstChild);
    }

    let myURL = `http://78.127.116.49:3001/bots/${id}`;

    let myInit = createRequest("GET",null);

    fetch(myURL,myInit)
    .then((httpResponse)=>{
        for(let field of httpResponse.headers){
            console.log(`raw = ${field}`);
        }	
        return httpResponse.json();
    })
    .then((bot)=>{
        
        fetch("adminPanelPage/DetailsBotSection.html")
        .then((response) => response.text())
        .then((html) => {
            botMainDiv.innerHTML = html;
            document.getElementById("botDetailsTitleText").innerHTML = bot.name;
            document.getElementById("botDetailsNameInput").value = bot.name;
            document.getElementById("botDeleteButton").paramId = id;
            document.getElementById("botDeleteButton").paramName = bot.name;
            document.getElementById("botModifyButton").paramId = id;
            document.getElementById("botDeleteButton").addEventListener("click", deleteBot);
            document.getElementById("botChatButton").addEventListener("click", (event) => {location.href = `http://78.127.116.49:3000/chat?id=${id}`});
            document.getElementById("botModifyButton").addEventListener("click", modifyBot);
        })
        .catch((error) => {
            console.warn(error);
        });

    })
    .catch((err)=>{
        console.log(`ERROR : ${err}`);
    });

}

function createBot(event){
    if((botMainDiv.firstElementChild == null) || (botMainDiv.firstElementChild.id != "createBot")){
            
        let items = botsList.getElementsByTagName("li");

        for (let i=0; i<items.length; ++i){
            console.log(items[i].getElementsByTagName("p")[0].className);
            items[i].className = "bot-list-element";
            items[i].getElementsByTagName("p")[0].className = "bot-list-element-text";
        }

        console.log("a");
        (event || window.event).preventDefault();

        fetch("adminPanelPage/CreateBotSection.html")
        .then((response) => response.text())
        .then((html) => {
            botMainDiv.innerHTML = html;
            document.getElementById("botAddButton").addEventListener("click", addBot);
            document.getElementById("botCancelAddButton").addEventListener("click", cancelAddBot);
        })
        .catch((error) => {
            console.warn(error);
        });
    }
}

function addBot(event){

    let botName = document.getElementById("botCreateNameInput").value;

    let myURL = `http://78.127.116.49:3001/bots`;

    let myInit = createRequest("POST",{name:botName});

    console.log(myInit)

    fetch(myURL,myInit)
    .then((httpResponse)=>{	
        if(httpResponse.status == 403){
            alert("Your token has expired")
            location.href = "http://78.127.116.49:3000";
        }
        return httpResponse.text();
    })
    .then((setOfBots)=>{
        reloadList();
        while (botMainDiv.firstChild) {
            botMainDiv.removeChild(botMainDiv.firstChild);
        }
    })
    .catch((err)=>{
        console.log(`ERROR : ${err}`);
    })
}

function cancelAddBot(event){
    console.log("Cancel add bot");
    while (botMainDiv.firstChild) {
        botMainDiv.removeChild(botMainDiv.firstChild);
    }
}

function deleteBot(event){
    
    let text = `Are you sure you want to delete ${event.target.paramName} ?`;

    if(confirm(text)){
        
        let myURL = `http://78.127.116.49:3001/bots/${event.target.paramId}`;

        let myInit = createRequest("DELETE",null);

        fetch(myURL,myInit)
        .then((httpResponse)=>{
            if(httpResponse.status == 403){
                alert("Your token has expired")
                location.href = "http://78.127.116.49:3000";
            }
            return httpResponse.text();
        })
        .then((returnText)=>{

            console.log(returnText);

            while (botMainDiv.firstChild) {
                botMainDiv.removeChild(botMainDiv.firstChild);
            }

            reloadList();
        })
        .catch((err)=>{
            console.log(`ERROR : ${err}`);
        });
    }
}

function modifyBot(event){

    document.getElementById("botDetailsNameInput").disabled = false;

    while (botDetailsButtonsDiv.firstChild) {
        botDetailsButtonsDiv.removeChild(botDetailsButtonsDiv.firstChild);
    }

    let id = event.target.paramId;

    let bot_modify_cancel_button = document.createElement("button");
    bot_modify_cancel_button.id = "botModifyCancelButton";
    bot_modify_cancel_button.className = "bot-modify-button";
    bot_modify_cancel_button.innerHTML = "Cancel";
    bot_modify_cancel_button.paramId = id;
    bot_modify_cancel_button.addEventListener("click", selectBot);

    let bot_modify_validate_button = document.createElement("button");
    bot_modify_validate_button.id = "botModifyValidateButton";
    bot_modify_validate_button.className = "bot-modify-button";
    bot_modify_validate_button.innerHTML = "Validate";
    bot_modify_validate_button.paramId = id;
    bot_modify_validate_button.addEventListener("click", modifyValidateBot);

    botDetailsButtonsDiv.appendChild(bot_modify_cancel_button);
    botDetailsButtonsDiv.appendChild(bot_modify_validate_button);

}

function modifyValidateBot(event){

    let myURL = `http://78.127.116.49:3001/bots/${event.target.paramId}`;

    let myInit = createRequest("PATCH",{name: document.getElementById("botDetailsNameInput").value});
    fetch(myURL,myInit)
    .then((httpResponse)=>{
        if(httpResponse.status == 403){
            alert("Your token has expired")
            location.href = "http://78.127.116.49:3000";
        }
        return httpResponse.text();
    })
    .then((returnText)=>{
        console.log(returnText);
        reloadList();
        while (botMainDiv.firstChild) {
            botMainDiv.removeChild(botMainDiv.firstChild);
        }
    })
    .catch((err)=>{
        console.log(`ERROR : ${err}`);
    });
}

function sortBot(event){
    
    let str = event.target.value.toLowerCase();
    
    let items = botsList.getElementsByTagName("li");

    for (let i=0; i<items.length; ++i){
        console.log(items[i].getElementsByTagName("p")[0].innerHTML);
        console.log(items[i].getElementsByTagName("p")[0].innerHTML.includes(str));
        console.log(items[i]);
        if(items[i].getElementsByTagName("p")[0].innerHTML.toLowerCase().includes(str)){
            items[i].style.display = "flex";
        }else{
            items[i].style.display = "none";
        }
    }
}

window.addEventListener("DOMContentLoaded", (event) => {

    var botsList = document.getElementById("botsList");
    var botDetailsButtonsDiv = document.getElementById("botDetailsButtonsDiv");
    var botCreateButton = document.getElementById("botCreateButton");
    var botMainDiv = document.getElementById("botMainDiv");
    botCreateButton.addEventListener("click", createBot);
    document.getElementById("botSearchInput").addEventListener("input", sortBot);

    reloadList();
});