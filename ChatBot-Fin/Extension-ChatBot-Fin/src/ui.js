export const textbox = document.createElement("input");

export function initializeUI() {
    const sitebody = document.body;
    const popup = createPopup();
    const sourcesWindow = createSourcesWindow();
    const settingsWindow = createSettingsWindow();

    sitebody.appendChild(settingsWindow);
    sitebody.appendChild(sourcesWindow);
    sitebody.appendChild(popup);
}

function createPopup() {
    const popup = document.createElement('div');
    popup.id = "draggableElement";

    const header = createHeader();
    const content = createContent();
    const buttonRow = createButtonRow();
    const inputContainer = createInputContainer();
    const buttonContainer = createButtonContainer();

    popup.appendChild(header);
    popup.appendChild(content);
    popup.appendChild(buttonRow);
    popup.appendChild(inputContainer);
    popup.appendChild(buttonContainer);

    return popup;
}

function createHeader() {
    const header = document.createElement('div');
    header.id = "header";

    const title = document.createElement('span');
    title.innerText = "FinGPT";

    const iconContainer = document.createElement('div');
    iconContainer.id = "icon-container";

    const settingsIcon = document.createElement('span');
    settingsIcon.innerText = "⚙️";
    settingsIcon.className = "icon";
    settingsIcon.onclick = toggleSettings;

    const minimizeIcon = document.createElement('span');
    minimizeIcon.innerText = "➖";
    minimizeIcon.className = "icon";
    minimizeIcon.onclick = toggleMinimize;

    const closeIcon = document.createElement('span');
    closeIcon.innerText = "❌";
    closeIcon.className = "icon";
    closeIcon.onclick = () => { popup.style.display = 'none'; };

    iconContainer.appendChild(settingsIcon);
    iconContainer.appendChild(minimizeIcon);
    iconContainer.appendChild(closeIcon);

    header.appendChild(title);
    header.appendChild(iconContainer);

    return header;
}

function createContent() {
    const content = document.createElement('div');
    content.id = "content";

    const titleText = document.createElement('h2');
    titleText.innerText = "Your personalized financial assistant.";

    const subtitleText = document.createElement('p');
    subtitleText.innerText = "Ask me something!";

    content.appendChild(titleText);
    content.appendChild(subtitleText);
    content.appendChild(createResponseContainer());

    return content;
}

function createResponseContainer() {
    const responseContainer = document.createElement('div');
    responseContainer.id = "respons";
    return responseContainer;
}

function createInputContainer() {
    const inputContainer = document.createElement('div');
    inputContainer.id = "inputContainer";

    textbox.type = "text";
    textbox.placeholder = "Ask me something!";

    inputContainer.appendChild(textbox);
    return inputContainer;
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = "buttonContainer";

    const askButton = document.createElement('button');
    askButton.innerText = "Ask";
    askButton.id = "askButton";

    const advAskButton = document.createElement('button');
    advAskButton.innerText = "Advanced Ask";
    advAskButton.id = "advAskButton";

    buttonContainer.appendChild(askButton);
    buttonContainer.appendChild(advAskButton);

    return buttonContainer;
}

function createButtonRow() {
    const buttonRow = document.createElement('div');
    buttonRow.className = "button-row";

    const clearButton = document.createElement('button');
    clearButton.innerText = "Clear";
    clearButton.className = "clear-button";
    clearButton.id = "clearButton";

    const sourcesButton = document.createElement('button');
    sourcesButton.innerText = "Sources";
    sourcesButton.className = "sources-button";
    sourcesButton.id = "sourcesButton";

    buttonRow.appendChild(sourcesButton);
    buttonRow.appendChild(clearButton);

    return buttonRow;
}

function createSourcesWindow() {
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
    sourcesCloseIcon.onclick = () => { sources_window.style.display = 'none'; };

    sourcesHeader.appendChild(sourcesTitle);
    sourcesHeader.appendChild(sourcesCloseIcon);

    const source_urls = document.createElement('ul');
    source_urls.id = "source_urls";

    sources_window.appendChild(sourcesHeader);
    sources_window.appendChild(source_urls);

    return sources_window;
}

function createSettingsWindow() {
    const settings_window = document.createElement('div');
    settings_window.id = "settings_window";

    const settingsLabel = document.createElement('label');
    settingsLabel.innerText = "Light Mode";

    const lightModeSwitch = document.createElement('input');
    lightModeSwitch.type = "checkbox";
    lightModeSwitch.onchange = () => {
        document.body.classList.toggle('light-mode');
    };

    settingsLabel.appendChild(lightModeSwitch);
    settings_window.appendChild(settingsLabel);

    return settings_window;
}

export function handleResponse(data, prefix) {
    const response = document.getElementById('respons');
    const loading = response.querySelector('span');
    response.removeChild(loading);

    const resptext = document.createElement('span');
    resptext.innerText = `${prefix}: ${data["resp"]}`;
    response.appendChild(resptext);
    textbox.value = "";
    response.scrollTop = response.scrollHeight;
}

export function updateSources(data) {
    const source_urls = document.getElementById('source_urls');
    source_urls.innerHTML = '';

    data["resp"].forEach(source => {
        const url = source[0];
        const link = document.createElement('a');
        link.href = url;
        link.innerText = url;
        link.target = "_blank";

        const listItem = document.createElement('li');
        listItem.appendChild(link);

        source_urls.appendChild(listItem);
    });
}

function toggleSettings() {
    const settingsWindow = document.getElementById('settings_window');
    const rect = this.getBoundingClientRect();
    settingsWindow.style.top = `${rect.bottom}px`;
    settingsWindow.style.left = `${rect.left}px`;
    settingsWindow.style.display = settingsWindow.style.display === 'none' ? 'block' : 'none';
}

function toggleMinimize() {
    const popup = document.getElementById('draggableElement');
    if (popup.classList.contains('minimized')) {
        popup.classList.remove('minimized');
        popup.style.height = '600px';
    } else {
        popup.classList.add('minimized');
        popup.style.height = '60px';
    }
}
