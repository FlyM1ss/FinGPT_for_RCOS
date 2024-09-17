export function makeDraggableAndResizable(element) {
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    if (document.getElementById(element.id + "header")) {
        document.getElementById(element.id + "header").onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();

        const rect = element.getBoundingClientRect();
        const isRightEdge = e.clientX > rect.right - 10;
        const isBottomEdge = e.clientY > rect.bottom - 10;

        if (e.target.tagName !== 'SPAN' && e.target.tagName !== 'INPUT' && (isRightEdge || isBottomEdge)) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = rect.width;
            startHeight = rect.height;
            document.onmousemove = resizeElement;
        } else {
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e.preventDefault();
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = function(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2 + window.scrollY) + "px";
            element.style.left = (element.offsetLeft - pos1 + window.scrollX) + "px";
        };
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
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        isResizing = false;
    }
}
