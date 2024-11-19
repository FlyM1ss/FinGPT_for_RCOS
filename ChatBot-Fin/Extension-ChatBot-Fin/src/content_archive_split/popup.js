// popup.js

export function createPopup(get_chat_response, get_adv_chat_response, clear, get_sources, searchQuery) {
    const popup = document.createElement('div');
    popup.id = "draggableElement";

    // Header
    const header = document.createElement('div');
    header.id = "header";
    header.className = "draggable";

    const title = document.createElement('span');
    title.innerText = "FinLLM";

    // Icon container
    const iconContainer = document.createElement('div');
    iconContainer.id = "icon-container";

    const settingsIcon = document.createElement('span');
    settingsIcon.innerText = "⚙️";
    settingsIcon.className = "icon";
    settingsIcon.onclick = function () {
        const rect = settingsIcon.getBoundingClientRect();
        settings_window.style.top = `${rect.bottom}px`;
        settings_window.style.left = `${rect.left}px`;
        settings_window.style.display = settings_window.style.display === 'none' ? 'block' : 'none';
    };

    const minimizeIcon = document.createElement('span');
    minimizeIcon.innerText = "➖";
    minimizeIcon.className = "icon";
    minimizeIcon.onclick = function () {
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
    closeIcon.onclick = function () {
        popup.style.display = 'none';
        additionalPopup.style.display = 'none';
    };

    iconContainer.appendChild(settingsIcon);
    iconContainer.appendChild(minimizeIcon);
    iconContainer.appendChild(closeIcon);

    header.appendChild(title);
    header.appendChild(iconContainer);

    const intro = document.createElement('div');
    intro.id = "intro";

    const titleText = document.createElement('h2');
    titleText.innerText = "Your personalized financial assistant.";

    const subtitleText = document.createElement('p');
    subtitleText.id = "subtitleText";
    subtitleText.innerText = "Ask me something!";
    intro.appendChild(subtitleText);

    intro.appendChild(titleText);
    intro.appendChild(subtitleText);

    const content = document.createElement('div');
    content.id = "content";

    const responseContainer = document.createElement('div');
    responseContainer.id = "respons";
    content.appendChild(responseContainer);

    const inputContainer = document.createElement('div');
    inputContainer.id = "inputContainer";

    const textbox = document.createElement("input");
    textbox.type = "text";
    textbox.id = "textbox";
    textbox.placeholder = "Type your question here...";

    inputContainer.appendChild(textbox);

    const buttonContainer = document.createElement('div');
    buttonContainer.id = "buttonContainer";

    const askButton = document.createElement('button');
    askButton.id = 'askButton';
    askButton.innerText = "Ask";
    askButton.onclick = get_chat_response;

    const advAskButton = document.createElement('button');
    advAskButton.id = 'advAskButton';
    advAskButton.innerText = "Advanced Ask";
    advAskButton.onclick = get_adv_chat_response;

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
    sourcesButton.onclick = function () { get_sources(searchQuery); };

    buttonRow.appendChild(sourcesButton);
    buttonRow.appendChild(clearButton);

    popup.appendChild(header);
    popup.appendChild(intro);
    popup.appendChild(content);
    popup.appendChild(buttonRow);
    popup.appendChild(inputContainer);
    popup.appendChild(buttonContainer);

    return popup;
}
