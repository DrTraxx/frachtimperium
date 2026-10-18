// ==UserScript==
// @name         FI - Select Finishing Target
// @version      1.2.1
// @description  Select Finishing Target as Start - PREMIUM ONLY
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/freight-market.php*
// @match        https://frachtimperium.de/game/freight-market.php*
// @match        https://fracht-imperium.de/game/subcontract_market.php*
// @match        https://frachtimperium.de/game/subcontract_market.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    const vehicleCards = await fetch('https://frachtimperium.de/game/dispatch.php')
        .then(resp => {
            return resp.text();
        })
        .then(html => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.getElementsByClassName('vehicle-overview-card');
        });

    function switchType (type) {
        switch (type) {
            case "Plane": return "curtain";
            case "Tanker": return "food_tanker";
            case "Solo Kühler": return "refrigerated_box";
            case "Plane": return "box";
            case "Gefahrgut": return "hazmat_tanker";
            case "Kipper": return "grain_tipper";
            case "Container": return "container_chassis";
            case "Transporter": return "van";
            case "Kühler": return "refrigerated_box";
            case "Solo LKW": return "box";
            default: return "";
        }
    }

    const divElem = document.createElement('div');

    divElem.id = "dt_fi_finishing_target";
    divElem.innerHTML = `<label for="dt_fi_sel_finish">Zielorte Fahrzeuge<a id="dt_fi_set_max_distance" style="cursor:pointer;margin-left:15em;" title="Einstellungen">⚙️</a></label><select id="dt_fi_sel_finish"><option value="">Fahrzeug wählen</option></select>`;

    document.getElementsByClassName('filter-grid')[0].appendChild(divElem);

    for (const card of vehicleCards) {
        console.log(card);

        const licensePlate = card.querySelector('.vehicle-overview-plate').innerText.trim();
        const vehicleName = card.querySelector('.vehicle-title-name').innerText.trim();
        const vehicleType = card.querySelector('.vehicle-carrier-chip').innerText.trim();
        const vehicleDispoStatus = card.querySelector('.availability-kicker').innerText.trim();
        const vehicleEndStatus = card.querySelector('.availability-value').innerText.trim().split('\n');
        const vehicleAutomaticStatus = card.querySelector('.vehicle-automatic-badge') !== null;
        const insertOption = document.createElement('option');

        if (vehicleDispoStatus === "gesperrt" || vehicleAutomaticStatus === true) continue;

        const finishPlace = vehicleEndStatus[1].replace('in', '').trim();

        let finishDate, finishTime;

        if (vehicleDispoStatus === "Frei ab") {
            const now = new Date();

            finishDate = now.toLocaleDateString('de-DE', { 'month': '2-digit', 'day': '2-digit', 'year': 'numeric' });
            finishTime = now.toLocaleTimeString('de-DE', { 'hour': '2-digit', 'minute': '2-digit' });
        } else {
            const splittedEndStatus = vehicleEndStatus[0].split(' ');
            finishDate = splittedEndStatus[0];
            finishTime = splittedEndStatus[1];
        }

        insertOption.value = finishPlace.replace(/\s\w\w$/gm, '');
        insertOption.innerText = `"${ vehicleName }" - ${ licensePlate } (${ vehicleType }), ${ finishPlace } (${ finishDate }, ${ finishTime } Uhr)`;
        insertOption.setAttribute('vehicletype', switchType(vehicleType));

        document.getElementById('dt_fi_sel_finish').appendChild(insertOption);
    }

    async function changeMaxDistance (e) {
        const maxDistance = +localStorage.fi_dt_selMaxDistance || 20;

        const newMaxDistance = await prompt("neuen Start-Umkreis eingeben:", maxDistance);

        if (newMaxDistance) localStorage.fi_dt_selMaxDistance = +newMaxDistance || 20;
    }

    function changeValues (e) {
        document.getElementById('start_radius_city').value = e.target.value;
        document.getElementById('start_radius_km').value = e.target.value ? +localStorage.fi_dt_selMaxDistance || 20 : '';
        document.getElementById('body_type').value = e.target.selectedOptions[0]?.attributes?.vehicletype?.value || '';
        document.getElementById('sort').value = 'distance_desc';
    }

    document.getElementById('dt_fi_sel_finish').addEventListener('change', changeValues);
    document.getElementById('dt_fi_set_max_distance').addEventListener('click', changeMaxDistance);

})();
