// preferredLinks.js

export function setupPreferredLinks(settings_window, settingsIcon) {
    // Preferred Links Section
    const preferredLinksContainer = document.createElement('div');
    preferredLinksContainer.id = "preferred_links_container";

    const preferredLinksHeader = document.createElement('div');
    preferredLinksHeader.id = "preferred_links_header";
    preferredLinksHeader.innerText = "Preferred Links";

    const toggleIcon = document.createElement('span');
    toggleIcon.innerText = "⯆"; // Down arrow

    preferredLinksHeader.appendChild(toggleIcon);
    preferredLinksContainer.appendChild(preferredLinksHeader);

    const preferredLinksContent = document.createElement('div');
    preferredLinksContent.id = "preferred_links_content";

    // Add Link Button
    const addLinkButton = document.createElement('div');
    addLinkButton.id = "add_link_button";
    addLinkButton.innerText = "+";
    addLinkButton.onclick = function () {
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
    preferredLinksHeader.onclick = function () {
        if (preferredLinksContent.style.display === "none") {
            preferredLinksContent.style.display = "block";
            toggleIcon.innerText = "⯅"; // Up arrow
        } else {
            preferredLinksContent.style.display = "none";
            toggleIcon.innerText = "⯆"; // Down arrow
        }
    };

    // Load preferred links when settings are opened
    settingsIcon.onclick = function () {
        const rect = settingsIcon.getBoundingClientRect();
        settings_window.style.top = `${rect.bottom}px`;
        settings_window.style.left = `${rect.left}px`;
        settings_window.style.display = settings_window.style.display === 'none' ? 'block' : 'none';

        // Load preferred links
        if (settings_window.style.display === 'block') {
            loadPreferredLinks();
        }
    };
}
