// ==UserScript==
// @name         Open in Digikala Live Container
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect digikala:// links to LiveContainer on iOS
// @author       Based on nathandaven's scripts, modified for specific scheme
// @match        *://*.digikala.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    function redirectToLiveContainer(url) {
        if (url.startsWith('digikala://')) {
            const encodedUrl = btoa(url);
            window.location.href = `livecontainer://open-url?url=${encodedUrl}`;
            return true;
        }
        return false;
    }

    function processLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('digikala://')) {
                link.setAttribute('href', `javascript:void(0);`);
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    redirectToLiveContainer(href);
                });
            }
        });
    }

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver(processLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial process
    processLinks();

    // Global click listener for safety
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && redirectToLiveContainer(href)) {
                e.preventDefault();
            }
        }
    });
})();
