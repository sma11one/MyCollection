// ==UserScript==
// @name         copy sis001 text
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Extract specific text from a webpage, save as a .md file, and include the URL
// @author       Your Name
// @match        https://sis001.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and style the button
    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'Extract and Save as Markdown';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4285F4';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        button.style.fontSize = '16px';

        button.addEventListener('click', extractAndSaveMarkdown);
        document.body.appendChild(button);
    }

    // Function to extract the title, specific text, and URL, then save as .md
    function extractAndSaveMarkdown() {
        let extractedText = '';

        // Step 1: Get the <title> text
        const title = document.querySelector('title')?.innerText || 'Untitled';
        extractedText += `# ${title}\n\n`; // Markdown heading for the title

        // Step 2: Find the <form name="modactions">
        const form = document.querySelector('form[name="modactions"]');
        if (!form) {
            alert('Form with name "modactions" not found!');
            return;
        }

        // Step 3: Find the first <table> under the form with an ID pattern like "pid<number>"
        const table = form.querySelector('table[id^="pid"]');
        if (!table) {
            alert('Table with ID pattern "pid<number>" not found!');
            return;
        }

        // Extract the number from the table's ID
        const tableId = table.id;
        const numberMatch = tableId.match(/\d+$/); // Match the number at the end of the ID
        if (!numberMatch) {
            alert('Unable to extract the number from the table ID!');
            return;
        }
        const number = numberMatch[0];

        // Step 4: Find the <div> with ID "postmessage_<number>"
        const postDiv = document.querySelector(`#postmessage_${number}`);
        if (!postDiv) {
            alert(`Div with ID "postmessage_${number}" not found!`);
            return;
        }

        // Extract the text content from the <div>
        const postText = postDiv.innerText || 'No text found in the postmessage div.';
        extractedText += `## Post Content\n\n${postText}\n\n`; // Markdown formatting for the content

        // Step 5: Append the URL at the end
        const url = window.location.href;
        extractedText += `---\n[Source URL](${url})\n`;

        // Step 6: Save the extracted text as a .md file
        const blob = new Blob([extractedText], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Use the title as the file name, handling Chinese and special characters
        const sanitizedTitle = title
            .replace(/[\/\\?%*:|"<>]/g, '') // Remove only illegal filename characters
            .replace(/ /g, '_') || 'Untitled'; // Replace spaces with underscores, fallback to "Untitled"
        link.download = `${sanitizedTitle}.md`;
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(link.href);
    }

    // Add the button when the page loads
    createButton();
})();
