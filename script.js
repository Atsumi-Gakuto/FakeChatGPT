import { chatData } from "./chat_data.js";

// *** 設定フィールド　開始 ***

// *** 設定フィールド　終了 ***

/**
 * 現在の会話の進度
 * @type {number}
 */
let chatSequence = 0;

/**
 * ChatGPTが回答中かどうか
 * @type {boolean}
 */
let isAnswering = false;

//メッセージ入力テキストをクリックした時のイベント
const messageInputElement = document.querySelector("#input_box > p");
const sendButtonElement = document.querySelector("#input_box > svg");
messageInputElement.addEventListener("click", () => {
    if(!isAnswering) {
        messageInputElement.innerText = chatData[chatSequence].question;
        messageInputElement.classList.remove("empty_text");
        sendButtonElement.classList.add("can_send");
    }
});

//メッセージ送信ボタンをクリックした時のイベント
sendButtonElement.addEventListener("click", () => {
    if(sendButtonElement.classList.contains("can_send")) {
        messageInputElement.innerText = "Send a message.";
        messageInputElement.classList.add("empty_text");
        sendButtonElement.classList.remove("can_send");
        const userChatElement = document.createElement("div");
        userChatElement.classList.add("user_chat");
        const userImageElement = document.createElement("img");
        userImageElement.src = "images/default_user.svg";
        userChatElement.appendChild(userImageElement);
        const userChatTextElement = document.createElement("p");
        userChatTextElement.innerText = chatData[chatSequence].question;
        userChatElement.appendChild(userChatTextElement);
        const chatAreaElement = document.getElementById("chat_area");
        chatAreaElement.appendChild(userChatElement);
        isAnswering = true;
        setTimeout(() => {
            const gptChatElement = document.createElement("div");
            gptChatElement.classList.add("gpt_chat");
            const gptImageElement = document.createElement("img");
            gptImageElement.src = "images/chat_gpt.svg";
            gptChatElement.appendChild(gptImageElement);
            const gptChatTextElement = document.createElement("p");
            const gptChatBodyElement = document.createElement("span");
            gptChatTextElement.appendChild(gptChatBodyElement);
            const cursorElement = document.createElement("span");
            cursorElement.classList.add("cursor");
            gptChatTextElement.appendChild(cursorElement);
            gptChatElement.appendChild(gptChatTextElement);
            chatAreaElement.appendChild(gptChatElement);
        }, 1000);
    }
});