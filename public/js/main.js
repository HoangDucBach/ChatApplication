const socket = io('https://chat-app-hoangducbach.koyeb.app/');
// const socket = io('http://localhost:3000');

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

const addMessageToView = (userName, color, message) => {
    const scrollMessage = $('.chat-layout__message--scroll');
    const newMessage = `
    <div class="chat-layout__message--layout-and-color">
        <div class="chat-layout__message-color">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
                <circle cx="22.5" cy="22.5" r="22.5" fill="${color}"/>
            </svg>
        </div>
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
    </div>
    
    `;
    scrollMessage.append(newMessage);
    scrollMessage.scrollTop(scrollMessage[0].scrollHeight);
};
const addUserToView = (userName, color, amount) => {
    const usersLayout = $('.room-layout__users--layout');
    const userLayout = `
    <div class="room-layout__users--user">
        <div class="room-layout__users--user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="15" fill="${color}"/>
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
const handleMessage = () => {
    const $chatInput = $('.chat-layout__input');
    socket.emit('chat-message', $chatInput.val());
    $chatInput.val('');
}
const handleJoin = () => {
    const $inputLayout = $('.chat-layout__input--layout');
    const $joinLayout = $('.chat-layout__join-layout');
    const $colorInput = $('.chat-layout__join-color');
    const $userName = $('.chat-layout__join-input');

    $joinLayout.hide();
    $inputLayout.show();
    socket.emit('user-name', $userName.val(), $colorInput.val());
    alert($colorInput.val());

}
$(document).ready(() => {
    const $chatInput = $('.chat-layout__input');
    const $inputLayout = $('.chat-layout__input--layout');
    const $sendButton = $('.chat-layout__input--send');
    const $joinButton = $('.chat-layout__join-button');
    const $joinLayout = $('.chat-layout__join-layout');
    const $userName = $('.chat-layout__join-input');
    let color = '#000000';
    $inputLayout.hide();
    $joinLayout.show();
    $joinButton.on('click', () => {
        handleJoin();
    });
    $sendButton.on('click', () => {
        handleMessage()
    });

    $chatInput.on('keypress', (e) => {
        if (e.which === 13) {
            handleMessage();
        }
    });
    socket.on('chat-message', (data) => {
        color = data.color;
        addMessageToView(data.userName, data.color, data.message);
    });
    socket.on('load-history', (history, userList) => {
        history.forEach(val => {
            addMessageToView(val.userName, val.color, val.message);
        });
        userList.forEach(userName => {
            addUserToView(userName, color, userList.length);
        });
    });

});
