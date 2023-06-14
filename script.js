import { chatData } from "./chat_data.js";

// *** 設定フィールド　開始 ***

/**
 * GPTの応答が開始されるまでの時間（秒）
 * @type {number}
 */
const gptChatStartTime = 1;

/**
 * GPTの応答で文字が入力される間隔（秒）
 */
const gptChatBetweenTime = 0.05;

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
    if(!isAnswering && chatSequence < chatData.length) {
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
        chatAreaElement.lastElementChild.before(userChatElement);
        isAnswering = true;
        setTimeout(() => {
            const gptChatElement = document.createElement("div");
            gptChatElement.classList.add("gpt_chat");
            const gptImageElement = document.createElement("img");
            gptImageElement.src = "images/chat_gpt.svg";
            gptChatElement.appendChild(gptImageElement);
            const gptChatTextImageElement = document.createElement("div");
            gptChatTextImageElement.classList.add("gpt_chat_text_image");
            const gptChatTextElement = document.createElement("p");
            const gptChatBodyElement = document.createElement("span");
            gptChatTextElement.appendChild(gptChatBodyElement);
            const cursorElement = document.createElement("span");
            cursorElement.classList.add("cursor");
            gptChatTextElement.appendChild(cursorElement);
            gptChatTextImageElement.appendChild(gptChatTextElement);
            gptChatElement.appendChild(gptChatTextImageElement);
            chatAreaElement.lastElementChild.before(gptChatElement);
            setTimeout(() => {
                let answerChar = 0; //GPTの回答で出力した文字のインデックス
                const addCharHandler = setInterval(async () => {
                    gptChatBodyElement.innerText += chatData[chatSequence].answer[answerChar++];
                    if(answerChar == chatData[chatSequence].answer.length) {
                        clearInterval(addCharHandler);
                        cursorElement.remove();
                        if(chatData[chatSequence].images.length > 0) {
                            const imageAreaElement = document.createElement("div");
                            imageAreaElement.classList.add("image_area");
                            const imageInnerElement = document.createElement("div");
                            imageInnerElement.classList.add("image_area_inner");
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            chatData[chatSequence].images.forEach((imageSrc) => {
                                const imageElement = document.createElement("img");
                                imageElement.src = imageSrc;
                                imageInnerElement.appendChild(imageElement);
                            });
                            imageAreaElement.appendChild(imageInnerElement);
                            gptChatTextImageElement.appendChild(imageAreaElement);
                        }
                        chatSequence++;
                        isAnswering = false;
                    }
                }, gptChatBetweenTime * 1000);
            }, gptChatStartTime * 1000);
        }, 1000);
    }
});