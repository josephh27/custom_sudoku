const leaderboard = document.querySelector(".leaderboard");
const recordHolderContainer = document.querySelector("[record-holder-container]");
const recordTemplate = document.querySelector("#leaderboard-template");
const recordHolder = document.querySelector("[record-holder]");

let players = [];

fetch("records.json")
.then(res => res.json())
.then(data => {
    console.log(data);
    players = data.map(player => {
        const recordsTemplate = recordTemplate.content.cloneNode(true).children[0];
        recordsTemplate.textContent = player.name;
        recordHolderContainer.append(recordsTemplate);
    })
})
