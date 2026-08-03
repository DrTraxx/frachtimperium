// ==UserScript==
// @name         FI - Toggle Dispatch Planner
// @version      1.1.1
// @description  toggle visibility Dispatch Planner
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/dispatch.php*
// @match        https://frachtimperium.de/game/dispatch.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .dt-fi-visibility {
            display: none !important;
        }
        .dt-fi-green {
            border-color: rgba(134,239,172,.70) !important;
            background: linear-gradient(180deg, rgba(55,201,135,.26), rgba(21,128,61,.18)) !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.10), 0 0 14px rgba(55,201,135,.22) !important;
        }
        .dt-fi-red {
            border-color: rgba(255,180,190,.70);
            background: linear-gradient(180deg, rgba(255,93,115,.28), rgba(185,28,28,.18));
            box-shadow: inset 0 1px 0 rgba(255,255,255,.10), 0 0 14px rgba(255,93,115,.24);
        }
        .dt-fi-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid rgba(255,255,255,.13);
            border-radius: 999px;
            padding: 5px 9px;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
        }
    `);

    const toggleBtn = document.createElement('a'),
        timelineElement = document.getElementsByClassName('timeline-legend')[0],
        plannerElement = document.getElementsByClassName('orders-floating')[0];

    function plannerClassToggle (e) {

        e.target.classList.toggle('dt-fi-green');

        if (e.target.classList.contains('dt-fi-green')) {
            e.target.innerText = 'Aufträge einblenden';
        } else {
            e.target.innerText = 'Aufträge ausblenden';
        }

        plannerElement.classList.toggle('dt-fi-visibility');
    }

    toggleBtn.id = 'dt_fi_toggle_btn';
    toggleBtn.className = 'dt-fi-badge dt-fi-red';
    toggleBtn.innerText = 'Aufträge ausblenden';
    toggleBtn.addEventListener('click', plannerClassToggle);
    toggleBtn.title = 'Aufträge aus- oder einblenden.';

    timelineElement.appendChild(toggleBtn);

})();