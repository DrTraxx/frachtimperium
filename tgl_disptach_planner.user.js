// ==UserScript==
// @name         FI - Toggle Dispatch Planner
// @version      1.0.0
// @description  toggle visibility Dispatch Planner
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/dispatch.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .dt-fi-visibility {
            display: none !important;
        }
    `);

    const toggleBtn = document.createElement('a'),
          timelineElement = document.getElementsByClassName('timeline-legend')[0],
          plannerElement = document.getElementsByClassName('orders-floating')[0];

    function plannerClassToggle(e) {

        if (e.target.classList.contains('legend-pause')) {

            e.target.classList.add('legend-loaded');
            e.target.classList.remove('legend-pause');
            e.target.innerText = 'Aufträge anzeigen';
        } else {

            e.target.classList.add('legend-pause');
            e.target.classList.remove('legend-loaded');
            e.target.innerText = 'Aufträge ausblenden';
        }

        plannerElement.classList.toggle('dt-fi-visibility');
    }

    toggleBtn.id = 'dt_fi_toggle_btn';
    toggleBtn.className = 'badge legend-pause';
    toggleBtn.innerText = 'Aufträge ausblenden';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.addEventListener('click', plannerClassToggle);
    toggleBtn.title = 'Aufträge aus- oder einblenden.';

    timelineElement.appendChild(toggleBtn);

})();
