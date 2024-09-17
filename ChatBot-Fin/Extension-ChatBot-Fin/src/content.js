import { fetchTextContent, clearMessages, getChatResponse, getAdvChatResponse, getSources } from './fetch.js';
import { initializeUI, textbox } from './ui.js';
import { makeDraggableAndResizable } from './drag_resize.js';
import { addGlobalEventListeners } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    makeDraggableAndResizable(document.getElementById("draggableElement"));
    makeDraggableAndResizable(document.getElementById("sources_window"));
    addGlobalEventListeners();

    // fetchTextContent
    const currentUrl = window.location.href.toString();
    console.log(currentUrl.toString());
    const textContent = document.body.innerText;
    const encodedContent = encodeURIComponent(textContent);
    fetchTextContent(encodedContent);

    // Clear
    document.getElementById('clearButton').onclick = clearMessages;

    // getChatResponse
    document.getElementById('askButton').onclick = () => {
        getChatResponse(textbox.value, (data) => {
            handleResponse(data, "FinGPT");
        });
    };

    // getAdvChatResponse
    document.getElementById('advAskButton').onclick = () => {
        getAdvChatResponse(textbox.value, (data) => {
            handleResponse(data, "FinGPT");
        });
    };

    // getSources
    document.getElementById('sourcesButton').onclick = () => {
        getSources(searchQuery, (data) => {
            updateSources(data);
        });
    };
});
