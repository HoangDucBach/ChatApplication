module.exports.addMessageToView = (userName, message) => {
    $('.chat-layout__message--layout').append(`
    <div class="chat-layout__message-username">
        ${userName}
    </div>
    <time class="chat-layout__message-time">
        ${Date.now()}
    </time>
    <div class="chat-layout__message">
        ${message}
    </div>
    `)
};