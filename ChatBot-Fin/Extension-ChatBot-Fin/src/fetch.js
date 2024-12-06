import { handleResponse, updateSources } from './ui.js';

// Add a global variable for the selected model
let selectedModel = 'gpt-3.5-turbo'; // Default model selection

// Update selected model dynamically
export function updateSelectedModel(model) {
    selectedModel = model;
    console.log(`Model updated to: ${selectedModel}`);
}

// Add event listener for model selection dropdown
document.addEventListener('DOMContentLoaded', () => {
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
        modelSelect.addEventListener('change', (event) => {
            updateSelectedModel(event.target.value);
        });
    }
});

export function fetchTextContent(encodedContent) {
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
            console.error('Error in fetchTextContent:', error);
        });
}

export function clearMessages() {
    const response = document.getElementById('respons');
    const sourceurls = document.getElementById('source_urls');

    if (response) response.innerHTML = "";
    if (sourceurls) sourceurls.innerHTML = "";

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
            console.error('Error in clearMessages:', error);
        });
}

export function getChatResponse(question, callback) {
    const startTime = performance.now(); // Start timing
    const response = document.getElementById('respons');

    if (response) {
        const your_question = document.createElement('span');
        your_question.innerText = "You: " + question;
        response.appendChild(your_question);

        const loading = document.createElement('span');
        loading.innerText = `${selectedModel}: Loading...`;
        response.appendChild(loading);

        fetch(`http://127.0.0.1:8000/get_chat_response/?model=${selectedModel}&question=${encodeURIComponent(question)}`, { method: "GET" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const endTime = performance.now(); // End timing
                const responseTime = endTime - startTime;
                console.log(`Time taken for response: ${responseTime} ms`);

                response.removeChild(loading);
                callback(data);
            })
            .catch(error => {
                console.error('Error in getChatResponse:', error);
                loading.innerText = "Error fetching response. Please try again.";
            });
    }
}

export function getAdvChatResponse(question, callback) {
    const startTime = performance.now(); // Start timing
    const response = document.getElementById('respons');

    if (response) {
        const your_question = document.createElement('span');
        your_question.innerText = "You: " + question;
        response.appendChild(your_question);

        const loading = document.createElement('span');
        loading.innerText = `${selectedModel}: Loading...`;
        response.appendChild(loading);

        fetch(`http://127.0.0.1:8000/get_adv_response/?model=${selectedModel}&question=${encodeURIComponent(question)}`, { method: "GET" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const endTime = performance.now(); // End timing
                const responseTime = endTime - startTime;
                console.log(`Time taken for response: ${responseTime} ms`);

                response.removeChild(loading);
                callback(data);
            })
            .catch(error => {
                console.error('Error in getAdvChatResponse:', error);
                loading.innerText = "Error fetching response. Please try again.";
            });
    }
}

export function getSources(search_query, callback) {
    const sources_window = document.getElementById('sources_window');
    if (sources_window) sources_window.style.display = 'block';

    fetch(`http://127.0.0.1:8000/get_source_urls/?query=${encodeURIComponent(search_query)}`, { method: "GET" })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data["resp"]);
            callback(data);
        })
        .catch(error => {
            console.error('Error in getSources:', error);
        });
}