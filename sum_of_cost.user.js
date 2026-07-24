// ==UserScript==
// @name         FI - Sum of Cost
// @version      1.1.0
// @description  Sum of all Cost for next month
// @author       DrTraxx
// @match        https://fracht-imperium.de/game/bank.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fracht-imperium.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const costsPersonal = parseFloat(document.getElementById('monatsgehaelter')?.children[1]?.children[0]?.children[1]?.textContent?.replace(/\D+/gm, '') / 100) || 0,
          costsCredit = parseFloat(document.getElementById('kreditraten')?.children[1]?.children[0]?.children[1]?.children[0]?.children[3]?.textContent?.replace(/\D+/g, '') / 100) || 0;

    let nextRateLeasing = 0;

    document.getElementsByClassName('stat-card')[3].style.display = 'none';

    for (const tr of document.getElementById('leasing').getElementsByTagName('tr')) {
        if (tr.firstElementChild.localName === 'th' || tr.outerHTML.includes('bezahlt')) {
            continue;
        }

        const addRate = parseFloat(tr.outerHTML.match(/(?:\<td\>)(?<value>[\d\.]+\,\d+)/gm)[0].replace(/\D+/g, '') / 100);

        nextRateLeasing += addRate;
    }

    const sumOfCosts = costsPersonal + costsCredit + nextRateLeasing,
          insrtElem = document.createElement('div');

    insrtElem.className = 'stat-card';
    insrtElem.innerHTML = `<span class="label">Summe nächster Abzüge</span><span class="value good">${ sumOfCosts.toLocaleString().includes(',') ? sumOfCosts.toLocaleString() : sumOfCosts.toLocaleString() + ',00' } €</span><span class="sub">alle Angaben ohne Gewehr und Gewähr!</span>`;

    document.getElementsByClassName('stats-strip')[0].appendChild(insrtElem);

})();
