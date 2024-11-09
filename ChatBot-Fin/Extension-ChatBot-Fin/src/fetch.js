import { handleResponse, updateSources } from './ui.js';

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
            console.error('There was a problem with your fetch operation:', error);
        });
}

export function clearMessages() {
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

export function getChatResponse(question, callback) {
    const startTime = performance.now(); // Start timing
    const response = document.getElementById('respons');

    const your_question = document.createElement('span');
    your_question.innerText = "You: " + question;
    response.appendChild(your_question);

    const loading = document.createElement('span');
    loading.innerText = "FinGPT: Loading...";
    document.getElementById("respons").appendChild(loading);

    fetch(`http://127.0.0.1:8000/get_chat_response/?question=${encodeURIComponent(question)}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now(); // End timing
            const responseTime = endTime - startTime;
            console.log(`Time taken for response: ${responseTime} ms`); // Log the response time

            //Database call?

            response.removeChild(loading);
            callback(data);
        });
}

export function getAdvChatResponse(question, callback) {
    const startTime = performance.now(); // Start timing
    const response = document.getElementById('respons');
    const searchQuery = question;

    const your_question = document.createElement('span');
    your_question.innerText = "You: " + question;
    response.appendChild(your_question);

    const loading = document.createElement('span');
    loading.innerText = "FinGPT: Loading...";
    document.getElementById("respons").appendChild(loading);

    fetch(`http://127.0.0.1:8000/get_adv_response/?question=${encodeURIComponent(question)}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now(); // End timing
            const responseTime = endTime - startTime;
            console.log(`Time taken for response: ${responseTime} ms`); // Log the response time

            //Database call?

            response.removeChild(loading);
            callback(data);
        });
}

export function getSources(search_query, callback) {
    const sources_window = document.getElementById('sources_window');
    sources_window.style.display = 'block';

    fetch(`http://127.0.0.1:8000/get_source_urls/?query=${encodeURIComponent(search_query)}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            console.log(data["resp"]);
            callback(data);
        });
}
