import { availableModels, selectedModels, getSelectedModels, loadModelSelection } from './content_archive_split/getSelectedModel.js';
import { handleChatResponse, appendChatElement } from './content_archive_split/chat_response.js';
import { get_chat_response, get_adv_chat_response, clear, get_sources, logQuestion } from './content_archive_split/buttons.js';
import { createPopup } from './content_archive_split/popup.js';
import { makeDraggableAndResizable } from './drag_resize.js';
import { setupPreferredLinks } from './content_archive_split/preferredLinks.js';
import { createModelSelection } from './content_archive_split/modelSelection.js';
import { createSourcesWindow } from './sourcesWindow.js';

const currentUrl = window.location.href.toString();
console.log(currentUrl);

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


getSelectedModels();
loadModelSelection();

document.addEventListener('DOMContentLoaded', () => {
    const askButton = document.getElementById('askButton');
    const advAskButton = document.getElementById('advAskButton');
    const textbox = document.getElementById('textbox');

    // Normal Ask button click
    askButton.addEventListener('click', () => {
        const question = textbox.value.trim();
        if (question) {
            console.log("Normal question asked:", question); // Debugging log
            handleChatResponse(question, false); // Call handleChatResponse
            textbox.value = ''; // Clear the input box
        } else {
            alert("Please enter a question.");
        }
    });

    // Advanced Ask button click
    advAskButton.addEventListener('click', () => {
        const question = textbox.value.trim();
        if (question) {
            console.log("Advanced question asked:", question); // Debugging log
            handleChatResponse(question, true); // Call handleChatResponse with isAdvanced = true
            textbox.value = ''; // Clear the input box
        } else {
            alert("Please enter a question.");
        }
    });
});

const popup = createPopup(get_chat_response, get_adv_chat_response, clear, get_sources, '');
document.body.appendChild(popup);
const askButton = document.getElementById('askButton');
const advAskButton = document.getElementById('advAskButton');
const clearButton = document.getElementById('clearButton');
const searchButton = document.getElementById('searchButton');
const searchTextbox = document.getElementById('searchTextbox');

// Normal Ask button click
askButton.addEventListener('click', () => {
    const question = document.getElementById('textbox').value.trim();
    if (question) {
        console.log("Normal question asked:", question);
        handleChatResponse(question, false);
        document.getElementById('textbox').value = '';
    } else {
        alert("Please enter a question.");
    }
});

advAskButton.addEventListener('click', () => {
    const question = document.getElementById('textbox').value.trim();
    if (question) {
        console.log("Advanced question asked:", question);
        handleChatResponse(question, true);
        document.getElementById('textbox').value = '';
    } else {
        alert("Please enter a question.");
    }
});

clearButton.addEventListener('click', () => {
    clear();
});

// Search sources button
searchButton.addEventListener('click', () => {
    const searchQuery = searchTextbox.value.trim();
    get_sources(searchQuery);
});


// additional popup for the second model
// function createAdditionalPopup(modelName) {
//     const additionalPopup = document.createElement('div');
//     additionalPopup.id = "additionalPopup";
//     additionalPopup.classList.add('additional-popup');  // Use a different class for styling
//
//     const header = document.createElement('div');
//     header.id = "header";
//     header.className = "draggable";
//
//     const title = document.createElement('span');
//     title.innerText = `${modelName} Response`;
//
//     header.appendChild(title);
//     additionalPopup.appendChild(header);
//
//     const content = document.createElement('div');
//     content.id = "content";
//
//     // const introText = document.createElement('p');
//     // introText.innerText = "Response from " + modelName;
//     // content.appendChild(introText);
//
//     const responseContainer = document.createElement('div');
//     responseContainer.id = "respons";
//     responseContainer.innerText = `${modelName}: Loading...`;
//
//     content.appendChild(responseContainer);
//     additionalPopup.appendChild(content);
//
//     document.body.appendChild(additionalPopup);
//
//     const mainPopup = document.getElementById('draggableElement');
//     const rect = mainPopup.getBoundingClientRect();
//     additionalPopup.style.position = "absolute";
//     additionalPopup.style.top = `${rect.top}px`;
//     additionalPopup.style.left = `${rect.right + 20}px`;
// }

document.addEventListener('DOMContentLoaded', () => {
    const askButton = document.getElementById('askButton');
    const advAskButton = document.getElementById('advAskButton');
    const clearButton = document.getElementById('clearButton'); // Assuming there's a clear button
    const searchButton = document.getElementById('searchButton'); // For searching sources
    const searchTextbox = document.getElementById('searchTextbox'); // Assuming there's a search input

    // Event listener for normal ask button
    askButton.addEventListener('click', () => {
        get_chat_response(); // Call the imported function
    });

    // Event listener for advanced ask button
    advAskButton.addEventListener('click', () => {
        get_adv_chat_response(); // Call the imported function
    });

    // Event listener for clear button
    clearButton.addEventListener('click', () => {
        clear(); // Call the imported function to clear responses
    });

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const searchQuery = searchTextbox.value; // Get the search query from input
        get_sources(searchQuery); // Call the imported function to get sources
    });
});


// Additional popup
const additionalPopup = document.createElement('div');
additionalPopup.id = "additionalPopup";
additionalPopup.classList.add('additional-popup'); // Use a different class for styling

const additionalHeader = document.createElement('div');
additionalHeader.id = "additionalHeader";
additionalHeader.className = "draggable";

const additionalTitle = document.createElement('span');
additionalTitle.innerText = "gpt-3.5-turbo Response";

additionalHeader.appendChild(additionalTitle);
additionalPopup.appendChild(additionalHeader);

const additionalContent = document.createElement('div');
additionalContent.id = "additionalContent";

const additionalResponseContainer = document.createElement('div');
additionalResponseContainer.id = "respons";
additionalContent.appendChild(additionalResponseContainer);

additionalPopup.appendChild(additionalContent);
document.body.appendChild(additionalPopup);

// Position the additional popup next to the main popup
const rect = popup.getBoundingClientRect();
additionalPopup.style.position = "absolute";
additionalPopup.style.top = `${rect.top}px`;
additionalPopup.style.left = `${rect.right + 20}px`;

// Settings Window
const settings_window = document.createElement('div');
settings_window.id = "settings_window";

// Light Mode Toggle
const settingsLabel = document.createElement('label');
settingsLabel.innerText = "Light Mode";

const lightModeSwitch = document.createElement('input');
lightModeSwitch.type = "checkbox";
lightModeSwitch.onchange = function() {
    document.body.classList.toggle('light-mode');
};

settingsLabel.appendChild(lightModeSwitch);
settings_window.appendChild(settingsLabel);

// model selection

const settingsWindow = document.getElementById('settings_window'); // Ensure this is defined
const availableModels = ['Model A', 'Model B', 'Model C']; // Example models
let selectedModels = ['Model A']; // Example default selection

createModelSelection(settingsWindow, availableModels, selectedModels);


// Assuming settings_window and settingsIcon are defined in the main script
const settings_window = document.createElement('div');
settings_window.id = "settings_window";
settings_window.style.display = 'none';

const settingsIcon = document.getElementById('settings_icon'); // Example selector for your settings icon

// Initialize the Preferred Links section
setupPreferredLinks(settings_window, settingsIcon);

// Close settings popup when clicks outside
document.addEventListener('click', function(event) {
    const settingsWindow = document.getElementById('settings_window');
    if (settingsWindow.style.display === 'block' && !settingsWindow.contains(event.target) && !settingsIcon.contains(event.target)) {
        settingsWindow.style.display = 'none';
    }
});


// Sources Window
createSourcesWindow(popup);

makeDraggableAndResizable(popup);

const sourcesWindow = document.getElementById('sources_window');
const popupRect = popup.getBoundingClientRect();
sourcesWindow.style.left = `${popupRect.right + sourceWindowOffsetX}px`;
sourcesWindow.style.top = `${popupRect.top}px`;