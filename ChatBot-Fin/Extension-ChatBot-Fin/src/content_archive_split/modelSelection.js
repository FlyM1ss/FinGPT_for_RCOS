export function createModelSelection(settingsWindow, availableModels, selectedModels) {
    // Model Selection Section
    const modelSelectionContainer = document.createElement('div');
    modelSelectionContainer.id = "model_selection_container";

    const modelSelectionHeader = document.createElement('div');
    modelSelectionHeader.id = "model_selection_header";
    modelSelectionHeader.innerText = `Model: ${selectedModels.join(' & ')}`; // Show default

    const modelToggleIcon = document.createElement('span');
    modelToggleIcon.innerText = "⯆";

    modelSelectionHeader.appendChild(modelToggleIcon);
    modelSelectionContainer.appendChild(modelSelectionHeader);

    const modelSelectionContent = document.createElement('div');
    modelSelectionContent.id = "model_selection_content";
    modelSelectionContent.style.display = "none";

    // Handle model selection
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

        // Default selected models
        if (selectedModels.includes(model)) {
            modelItem.classList.add('selected-model');
        }

        modelItem.onclick = function() {
            handleModelSelection(modelItem, model);
        };
        modelSelectionContent.appendChild(modelItem);
    });

    modelSelectionContainer.appendChild(modelSelectionContent);
    settingsWindow.appendChild(modelSelectionContainer);

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
}
