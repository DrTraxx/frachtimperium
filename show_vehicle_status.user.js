// ==UserScript==
// @name         FI - Show Vehicle Status
// @version      1.2.1
// @description  Shows usage percentage on dispatch
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/dispatch.php*
// @match        https://frachtimperium.de/game/dispatch.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    const vehicleCards = await fetch('https://frachtimperium.de/game/fuhrpark.php')
        .then(resp => {
            return resp.text();
        })
        .then(html => {
            const vehicleDataObject = {};
            const doc = new DOMParser().parseFromString(html, "text/html");
            const cards = doc.querySelectorAll('article[id*="vehicle"]');
            for (const card of cards) {
                const id = card.id.replace(/\D+/, '');
                const platePrefix = card.querySelector('.fi-license-plate__prefix').innerText.trim();
                const plateSerial = card.querySelector('.fi-license-plate__serial').innerText.trim();
                const percentage = card.querySelector('.condition-percent-chip').innerText.trim();
                vehicleDataObject[id] = { platePrefix, plateSerial, percentage };
            }
            return vehicleDataObject;
        });

    const dispatchCards = document.querySelectorAll('article.vehicle-overview-card');

    for (const card of dispatchCards) {
        const id = card.dataset.href.split('vehicle_id=')[1];
        const vehicleStatus = vehicleCards[id].percentage;
        const numPercentage = +vehicleStatus.replace('%', '').replace(',', '.');

        const usageElem = document.createElement('span');
        usageElem.classList.add('vehicle-overview-plate');
        usageElem.title = 'aktueller Fahrzeugverschleiß';
        usageElem.innerText = vehicleStatus;

        if (numPercentage <= 40 && numPercentage > 35) {
            usageElem.style.cssText = 'color: orange !important';
        }
        if (numPercentage <= 35) {
            usageElem.style.cssText = 'color: red !important';
        }

        card.querySelector('.vehicle-overview-plate').after(usageElem);
    }

    for (const node of document.querySelectorAll('.availability-value')) {
        if (node.textContent.includes('HU-Prüfer')) {
            node.textContent = 'Fahrzeug/ Anhänger/ Auflieger beim TÜV';
        } else if (node.textContent.includes('Fahrzeug nicht fahrbereit') || node.textContent.includes('Anhänger nicht einsatzbereit')) {
            node.textContent = 'Werkstatt/ defekt';
        }
    }
})();