var chat = document.createElement('div');
chat.id = 'chat';
chat.className = 'chat';
chat.setAttribute('tabindex', '4');

document.getElementsByTagName('body')[0].appendChild(chat);


chat.innerHTML = "<div id='chat-header' > <h2>PushEdx Chat</h2>  </div> <textarea id='chat-textArea'> </textarea>";



// Now create and append to chat
var innerDiv = document.createElement('div');
innerDiv.className = 'block-2';

// The variable chat is still good... Just append to it.
chat.appendChild(innerDiv);



 
   