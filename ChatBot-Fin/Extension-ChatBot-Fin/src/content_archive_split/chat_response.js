import { handleChatResponse, appendChatElement } from './content_archive_split/chat_response.js';

// create and append elements for the chat
export function appendChatElement(parent, className, text) {
    const element = document.createElement('span');
    element.className = className;
    element.innerText = text;
    parent.appendChild(element);
    return element;
}

// chat response
export function handleChatResponse(question, isAdvanced = false) {
    const startTime = performance.now();
    const responseContainer = document.getElementById('respons');
    const additionalResponseContainer = document.getElementById('additionalPopup').querySelector('#respons');

    appendChatElement(responseContainer, 'your_question', question);
    appendChatElement(additionalResponseContainer, 'your_question', question);

    const mainLoadingElement = appendChatElement(responseContainer, 'agent_response', `gpt-4o: Loading...`);
    const additionalLoadingElement = appendChatElement(additionalResponseContainer, 'agent_response', `gpt-3.5-turbo: Loading...`);

    const encodedQuestion = encodeURIComponent(question);

    const endpoint = isAdvanced ? 'get_adv_response' : 'get_chat_response';

    fetch(`http://127.0.0.1:8000/${endpoint}/?question=${encodedQuestion}&models=gpt-4o,gpt-3.5-turbo&is_advanced=${isAdvanced}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            console.log(`Time taken for response: ${responseTime} ms`);

            mainLoadingElement.innerText = `gpt-4o: ${data.resp['gpt-4o']}`;
            additionalLoadingElement.innerText = `gpt-3.5-turbo: ${data.resp['gpt-3.5-turbo']}`;

            document.getElementById('textbox').value = '';
            responseContainer.scrollTop = responseContainer.scrollHeight;
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);

            mainLoadingElement.innerText = "gpt-4o: Failed to load response.";
            additionalLoadingElement.innerText = "gpt-3.5-turbo: Failed to load response.";
        });
}
