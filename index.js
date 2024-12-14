let savedNames = [];

function addName() {
    const newName = document.getElementById("nameInput").value;
    if (savedNames.includes(newName)) {
        alert("Duplicate name found! Fix blud");
    } else {
        savedNames.push(newName);

        const mainSection = document.getElementById("mainSection");

        const playerContainer = document.createElement("div");
        playerContainer.classList.add("playerContainer");
        mainSection.appendChild(playerContainer); // Put the container in the main section

        const playerTitle = document.createElement("h2");
        playerTitle.innerHTML = newName;
        playerContainer.appendChild(playerTitle); // Put the player name in the container

        const scores = [
            { title: "2v1 Score:", id: "2v1Input" },
            { title: "1v1 Score:", id: "1v1Input" },
            { title: "Box Score:", id: "boxInput" }
        ];

        function createScoreSection(title, inputId) {
            const innerPlayerContainer = document.createElement("div");
            innerPlayerContainer.classList.add("innerPlayerContainer");
            playerContainer.appendChild(innerPlayerContainer); // Put the inner container in the player container

            const scoreTitle = document.createElement("h4");
            scoreTitle.textContent = title;
            innerPlayerContainer.appendChild(scoreTitle); // Put the score title in the inner container

            const scoreInput = document.createElement("input");
            scoreInput.classList.add("score-box");
            scoreInput.type = "number";
            scoreInput.min = "1.5";
            scoreInput.id = inputId;
            scoreInput.max = "6";
            scoreInput.step = "0.1";
            innerPlayerContainer.appendChild(scoreInput);

            // Add event listener to update average
            scoreInput.addEventListener("input", () => calculateAndUpdateAverage(playerContainer));

            return innerPlayerContainer;
        }

        scores.forEach(score => {
            const scoreSection = createScoreSection(score.title, score.id);
            playerContainer.appendChild(scoreSection);
        });

        const innerScoreContainer = document.createElement("div");
        innerScoreContainer.classList.add("innerScoreContainer");
        playerContainer.appendChild(innerScoreContainer);

        const scoreTitle = document.createElement("h4");
        scoreTitle.textContent = "SCORE FROM CST:";
        innerScoreContainer.appendChild(scoreTitle);

        const scoreShow = document.createElement("h3");
        scoreShow.textContent = "0"; // Initialize with 0
        innerScoreContainer.appendChild(scoreShow);

        const removeIndividualAttendee = document.createElement("button");
        removeIndividualAttendee.textContent = "Remove Attendee";
        removeIndividualAttendee.addEventListener("click", removeIndividual);
        playerContainer.appendChild(removeIndividualAttendee);
    }
}

function calculateAndUpdateAverage(playerContainer) {
    // Get all score inputs in the current player container
    const scoreInputs = playerContainer.querySelectorAll(".score-box");
    let total = 0;
    let count = 0;

    scoreInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            total += value;
            count++;
        }
    });

    const average = count > 0 ? (total / count).toFixed(2) : 0;

    
    const scoreShow = playerContainer.querySelector("h3");
    scoreShow.textContent = average;
}

document.getElementById("nameInput").addEventListener("keydown", function (event) {
    if (event.key === 'Enter' && document.getElementById("nameInput").value.trim() != "") {
        addName();
    }
});

function removeLastName() {
    const mainSection = document.getElementById("mainSection");

    if (mainSection.children.length > 0) {
        const lastPlayerContainer = mainSection.lastElementChild;
        const lastPlayerName = lastPlayerContainer.querySelector("h2").textContent;
        const index = savedNames.indexOf(lastPlayerName);
        if (index !== -1) {
            savedNames.splice(index, 1); 
        }
        mainSection.removeChild(lastPlayerContainer);

    } else {
        console.log("NO NAMES TO REMOVE, BLUD");
    }
}

function removeIndividual(event) {
    const playerContainer = event.target.parentElement;
    const playerName = playerContainer.querySelector("h2").textContent;
    const index = savedNames.indexOf(playerName);
    if (index !== -1) {
        savedNames.splice(index, 1);
    }
    playerContainer.remove();
}


function copyFilledFormat() {
    const mainSection = document.getElementById("mainSection");
    const playersContainers = mainSection.querySelectorAll(".playerContainer");

    const attendees = [];
    const evaluations = [];

    playersContainers.forEach(playerContainer => {
        const playerName = playerContainer.querySelector("h2").textContent; // Corrected this line
        attendees.push(playerName);

        const scoreInputs = playerContainer.querySelectorAll(".score-box"); // Fixed class name here
        const scores = Array.from(scoreInputs).map(input => parseFloat(input.value) || 0);

        const total = scores.reduce((sum, score) => sum + score, 0);
        
        let average; // Declared outside the if-else block
        if (scores.length > 0) {
            average = (total / scores.length).toFixed(2);
        } else {
            average = 1.5;
        }

        const playerEvaluation = `**${playerName}**\n2v1s: ${scores[0] || 1.5}\nDisadv: ${scores[1] || 1.5}\nBox: ${scores[2] || 1.5}\n**Average: ${average}**`;
        evaluations.push(playerEvaluation);
    });

    const filledOutFormat = `• Event: \n• Username:\n• Supervisor:\n• Name of attendees: ${attendees.join(", ")}\n• Evaluation of attendees:\n\n${evaluations.join("\n\n")}\n\n• Quota:\n• Assigned scores:\n• Proof:`;

    console.log(filledOutFormat);
    navigator.clipboard.writeText(filledOutFormat).then(() => {
        alert("Format has been copied to your clipboard!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}
