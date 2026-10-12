// ==UserScript==
// @name         FI - Main Page Tag Change
// @version      1.2.0
// @description  Change Tags on Main Page to Links
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/*
// @match        https://frachtimperium.de/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const fameBadge = document.getElementsByClassName('fi-fame-badge')[0],
        levelBadge = document.getElementsByClassName('fi-level-badge')[0],
        statBadges = document.getElementsByClassName('fi-stat-badge'),
        vehicleBadge = statBadges[0],
        trailerBadge = statBadges[1],
        personalBadge = statBadges[2],
        companyBadge = document.getElementsByClassName("fi-company-badge")[0],
        moneyBadge = document.getElementsByClassName("fi-money-badge")[0],
        timerBadge = document.getElementsByClassName("fi-no-timer")[0] || null,
        miniPill = document.getElementsByClassName("fi-mini-pill")[0],
        dispatchBadge = document.createElement('a'),
        tourBadge = document.createElement('a'),
        helpBadge = document.createElement('a'),
        workshopBadge = document.createElement('a');

    dispatchBadge.innerText = 'Disposition';
    dispatchBadge.className = 'fi-stat-badge';
    dispatchBadge.href = 'https://frachtimperium.de/game/dispatch.php';

    tourBadge.innerText = 'Tourenplaner';
    tourBadge.className = 'fi-stat-badge';
    tourBadge.href = 'https://frachtimperium.de/game/tour-planner.php';

    workshopBadge.innerText = 'Werkstatt';
    workshopBadge.className = 'fi-stat-badge';
    workshopBadge.href = 'https://frachtimperium.de/game/workshop.php';

    helpBadge.innerText = 'Büro';
    helpBadge.className = 'fi-stat-badge';
    helpBadge.href = 'https://frachtimperium.de/game/office.php';

    personalBadge.parentNode.appendChild(dispatchBadge);
    personalBadge.parentNode.appendChild(tourBadge);
    personalBadge.parentNode.appendChild(workshopBadge);
    personalBadge.parentNode.appendChild(helpBadge);


    function changeTag (elem, href) {
        const newTag = document.createElement('a');

        newTag.innerHTML = elem.innerHTML;
        newTag.classList = elem.classList;
        newTag.href = `https://frachtimperium.de/game/${ href }.php`;

        elem.parentNode.replaceChild(newTag, elem);
    }

    // changeTag(fameBadge, "agency");
    changeTag(levelBadge, "company-site");
    changeTag(vehicleBadge, "fuhrpark");
    changeTag(trailerBadge, "fuhrpark");
    changeTag(personalBadge, "staff");
    // changeTag(companyBadge, "office");
    // changeTag(moneyBadge, "bank");
    if (timerBadge) changeTag(timerBadge, "company-site");
    changeTag(miniPill, "pc");

})();