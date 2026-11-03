
 // CASE ZERO - DIGITAL DETECTIVE
// Interactive Investigation System

const startBtn = document.getElementById("startBtn");
const investigation = document.getElementById("investigation");
const cards = document.querySelectorAll(".investigation-card");
const systemMessage = document.querySelector(".system-message");

// Case information
const caseData = [
    {
        title: "EVIDENCE LOCKER",
        items: [
            "EVIDENCE 01: A login was recorded at 11:51 PM from Lab PC-07.",
            "EVIDENCE 02: A maintenance access card was used at 11:57 PM.",
            "EVIDENCE 03: The confidential file was exported at 11:59 PM."
        ]
    },
    {
        title: "SUSPECT PROFILES",
        items: [
            "SUSPECT 01 - ASHA: Research assistant. Claims she left at 11:40 PM.",
            "SUSPECT 02 - ROHAN: IT technician. Has access to maintenance areas.",
            "SUSPECT 03 - MIRA: Administrator. Has permission to access confidential files."
        ]
    },
    {
        title: "INCIDENT TIMELINE",
        items: [
            "11:40 PM - Asha claims she left the university.",
            "11:51 PM - Lab PC-07 records a successful login.",
            "11:57 PM - A maintenance access card is used.",
            "11:59 PM - The confidential file is exported."
        ]
    }
];

// Start Investigation
startBtn.addEventListener("click", function () {

    investigation.classList.remove("hidden");

    startBtn.textContent = "INVESTIGATION ACTIVE";

    startBtn.disabled = true;

    startBtn.style.opacity = "0.6";

    systemMessage.textContent =
        "SYSTEM ONLINE: Investigation started. Select a case file to examine evidence.";

    investigation.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

// Create evidence display
const evidencePanel = document.createElement("div");

evidencePanel.style.marginTop = "25px";
evidencePanel.style.padding = "25px";
evidencePanel.style.background = "#111722";
evidencePanel.style.border = "1px solid #ff465b";
evidencePanel.style.borderRadius = "12px";
evidencePanel.style.display = "none";

investigation.appendChild(evidencePanel);

// Track opened files
const openedFiles = new Set();

// Make investigation cards interactive
cards.forEach((card, index) => {

    card.style.cursor = "pointer";
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    function openCaseFile() {

        const selected = caseData[index];

        openedFiles.add(index);

        evidencePanel.replaceChildren();

        const heading = document.createElement("h2");
        heading.textContent = selected.title;
        heading.style.color = "#ff465b";
        heading.style.marginBottom = "20px";

        evidencePanel.appendChild(heading);

        selected.items.forEach((item) => {

            const paragraph = document.createElement("p");

            paragraph.textContent = item;
            paragraph.style.marginBottom = "16px";
            paragraph.style.lineHeight = "1.7";
            paragraph.style.color = "#d1d5db";

            evidencePanel.appendChild(paragraph);

        });

        evidencePanel.style.display = "block";

        systemMessage.textContent =
            "FILES EXAMINED: " +
            openedFiles.size +
            " / 3";

        if (openedFiles.size === 3) {
            systemMessage.textContent =
                "ALL CASE FILES EXAMINED. You are ready to investigate the suspects further.";
        }

        evidencePanel.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    card.addEventListener("click", openCaseFile);

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCaseFile();
        }
    });

});

console.log("CASE ZERO Investigation System Loaded");
