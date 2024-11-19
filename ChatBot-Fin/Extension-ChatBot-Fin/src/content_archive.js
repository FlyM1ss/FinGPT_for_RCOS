import { availableModels, selectedModels, getSelectedModels, loadModelSelection } from './content_archive_split/getSelectedModel.js';
import { handleChatResponse, appendChatElement } from './content_archive_split/chat_response.js';
import { get_chat_response, get_adv_chat_response, clear, get_sources, logQuestion } from './content_archive_split/buttons.js';
import { createPopup } from './content_archive_split/popup.js';

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

// Model Selection Section
const modelSelectionContainer = document.createElement('div');
modelSelectionContainer.id = "model_selection_container";

const modelSelectionHeader = document.createElement('div');
modelSelectionHeader.id = "model_selection_header";
modelSelectionHeader.innerText = `Model: ${selectedModels.join(' & ')}`;  // show default

const modelToggleIcon = document.createElement('span');
modelToggleIcon.innerText = "⯆";

modelSelectionHeader.appendChild(modelToggleIcon);
modelSelectionContainer.appendChild(modelSelectionHeader);

const modelSelectionContent = document.createElement('div');
modelSelectionContent.id = "model_selection_content";
modelSelectionContent.style.display = "none";

// handle model selection
function handleModelSelection(modelItem, modelName) {
    if (selectedModels.includes(modelName)) {
        // Deselect
        selectedModels = selectedModels.filter(model => model !== modelName);
        modelItem.classList.remove('selected-model');
    } else if (selectedModels.length < 2) {
        // Select
        selectedModels.push(modelName);
        modelItem.classList.add('selected-model');
    } else {
        alert("You can only select up to 2 models.");
    }

    modelSelectionHeader.innerText = `Model: ${selectedModels.join(' & ') || "Select up to 2"}`;
    modelSelectionHeader.appendChild(modelToggleIcon);
}

// Create a model selection item for each available model
availableModels.forEach(model => {
    const modelItem = document.createElement('div');
    modelItem.className = 'model-selection-item';
    modelItem.innerText = model;

    // default selected models
    if (selectedModels.includes(model)) {
        modelItem.classList.add('selected-model');
    }

    modelItem.onclick = function() {
        handleModelSelection(modelItem, model);
    };
    modelSelectionContent.appendChild(modelItem);
});

modelSelectionContainer.appendChild(modelSelectionContent);
settings_window.appendChild(modelSelectionContainer);

// Toggle Model Selection Section
modelSelectionHeader.onclick = function() {
    if (modelSelectionContent.style.display === "none") {
        modelSelectionContent.style.display = "block";
        modelToggleIcon.innerText = "⯅";
    } else {
        modelSelectionContent.style.display = "none";
        modelToggleIcon.innerText = "⯆";
    }
};

// Preferred Links Section
const preferredLinksContainer = document.createElement('div');
preferredLinksContainer.id = "preferred_links_container";

const preferredLinksHeader = document.createElement('div');
preferredLinksHeader.id = "preferred_links_header";
preferredLinksHeader.innerText = "Preferred Links";

const toggleIcon = document.createElement('span');
toggleIcon.innerText = "⯆";  // Down arrow

preferredLinksHeader.appendChild(toggleIcon);
preferredLinksContainer.appendChild(preferredLinksHeader);

const preferredLinksContent = document.createElement('div');
preferredLinksContent.id = "preferred_links_content";

// Add Link Button
const addLinkButton = document.createElement('div');
addLinkButton.id = "add_link_button";
addLinkButton.innerText = "+";
addLinkButton.onclick = function() {
    const newLink = prompt("Enter a new preferred URL:");
    if (newLink) {
        // Send the new link to the backend
        fetch('http://127.0.0.1:8000/api/add_preferred_url/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(newLink)}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const newLinkItem = document.createElement('div');
                    newLinkItem.className = 'preferred-link-item';
                    newLinkItem.innerText = newLink;
                    preferredLinksContent.appendChild(newLinkItem);
                } else {
                    alert('Failed to add the new URL.');
                }
            })
            .catch(error => console.error('Error adding preferred link:', error));
    }
};

// Load existing preferred links when the settings window is opened
function loadPreferredLinks() {
    fetch('http://127.0.0.1:8000/api/get_preferred_urls/')
        .then(response => response.json())
        .then(data => {
            preferredLinksContent.innerHTML = ''; // Clear existing content
            if (data.urls.length > 0) {
                data.urls.forEach(link => {
                    const linkItem = document.createElement('div');
                    linkItem.className = 'preferred-link-item';
                    linkItem.innerText = link;
                    preferredLinksContent.appendChild(linkItem);
                });
            }
            preferredLinksContent.appendChild(addLinkButton); // Add the '+' button
        })
        .catch(error => console.error('Error loading preferred links:', error));
}

preferredLinksContent.appendChild(addLinkButton);
preferredLinksContainer.appendChild(preferredLinksContent);
settings_window.appendChild(preferredLinksContainer);

document.body.appendChild(settings_window);

// Toggle Preferred Links Section
preferredLinksHeader.onclick = function() {
    if (preferredLinksContent.style.display === "none") {
        preferredLinksContent.style.display = "block";
        toggleIcon.innerText = "⯅";  // Up arrow
    } else {
        preferredLinksContent.style.display = "none";
        toggleIcon.innerText = "⯆";  // Down arrow
    }
};

// Load preferred links when settings are opened
settingsIcon.onclick = function() {
    const rect = settingsIcon.getBoundingClientRect();
    settings_window.style.top = `${rect.bottom}px`;
    settings_window.style.left = `${rect.left}px`;
    settings_window.style.display = settings_window.style.display === 'none' ? 'block' : 'none';

    // Load preferred links
    if (settings_window.style.display === 'block') {
        loadPreferredLinks();
    }
};

// Close settings popup when clicks outside
document.addEventListener('click', function(event) {
    const settingsWindow = document.getElementById('settings_window');
    if (settingsWindow.style.display === 'block' && !settingsWindow.contains(event.target) && !settingsIcon.contains(event.target)) {
        settingsWindow.style.display = 'none';
    }
});


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

// Loading spinner
const loadingSpinner = document.createElement('div');
loadingSpinner.id = "loading_spinner";
loadingSpinner.className = "spinner";
loadingSpinner.style.display = 'none'; // hide loading initially

const source_urls = document.createElement('ul');
source_urls.id = "source_urls";

sources_window.appendChild(sourcesHeader);
sources_window.appendChild(loadingSpinner);
sources_window.appendChild(source_urls);

// Append windows to the body
document.body.appendChild(sources_window);
document.body.appendChild(popup);
document.body.appendChild(additionalPopup);

let offsetX, offsetY, startX, startY, startWidth, startHeight;
let sourceWindowOffsetX = 10;

function makeDraggableAndResizable(element) {
    let isDragging = false;
    let isResizing = false;

    element.querySelector('.draggable').addEventListener('mousedown', function(e) {
        if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) {
            return;
        }

        e.preventDefault();

        const rect = element.getBoundingClientRect();
        const isRightEdge = e.clientX > rect.right - 10;
        const isBottomEdge = e.clientY > rect.bottom - 10;

        if (isRightEdge || isBottomEdge) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = rect.width;
            startHeight = rect.height;
            document.addEventListener('mousemove', resizeElement);
        } else {
            isDragging = true;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', dragElement);
        }

        document.addEventListener('mouseup', closeDragOrResizeElement);
    });

    function dragElement(e) {
        e.preventDefault();
        const newX = e.clientX - offsetX + window.scrollX;
        const newY = e.clientY - offsetY + window.scrollY;
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;

        // move sources window with main popup
        const sourcesWindow = document.getElementById('sources_window');
        sourcesWindow.style.left = `${newX + element.offsetWidth + sourceWindowOffsetX}px`;
        sourcesWindow.style.top = `${newY}px`;

        // move additional popup with main popup
        const additionalPopup = document.getElementById('additionalPopup');
        if (additionalPopup) {
            additionalPopup.style.left = `${newX + element.offsetWidth + 20}px`;
            additionalPopup.style.top = `${newY}px`;
        }
    }

    function resizeElement(e) {
        e.preventDefault();
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        if (newWidth > 250) {
            element.style.width = `${newWidth}px`;
        }
        if (newHeight > 300) {
            element.style.height = `${newHeight}px`;
        }

        // move sources window with main popup
        const sourcesWindow = document.getElementById('sources_window');
        sourcesWindow.style.left = `${element.offsetLeft + element.offsetWidth + sourceWindowOffsetX}px`;

        // move additional popup with main popup
        const additionalPopup = document.getElementById('additionalPopup');
        if (additionalPopup) {
            additionalPopup.style.left = `${element.offsetLeft + element.offsetWidth + 20}px`;
        }
    }

    function closeDragOrResizeElement() {
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mousemove', resizeElement);
        document.removeEventListener('mouseup', closeDragOrResizeElement);
        isDragging = false;
        isResizing = false;
    }
}

makeDraggableAndResizable(popup);

const sourcesWindow = document.getElementById('sources_window');
const popupRect = popup.getBoundingClientRect();
sourcesWindow.style.left = `${popupRect.right + sourceWindowOffsetX}px`;
sourcesWindow.style.top = `${popupRect.top}px`;