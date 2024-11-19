export function makeDraggableAndResizable(element) {
    let isResizing = false;
    let isDragging = false;
    let startX, startY, startWidth, startHeight, offsetX, offsetY;

    // Enable dragging from the entire element, not just the header
    element.addEventListener('mousedown', function (e) {
        // Prevent dragging or resizing on interactive elements
        if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) {
            return;
        }

        e.preventDefault();

        const rect = element.getBoundingClientRect();
        const isRightEdge = e.clientX > rect.right - 10;
        const isBottomEdge = e.clientY > rect.bottom - 10;

        if (isRightEdge || isBottomEdge) {
            // Initiate resizing
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = rect.width;
            startHeight = rect.height;
            document.onmousemove = resizeElement;
        } else {
            // Initiate dragging
            isDragging = true;
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.onmousemove = dragElement;
        }

        document.onmouseup = closeActions;
    });

    function resizeElement(e) {
        e.preventDefault();
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        // Enforce minimum dimensions
        if (newWidth > 250) {
            element.style.width = `${newWidth}px`;
        }
        if (newHeight > 300) {
            element.style.height = `${newHeight}px`;
        }
    }

    function dragElement(e) {
        e.preventDefault();
        const newX = e.clientX - offsetX + window.scrollX;
        const newY = e.clientY - offsetY + window.scrollY;
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;

        // Sync additional elements
        syncWindows(newX, newY, element);
    }

    function closeActions() {
        document.onmouseup = null;
        document.onmousemove = null;
        isResizing = false;
        isDragging = false;
    }

    function syncWindows(newX, newY, element) {
        const sourcesWindow = document.getElementById('sources_window');
        if (sourcesWindow) {
            sourcesWindow.style.left = `${newX + element.offsetWidth + 10}px`;
            sourcesWindow.style.top = `${newY}px`;
        }

        const additionalPopup = document.getElementById('additionalPopup');
        if (additionalPopup) {
            additionalPopup.style.left = `${newX + element.offsetWidth + 20}px`;
            additionalPopup.style.top = `${newY}px`;
        }
    }
}
