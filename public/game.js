async function main() {
    const urlVars = getUrlVars();
    document.getElementById("h1").textContent = "Player " + urlVars["p"];
    const { player, players } = await getPlayers(urlVars);
    generateTable(player, players);
}

function getUrlVars() {
    const vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

async function getPlayers(urlVars) {
    const playerIndex = urlVars["p"] - 1;
    const playersFetch = await fetch("/players?matchup="+urlVars["matchup"]);
    const players = await playersFetch.json();
    const player = players[playerIndex];

    // scramble players
    for ( let i=players.length - 1; i>0; i-- ) {
        const index = Math.floor(Math.random()*(i+1));
        const temp = players[i];
        players[i] = players[index];
        players[index] = temp;
    }

    return { player, players };
}

function click(id) {
    const elem = document.getElementById(id);
    if (elem.style.backgroundColor != "black") {
        elem.style.backgroundColor = "black";
        elem.children[0].style.color = "white";
    } else {
        elem.style.backgroundColor = "white";
        elem.children[0].style.color = "black";
    }
}

function generateTable(player, players) {
    const width = 6;
    const height = 4;

    // Add all players
    let index = 0;
    const tbody = document.getElementById("tbody");
    for (let row = 0; row < height; row++ ) {
        const tr = document.createElement("tr");
        for (let col = 0; col < width; col++ ) {
            const td = document.createElement("td");
            const id = "td" + index;
            td.id = id;
            td.onclick = function() { click(id) };

            // Add person's name to cell
            const paragraph = document.createElement("p");
            paragraph.textContent = players[index]["name"];
            td.append(paragraph);

            // Add person's img to cell
            const img = document.createElement("img");
            img.src = players[index]["imgUrl"];
            td.append(img);

            tr.append(td);
            index++;
        }
        tbody.append(tr);
    }
    
    // Add your secret player
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = width;
    
    // Add person's name to cell
    const paragraph = document.createElement("p");
    paragraph.textContent = player["name"];
    td.append(paragraph);

    // Add person's img to cell
    const img = document.createElement("img");
    img.src = player["imgUrl"];
    td.append(img);

    tr.append(td);
    tbody.append(tr);
}


main();
