// ==UserScript==
// @name         FI - Select Finishing Target
// @version      1.0.1
// @description  Select Finishing Target as Start - PREMIUM ONLY
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/freight-market.php*
// @match        https://fracht-imperium.de/game/subcontract_market.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    const vehicleCards = await fetch('https://fracht-imperium.de/game/dispatch.php')
        .then(resp => {
            return resp.text();
        })
        .then(html => {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.getElementsByClassName('vehicle-overview-card');
        });

    const typeExpr = /(?:Fahrer\n\s+)(?<type>.+)/gm,
        finishExpr = /(?:Endet am\n\s+)(?<date>(?<d>\d\d)\.(?<m>\d\d)\.(?<y>\d\d\d\d))(?:\s)(?<time>\d\d:\d\d)(?:\sin\s)(?<place>.+)/gm;

    const divElem = document.createElement('div');

    divElem.id = "dt_fi_finishing_target";
    divElem.innerHTML = `<label for="dt_fi_sel_finish">Zielorte Fahrzeuge<a id="dt_fi_set_max_distance" style="cursor:pointer;margin-left:15em;" title="Einstellungen">⚙️</a></label><select id="dt_fi_sel_finish"><option value="">Fahrzeug wählen</option></select>`;

    document.getElementsByClassName('filter-grid')[0].appendChild(divElem);

    for (const card of vehicleCards) {

        const typeRawTxt = card.children[2].innerText,
            finishRawTxt = card.children[3].innerText,
            typeMatches = typeRawTxt.matchAll(typeExpr),
            finishMatches = finishRawTxt.matchAll(finishExpr),
            cardTitle = card.children[1].innerText.trim(),
            insertOption = document.createElement('option');

        let type, finishDate, finishTime, finishPlace;

        for (const match of typeMatches) {
            type = match.groups.type;
        }

        if (finishRawTxt.includes('Frei ab')) {
            const now = new Date();

            finishDate = now.toLocaleDateString('de-DE', { 'month': '2-digit', 'day': '2-digit', 'year': 'numeric' });
            finishTime = now.toLocaleTimeString('de-DE', { 'hour': '2-digit', 'minute': '2-digit' });
            finishPlace = finishRawTxt.match(/jetzt\sin.+/g)[0].replace('jetzt in ', '').trim();

        }

        for (const match of finishMatches) {
            finishDate = match.groups.date;
            finishTime = match.groups.time;
            finishPlace = match.groups.place ? match.groups.place : document.getElementsByClassName('fi-mini-pill')[0].getElementsByTagName('strong')[0].textContent;
        }


        insertOption.value = finishPlace.replace(/\s\w\w$/gm, '');
        insertOption.innerText = `${ cardTitle } (${ type }), ${ finishPlace } (${ finishDate }, ${ finishTime } Uhr)`;

        document.getElementById('dt_fi_sel_finish').appendChild(insertOption);
    }

    async function changeMaxDistance (e) {
        const maxDistance = +localStorage.fi_dt_selMaxDistance || 20;

        const newMaxDistance = await prompt("neuen Start-Umkreis eingeben:", maxDistance);

        if (newMaxDistance) localStorage.fi_dt_selMaxDistance = +newMaxDistance || 20;
    }

    document.getElementById('dt_fi_sel_finish').addEventListener('change', function (e) { document.getElementById('start_radius_city').value = e.target.value; document.getElementById('start_radius_km').value = e.target.value ? +localStorage.fi_dt_selMaxDistance || 20 : ''; });
    document.getElementById('dt_fi_set_max_distance').addEventListener('click', changeMaxDistance);

})();