const socket = io.connect();

function renderChat(data) {
    const html = data.map((element, index) => {
        return(`<div>
            <strong style='color: blue'>${element.email}</strong> 
            [<span style='color: brown'>${element.time}</span>] 
            <i style='color: green'>${element.text}</i>
        </div>`);
    }).join(' ');

    document.getElementById('messages').innerHTML = html;
}

socket.on('messages', data => {
    renderChat(data);
});

function addMessage(e) {
    let date = new Date();
    let dateStr = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    const message = {
        email: document.getElementById('email').value,
        time: dateStr,
        text: document.getElementById('text').value
    };

    socket.emit('new-message', message);

    return false;
}
