import { availableModels, selectedModels, getSelectedModels, loadModelSelection } from './content_archive_split/getSelectedModel.js';

// Available models
const availableModels = ["gpt-4o", "gpt-3.5-turbo"];

// Initialize model selection with gpt-4o as default
let selectedModels = ['gpt-4o', 'gpt-3.5-turbo'];

export function getSelectedModels() {
    // hard-coded atm
    return ['gpt-4o', 'gpt-3.5-turbo'];
}
// Model selection UI, I think, currently not in use
export function loadModelSelection() {
    const modelButtons = document.querySelectorAll('.model-option');

    modelButtons.forEach(button => {
        const modelName = button.dataset.model;

        // Default is gpt-4o
        if (modelName === 'gpt-4o') {
            button.classList.add('selected');
        }

        button.addEventListener('click', () => {
            if (button.classList.contains('selected')) {
                button.classList.remove('selected');
                selectedModels = selectedModels.filter(model => model !== modelName);
            } else {
                if (selectedModels.length < 2) {
                    button.classList.add('selected');
                    selectedModels.push(modelName);
                } else {
                    alert('You can only select up to 2 models.');
                }
            }
        });
    });
}