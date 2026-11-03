
document.addEventListener("DOMContentLoaded", () => {

    const investigation =
        document.getElementById("investigation");

    const verdict =
        document.getElementById("verdict");

    if (!investigation || !verdict) return;

    const suspects = {
        asha: {
            name: "ASHA",
            role: "Research Assistant",
            answers: [
                "I left the university at 11:40 PM.",
                "I had no reason to enter the server room.",
                "Check the exit records. They prove when I left."
            ]
        },

        rohan: {
            name: "ROHAN",
            role: "IT Technician",
            answers: [
                "I was repairing a router in another building.",
                "Yes, that maintenance card belongs to me. But I didn't use it!",
                "I don't have a maintenance ticket for that repair."
            ]
        },

        mira: {
            name: "MIRA",
            role: "System Administrator",
            answers: [
                "I was attending an online meeting.",
                "My account was used, but I wasn't at that computer.",
                "The meeting recording can confirm where I was."
            ]
        }
    };

    const questions = [
        "Where were you at 11:59 PM?",
        "What is your connection to the evidence?",
        "What can prove your statement?"
    ];

    const panel = document.createElement("section");
    panel.className = "case-panel";

    panel.innerHTML = `
        <h2 style="color:#ff465b;margin-bottom:15px">
            SUSPECT INTERROGATION ROOM
        </h2>

        <p style="color:#99a4b7;margin-bottom:20px">
            Select a suspect and question their alibi.
        </p>

        <div id="suspectButtons"></div>

        <div id="interrogationContent"
             style="margin-top:25px">
        </div>
    `;

    investigation.insertBefore(panel, verdict);

    const buttons =
        panel.querySelector("#suspectButtons");

    const content =
        panel.querySelector("#interrogationContent");

    Object.entries(suspects).forEach(([id, suspect]) => {

        const button = document.createElement("button");
        button.textContent = suspect.name;
        button.style.margin = "5px";

        button.addEventListener("click", () => {
            showSuspect(id);
        });

        buttons.appendChild(button);
    });

    function showSuspect(id) {

        const suspect = suspects[id];
        content.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent =
            suspect.name + " — " + suspect.role;

        heading.style.marginBottom = "20px";
        content.appendChild(heading);

        questions.forEach((question, index) => {

            const button = document.createElement("button");
            button.textContent = question;
            button.style.display = "block";
            button.style.marginBottom = "12px";

            const answer = document.createElement("p");
            answer.style.display = "none";
            answer.style.padding = "16px";
            answer.style.background = "#1b2633";
            answer.style.borderLeft = "3px solid #ff465b";
            answer.style.marginBottom = "20px";
            answer.style.lineHeight = "1.7";

            answer.textContent = suspect.answers[index];

            button.addEventListener("click", () => {
                answer.style.display =
                    answer.style.display === "none"
                    ? "block"
                    : "none";
            });

            content.append(button, answer);
        });
    }
});

