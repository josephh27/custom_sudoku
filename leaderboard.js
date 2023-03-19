const leaderboard = document.querySelector(".leaderboard");
const recordHolderContainer = document.querySelector("[record-holder-container]");
const recordTemplate = document.querySelector("#leaderboard-template");
const recordHolder = document.querySelector("[record-holder]");

let players = [];

refreshLeaderboard = () => {
    fetch("records.json")
    .then(res => res.json())
    .then(data => {
        data = data.sort((a, b) => {
            if (a['time'] > b['time']) return 1;
            if (a['time'] < b['time']) return -1;
            return 0;
        })
        players = data.map(player => {
            const recordsTemplate = recordTemplate.content.cloneNode(true).children[0];
            const timeTemplate = recordTemplate.content.cloneNode(true).children[1];
            recordsTemplate.textContent = player.name;
            timeTemplate.textContent = player.time;
            recordHolderContainer.append(recordsTemplate);
            recordHolderContainer.append(timeTemplate);
        })
    })
}
    
