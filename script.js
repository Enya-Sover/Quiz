const sendButton = document.getElementById('send');
const inputText = document.getElementById('message');
const container = document.getElementById('chat-container');
const nameBtn = document.getElementById('nameSubmit');
const nameDiv = document.getElementById('nameDiv');
const inputName = document.getElementById('name');

sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const messageDiv = document.createElement('div');
    messageDiv.className = "message-div";
    const message = document.createElement('p');
    message.textContent = inputText.value;
    const name = document.createElement('span');
    name.textContent = `Sent by: ${inputName.value}`; 

    messageDiv.appendChild(message);
    messageDiv.appendChild(name);
    inputText.value = "";
    container.appendChild(messageDiv);
})

document.body.addEventListener('keydown', (e) =>{
    if(e.key === 'Enter' && inputName.value !== ""){
        nameDiv.style.display = 'none';
    }
})

nameBtn.addEventListener('click', () =>{

        if(inputName.value !== ""){
            nameDiv.style.display = 'none';
        }
})
