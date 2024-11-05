import { handleChatResponse, appendChatElement } from './content_archive_split/chat_response.js';

document.addEventListener('DOMContentLoaded', () => {
    // Move the variable declarations inside the DOMContentLoaded event
    const askButton = document.getElementById('askButton');
    console.log("askButton", askButton);
    const advAskButton = document.getElementById('advAskButton');
    const textbox = document.getElementById('textbox');

    askButton.addEventListener('click', get_chat_response);
    advAskButton.addEventListener('click', get_adv_chat_response);

    // Add console.log for debugging
    textbox.addEventListener('keyup', function(event) {
        console.log("Key pressed:", event.key); // Log key presses

        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submit behavior
            const isAdvanced = event.shiftKey || event.altKey;
            console.log("Is advanced:", isAdvanced); // Check if shift or alt was pressed

            if (isAdvanced) {
                console.log("Triggering advanced chat response");
                get_adv_chat_response();
            } else {
                console.log("Triggering normal chat response");
                get_chat_response();
            }
        }
    });
});

// Ask button click
export function get_chat_response() {

    const question = document.getElementById('textbox').value;
    console.log("Normal chat response triggered with question:", question);

    if (question) {
        handleChatResponse(question, false);
        logQuestion(question, 'Ask');
        document.getElementById('textbox').value = '';
    } else {
        alert("Please enter a question.");
    }
}

// Advanced Ask button click
export function get_adv_chat_response() {
    const question = document.getElementById('textbox').value;
    console.log("Advanced chat response triggered with question:", question);

    if (question) {
        handleChatResponse(question, true);
        logQuestion(question, 'Advanced Ask');
        document.getElementById('textbox').value = '';
    } else {
        alert("Please enter a question.");
    }
}


export function clear() {
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

// Function to get sources
export function get_sources(search_query) {
    const sources_window = document.getElementById('sources_window');
    const loadingSpinner = document.getElementById('loading_spinner');
    const source_urls = document.getElementById('source_urls');

    sources_window.style.display = 'block';
    loadingSpinner.style.display = 'block'; // Show the spinner
    source_urls.style.display = 'none'; // Hide the source list initially

    fetch(`http://127.0.0.1:8000/get_source_urls/?query=${String(search_query)}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            console.log(data["resp"]);
            const sources = data["resp"];
            source_urls.innerHTML = '';

            sources.forEach(source => {
                const url = source[0];
                const link = document.createElement('a');
                link.href = url;
                link.innerText = url;
                link.target = "_blank";

                const listItem = document.createElement('li');
                listItem.appendChild(link);
                listItem.classList.add('source-item');

                source_urls.appendChild(listItem);
            });

            loadingSpinner.style.display = 'none'; // Hide spinner
            source_urls.style.display = 'block'; // Show source list
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner in case of error
        });
}

// log question
export function logQuestion(question, button) {
    const currentUrl = window.location.href;

    fetch(`http://127.0.0.1:8000/log_question/?question=${encodeURIComponent(question)}&button=${encodeURIComponent(button)}&current_url=${encodeURIComponent(currentUrl)}`,
        { method: "GET" })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                console.error('Failed to log question');
            }
        })
        .catch(error => {
            console.error('Error logging question:', error);
        });
}