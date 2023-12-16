const socket = io('https://chat-app-hoangducbach.koyeb.app/');
function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Chuyển đổi giờ sang định dạng 12 giờ
    hours = hours % 12 || 12;

    // Thêm số 0 vào phút nếu cần
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${amOrPm}`;
    return formattedTime;
}
const addMessageToView = (userName, message) => {
    const scrollMessage = $('.chat-layout__message--scroll');
    const newMessage = `
    <div class="chat-layout__message--layout">
        <div class="chat-layout__message--info-layout">        
            <div class="chat-layout__message-username">
                ${userName}
            </div>
            <time class="chat-layout__message--time">
                ${formatTime(Date.now())}
            </time>
        </div>
       
        <div class="chat-layout__message">
            ${message}
        </div>
    </div>
    `;
    scrollMessage.append(newMessage);
    scrollMessage.scrollTop(scrollMessage[0].scrollHeight);
};
const addUserToView=(userName,amount)=>{
    const usersLayout = $('.room-layout__users--layout');
    const userLayout = `
    <div class="room-layout__users--user">
        <div class="room-layout__users--user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="5" height="6" viewBox="0 0 5 6" fill="none">
                <circle cx="2.5" cy="3" r="2.5" fill="#58FA4A"/>
            </svg>
        </div>
        <div class="room-layout__users--users--state-layout">
            <div class="room-layout__users--username">${userName}</div>
            <div class="room-layout__users--username-state">Online</div>
        </div>
        </div>
    `;
    usersLayout.append(userLayout);
    $('.room-layout__state').text(amount + ' online');
}
$(document).ready(() => {
    const $chatInput = $('.chat-layout__input');
    const $inputLayout=$('.chat-layout__input--layout')
    const $sendButton = $('.chat-layout__input--send');
    const $joinButton = $('.chat-layout__join-button');
    const $joinLayout = $('.chat-layout__join-layout');
    const $userName = $('.chat-layout__join-input');
    $inputLayout.hide();
    $joinLayout.show();
    $joinButton.on('click', () => {
        $joinLayout.hide();
        $inputLayout.show();
        socket.emit('user-name', $userName.val());
    });
    $sendButton.on('click', () => {
        socket.emit('chat-message', $chatInput.val());
    });

    $chatInput.on('keypress', (e) => {
        if (e.which === 13) {
            socket.emit('chat-message', $chatInput.val());
            socket.emit('user-name', $userName.val());
        }
    });
    socket.on('chat-message', (data) => {
        addMessageToView(data.userName, data.message);
    });
    socket.on('load-history', (history,userList) => {
        history.forEach(val => {
            addMessageToView(val.userName, val.message);
        });
        userList.forEach(val => {
            addUserToView(val,userList.length);
        });
    });

});
