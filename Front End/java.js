// Search box in top toolbar
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value;
        // Handle search functionality here
        alert('Searching for: ' + searchTerm);
    });
});

// To load more editing options for the modal box
document.addEventListener("DOMContentLoaded", function () {
    // Add event listener to the "More Options" button
    const moreOptionsButton = document.querySelector(".more-options-button");
    moreOptionsButton.addEventListener("click", function () {
        // Replace the contents of the modal container with the new div
        replaceContent();
    });

    // Function to replace the contents of the modal container
    function replaceContent() {
        // Get the modal container
        const modalContainer = document.querySelector(".modal-container-initial");
        // Get the new content div
        const newContentDiv = document.getElementById("modal-container-more");

        // Replace the contents of the modal container with the new div
        modalContainer.innerHTML = newContentDiv.innerHTML;
    }
});