const recordHolderContainer = document.querySelector("[record-holder-container]");
const recordTemplate = document.querySelector("#leaderboard-template");


let players = [
    {"name": "Kaido", "time": "01:36"},
    {"name": "Khan", "time": "01:56"},
    {"name": "Shiden", "time": "02:36"},
    {"name": "Takashi", "time": "01:06"}
];

export const addBlinkLeaderboard = (newAdd) => {
    players = localStorage.getItem('blinkingLeaderboard') ? JSON.parse(localStorage.getItem('blinkingLeaderboard')) : players;
    players.push(newAdd);
    localStorage.setItem('blinkingLeaderboard', JSON.stringify(players));
} 


export const refreshLeaderboard = () => {
        while (recordHolderContainer.firstChild) {
            recordHolderContainer.removeChild(recordHolderContainer.firstChild);
        }

        let data = localStorage.getItem('blinkingLeaderboard') ? JSON.parse(localStorage.getItem('blinkingLeaderboard')): players
        data = data.sort((a, b) => {
            if (a['time'] > b['time']) return 1;
            if (a['time'] < b['time']) return -1;
            return 0;
        })
        
        data.map(player => {
            const modeTemplate = recordTemplate.content.cloneNode(true).children[0];
            const recordsTemplate = recordTemplate.content.cloneNode(true).children[1];
            const timeTemplate = recordTemplate.content.cloneNode(true).children[2];
            recordsTemplate.textContent = player.name;
            timeTemplate.textContent = player.time;
            modeTemplate.textContent = player.mode;
            recordHolderContainer.append(modeTemplate);
            recordHolderContainer.append(recordsTemplate);
            recordHolderContainer.append(timeTemplate);
        })
        localStorage.setItem('blinkingLeaderboard', JSON.stringify(data));
    }

    
