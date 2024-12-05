export function createSourcesWindow(mainPopup, additionalPopupId = 'additionalPopup') {
    // Sources Window
    const sourcesWindow = document.createElement('div');
    sourcesWindow.id = "sources_window";
    sourcesWindow.style.display = 'none';

    const sourcesHeader = document.createElement('div');
    sourcesHeader.id = "sources_window_header";

    const sourcesTitle = document.createElement('h2');
    sourcesTitle.innerText = "Sources";

    const sourcesCloseIcon = document.createElement('span');
    sourcesCloseIcon.innerText = "❌";
    sourcesCloseIcon.className = "icon";
    sourcesCloseIcon.onclick = function() {
        sourcesWindow.style.display = 'none';
    };

    sourcesHeader.appendChild(sourcesTitle);
    sourcesHeader.appendChild(sourcesCloseIcon);

    // Loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.id = "loading_spinner";
    loadingSpinner.className = "spinner";
    loadingSpinner.style.display = 'none'; // Hide loading initially

    const sourceUrls = document.createElement('ul');
    sourceUrls.id = "source_urls";

    sourcesWindow.appendChild(sourcesHeader);
    sourcesWindow.appendChild(loadingSpinner);
    sourcesWindow.appendChild(sourceUrls);

    document.body.appendChild(sourcesWindow);

    // Draggable and resizable behavior
    makeDraggableAndResizable(mainPopup, sourcesWindow, additionalPopupId);

    return sourcesWindow;
}

function makeDraggableAndResizable(mainPopup, sourcesWindow, additionalPopupId) {
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight;
    const sourceWindowOffsetX = 10;

    mainPopup.querySelector('.draggable').addEventListener('mousedown', function(e) {
        if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) {
            return;
        }

        e.preventDefault();

        const rect = mainPopup.getBoundingClientRect();
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
        mainPopup.style.left = `${newX}px`;
        mainPopup.style.top = `${newY}px`;

        sourcesWindow.style.left = `${newX + mainPopup.offsetWidth + sourceWindowOffsetX}px`;
        sourcesWindow.style.top = `${newY}px`;

        const additionalPopup = document.getElementById(additionalPopupId);
        if (additionalPopup) {
            additionalPopup.style.left = `${newX + mainPopup.offsetWidth + 20}px`;
            additionalPopup.style.top = `${newY}px`;
        }
    }

    function resizeElement(e) {
        e.preventDefault();
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        if (newWidth > 250) {
            mainPopup.style.width = `${newWidth}px`;
        }
        if (newHeight > 300) {
            mainPopup.style.height = `${newHeight}px`;
        }

        sourcesWindow.style.left = `${mainPopup.offsetLeft + mainPopup.offsetWidth + sourceWindowOffsetX}px`;

        const additionalPopup = document.getElementById(additionalPopupId);
        if (additionalPopup) {
            additionalPopup.style.left = `${mainPopup.offsetLeft + mainPopup.offsetWidth + 20}px`;
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
