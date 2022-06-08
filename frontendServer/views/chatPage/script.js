let id = (new URL(window.location.href)).searchParams.get("id");
console.log(id);
let chatContent = "";
let botName = "";

function createRequest(method, body){

    let myHeaders = new Headers();

    let myInit = {}

    if(method === "GET" || method === "DELETE"){

        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders.append('Accept', 'application/json');
        myHeaders.append('Set-Cookie', 'passPhrase=Hop');

        myInit = { 
            method: method,
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
        };
    }else{
        console.log(JSON.stringify(body))
        myHeaders.append('Content-Type', 'application/json');

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


function sendMessage(event){
    let msg = document.getElementById("msg_send").value

    let myURL = `http://78.127.116.49:3001/chat/${id}`;

    let myInit = createRequest("POST",{msg:msg, user:"me"});

    console.log(myInit);

    fetch(myURL,myInit)
    .then((httpResponse)=>{
        for(let field of httpResponse.headers){
            console.log(`raw = ${field}`);
        }	
        return httpResponse.text();
    })
    .then((returnMessage)=>{
        console.log(returnMessage);
        chatContent = chatContent+"me："+msg+ "\r"+botName+"："+returnMessage +"\r";
        document.getElementById("chat_content").value = chatContent;
        document.getElementById("chat_content").scrollTop = document.getElementById("chat_content").scrollHeight;
        document.getElementById("msg_send").value = "";
    })
    .catch((err)=>{
        console.log(`ERROR : ${err}`);
    });
}

window.addEventListener("DOMContentLoaded", (event) => {

    document.getElementById("button_send").addEventListener("click", sendMessage);

	document.getElementById("msg_send").addEventListener("keypress", function(event){
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("button_send").click();
        }
    });
    
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
        botName = bot.name
        document.getElementById("title").innerHTML = `Chat with ${botName}`
    })
    .catch((err)=>{
        console.log(`ERROR : ${err}`);
    });

});