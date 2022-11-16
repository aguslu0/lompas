const socket = io.connect();

function render(data) {
    const html = data.map((element, index) => {
        return(`<div>
            <strong style='color: blue'>${element.email}</strong> 
            [<span style='color: brown'>16/11/2022 18:20</span>]
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
