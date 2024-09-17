const currentUrl = window.location.href.toString();

console.log(currentUrl.toString());

const textContent = document.body.innerText;
const encodedContent = encodeURIComponent(textContent);

fetch(`http://127.0.0.1:8000/input_webtext/?textContent=${encodedContent}`, { method: "POST" })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });

function clear() {
    const response = document.getElementById('respons');
    const sourceurls = document.getElementById('source_urls');

    response.innerHTML = "";
    if (sourceurls) {
        sourceurls.innerHTML = "";
    }
    fetch(`http://127.0.0.1:8000/clear_messages/`, { method: "POST" })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

const textbox = document.createElement("input");

function get_chat_response(question) {
    const startTime = performance.now(); // Start timing
    const response = document.getElementById('respons');

    const your_question = document.createElement('span');
    your_question.innerText = "You: " + question;
    response.appendChild(your_question);

    const loading = document.createElement('span');
    loading.innerText = "FinGPT: Loading...";
    document.getElementById("respons").appendChild(loading);

    const request = {"question": question};
    document.getElementById("respons").scrollTop = document.getElementById("respons").scrollHeight;

    question = encodeURI(question);

    fetch(`http://127.0.0.1:8000/get_chat_response/?question=${question}`, {method: "GET"})
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now(); // End timing
            const responseTime = endTime - startTime;
            console.log(`Time taken for response: ${responseTime} ms`); // Log the response time

            response.removeChild(loading);

            const resptext = document.createElement('span');
            resptext.innerText = "FinGPT: " + data["resp"];
            document.getElementById("respons").appendChild(resptext);
            textbox.value = "";
            document.getElementById("respons").scrollTop = document.getElementById("respons").scrollHeight;
        });
}

let searchQuery = "";

let popup;

function get_adv_chat_response(question) {
    const startTime = performance.now(); // Start timing
    const response = document.getElementById('respons');
    searchQuery = question;

    const your_question = document.createElement('span');
    your_question.innerText = "You: " + question;
    response.appendChild(your_question);

    const loading = document.createElement('span');
    loading.innerText = "FinGPT: Loading...";
    document.getElementById("respons").appendChild(loading);

    const request = {"question": question};
    document.getElementById("respons").scrollTop = document.getElementById("respons").scrollHeight;

    fetch(`http://127.0.0.1:8000/get_adv_response/?question=${question}`, {method: "GET"})
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now(); // End timing
            const responseTime = endTime - startTime;
            console.log(`Time taken for response: ${responseTime} ms`); // Log the response time

            response.removeChild(loading);

            const resptext = document.createElement('span');
            resptext.innerText = "FinGPT: " + data["resp"];
            document.getElementById("respons").appendChild(resptext);
            textbox.value = "";
            document.getElementById("respons").scrollTop = document.getElementById("respons").scrollHeight;
        });
}

const sitebody = document.body;

function get_sources(search_query) {
    const sources_window = document.getElementById('sources_window');
    sources_window.style.display = 'block';

    fetch(`http://127.0.0.1:8000/get_source_urls/?query=${String(search_query)}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            console.log(data["resp"]);
            const sources = data["resp"];
            const source_urls = document.getElementById('source_urls');
            source_urls.innerHTML = '';

            sources.forEach(source => {
                const url = source[0];
                const link = document.createElement('a');
                link.href = url;
                link.innerText = url;
                link.target = "_blank";

                const listItem = document.createElement('li');
                listItem.appendChild(link);

                source_urls.appendChild(listItem);
            });
        });
}

popup = document.createElement('div');
popup.id = "draggableElement";

const header = document.createElement('div');
header.id = "header";

const title = document.createElement('span');
title.innerText = "FinGPT";

const iconContainer = document.createElement('div');
iconContainer.id = "icon-container";

const settingsIcon = document.createElement('span');
settingsIcon.innerText = "⚙️";
settingsIcon.className = "icon";
settingsIcon.onclick = function() {
    const settingsWindow = document.getElementById('settings_window');
    const rect = settingsIcon.getBoundingClientRect();
    settingsWindow.style.top = `${rect.bottom}px`;
    settingsWindow.style.left = `${rect.left}px`;
    settingsWindow.style.display = settingsWindow.style.display === 'none' ? 'block' : 'none';
};

const minimizeIcon = document.createElement('span');
minimizeIcon.innerText = "➖";
minimizeIcon.className = "icon";
minimizeIcon.onclick = function() {
    if (popup.classList.contains('minimized')) {
        popup.classList.remove('minimized');
        popup.style.height = '600px';
    } else {
        popup.classList.add('minimized');
        popup.style.height = '60px';
    }
};

const closeIcon = document.createElement('span');
closeIcon.innerText = "❌";
closeIcon.className = "icon";
closeIcon.onclick = function() { popup.style.display = 'none'; };

iconContainer.appendChild(settingsIcon);
iconContainer.appendChild(minimizeIcon);
iconContainer.appendChild(closeIcon);

header.appendChild(title);
header.appendChild(iconContainer);

const content = document.createElement('div');
content.id = "content";

const titleText = document.createElement('h2');
titleText.innerText = "Your personalized financial assistant.";

const subtitleText = document.createElement('p');
subtitleText.innerText = "Ask me something!";

content.appendChild(titleText);
content.appendChild(subtitleText);

const inputContainer = document.createElement('div');
inputContainer.id = "inputContainer";

textbox.type = "text";
textbox.placeholder = "Ask me something!";

inputContainer.appendChild(textbox);

const responseContainer = document.createElement('div');
responseContainer.id = "respons";
content.appendChild(responseContainer);

const buttonContainer = document.createElement('div');
buttonContainer.id = "buttonContainer";

const askButton = document.createElement('button');
askButton.innerText = "Ask";
askButton.onclick = function() {
    const startTime = performance.now(); // Start timing
    get_chat_response(textbox.value);
    const endTime = performance.now(); // End timing
    const responseTime = endTime - startTime;
    console.log(`Time taken for response: ${responseTime} ms`); // Log the response time
};

const advAskButton = document.createElement('button');
advAskButton.innerText = "Advanced Ask";
advAskButton.onclick = function() {
    const startTime = performance.now(); // Start timing
    get_adv_chat_response(textbox.value);
    const endTime = performance.now(); // End timing
    const responseTime = endTime - startTime;
    console.log(`Time taken for response: ${responseTime} ms`); // Log the response time
};

buttonContainer.appendChild(askButton);
buttonContainer.appendChild(advAskButton);

const buttonRow = document.createElement('div');
buttonRow.className = "button-row";

const clearButton = document.createElement('button');
clearButton.innerText = "Clear";
clearButton.className = "clear-button";
clearButton.onclick = clear;

const sourcesButton = document.createElement('button');
sourcesButton.innerText = "Sources";
sourcesButton.className = "sources-button";
sourcesButton.onclick = function() { get_sources(searchQuery); };

buttonRow.appendChild(sourcesButton);
buttonRow.appendChild(clearButton);

popup.appendChild(header);
popup.appendChild(content);
popup.appendChild(buttonRow); // Add button row here
popup.appendChild(inputContainer);
popup.appendChild(buttonContainer);

// Sources Window
const sources_window = document.createElement('div');
sources_window.id = "sources_window";
sources_window.style.display = 'none';

const sourcesHeader = document.createElement('div');
sourcesHeader.id = "sources_window_header";

const sourcesTitle = document.createElement('h2');
sourcesTitle.innerText = "Sources";

const sourcesCloseIcon = document.createElement('span');
sourcesCloseIcon.innerText = "❌";
sourcesCloseIcon.className = "icon";
sourcesCloseIcon.onclick = function() { sources_window.style.display = 'none'; };

sourcesHeader.appendChild(sourcesTitle);
sourcesHeader.appendChild(sourcesCloseIcon);

const source_urls = document.createElement('ul');
source_urls.id = "source_urls";

sources_window.appendChild(sourcesHeader);
sources_window.appendChild(source_urls);

// Settings Windows
const settings_window = document.createElement('div');
settings_window.id = "settings_window";

const settingsLabel = document.createElement('label');
settingsLabel.innerText = "Light Mode";

const lightModeSwitch = document.createElement('input');
lightModeSwitch.type = "checkbox";
lightModeSwitch.onchange = function() {
    document.body.classList.toggle('light-mode');
};

settingsLabel.appendChild(lightModeSwitch);
settings_window.appendChild(settingsLabel);

sitebody.appendChild(settings_window);

// Close settings popup when clicks outside
document.addEventListener('click', function(event) {
    const settingsWindow = document.getElementById('settings_window');
    if (settingsWindow.style.display === 'block' && !settingsWindow.contains(event.target) && !settingsIcon.contains(event.target)) {
        settingsWindow.style.display = 'none';
    }
});

sitebody.appendChild(sources_window);
sitebody.appendChild(popup);

function makeDraggableAndResizable(element) {
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight;

    element.addEventListener('mousedown', function(e) {
        const rect = element.getBoundingClientRect();
        const isRightEdge = e.clientX > rect.right - 10;
        const isBottomEdge = e.clientY > rect.bottom - 10;

        // Check if the click is not on a text or input element
        if (e.target.tagName !== 'SPAN' && e.target.tagName !== 'INPUT' && (isRightEdge || isBottomEdge)) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = rect.width;
            startHeight = rect.height;
        } else if (e.target.tagName !== 'SPAN' && e.target.tagName !== 'INPUT') {
            isDragging = true;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        } else if (isResizing) {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            if (newWidth > 250) {
                element.style.width = `${newWidth}px`;
            }
            if (newHeight > 300) {
                element.style.height = `${newHeight}px`;
            }
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        isResizing = false;
    });
}

popup = document.getElementById("draggableElement");
makeDraggableAndResizable(popup);
makeDraggableAndResizable(sources_window);

function respond() {
    const question = textbox.value;
    const response = document.getElementById('respons');
    response.innerText = "You asked: " + question;
}

