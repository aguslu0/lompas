const socket = io.connect();

function render(data) {
    let date = new Date();
    let dateStr = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    const html = data.map((element, index) => {
        return(`<div>
            <strong style='color: blue'>${element.email}</strong> 
            [<span style='color: brown'>${dateStr}</span>]
            <em style='color: green'>${element.text}</em>
        </div>`);
    }).join(' ');

    document.getElementById('messages').innerHTML = html;
}

socket.on('messages', data => {
    render(data);
});

function addMessage(e) {
    const message = {
        email: document.getElementById('email').value,
        text: document.getElementById('text').value
    };

    socket.emit('new-message', message);

    return false;
}
