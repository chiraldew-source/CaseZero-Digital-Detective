
document.addEventListener("DOMContentLoaded", () => {

    const investigation = document.getElementById("investigation");
    const verdict = document.getElementById("verdict");

    if (!investigation || !verdict) return;

    // DIGITAL EVIDENCE DATABASE

    const clues = [
        {
            id: "E01",
            title: "EXIT BADGE SCAN",
            description: "A badge exit was recorded at 11:40 PM.",
            suspect: "asha",
            explanation: "This supports Asha's statement that she left."
        },
        {
            id: "E02",
            title: "ADMIN LOGIN",
            description: "Mira's administrator account was used at 11:51 PM.",
            suspect: "mira",
            explanation: "The account belongs to Mira, but a login doesn't prove she was present."
        },
        {
            id: "E03",
            title: "MEETING RECORD",
            description: "A recorded meeting began at 11:45 PM.",
            suspect: "mira",
            explanation: "This supports Mira's claim that she was attending a meeting."
        },
        {
            id: "E04",
            title: "CARD + USB RECORD",
            description: "Maintenance card MT-14 and USB RK-17 were issued to one technician.",
            suspect: "rohan",
            explanation: "Both devices were assigned to Rohan, connecting his equipment to the incident."
        },
        {
            id: "E05",
            title: "MISSING REPAIR TICKET",
            description: "No repair ticket exists for the claimed router maintenance.",
            suspect: "rohan",
            explanation: "This contradicts Rohan's explanation for his whereabouts."
        }
    ];

    const suspects = [
        { id: "asha", name: "ASHA" },
        { id: "rohan", name: "ROHAN" },
        { id: "mira", name: "MIRA" }
    ];

    let selectedClue = null;

    const connections = new Map();

    // EVIDENCE BOARD DESIGN

    const styles = document.createElement("style");

    styles.textContent = `
        .evidence-board {
            background: #0d1420;
            border: 1px solid #ff465b;
            border-radius: 16px;
            padding: 28px;
            margin: 35px 0;
        }

        .board-title {
            font-size: 25px;
            color: #ff465b;
            margin-bottom: 12px;
        }

        .board-subtitle {
            color: #a8b3c5;
            line-height: 1.7;
            margin-bottom: 26px;
        }

        .board-layout {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 25px;
        }

        .board-column h3 {
            font-size: 14px;
            letter-spacing: 2px;
            color: #d9e1ef;
            margin-bottom: 15px;
        }

        .cz-clue,
        .cz-suspect {
            display: block;
            width: 100%;
            text-align: left;
            background: #182230;
            border: 1px solid #344155;
            border-radius: 10px;
            padding: 17px;
            margin: 0 0 12px;
            color: white;
            letter-spacing: normal;
            line-height: 1.5;
            cursor: pointer;
        }

        .cz-clue strong {
            display: block;
            margin-bottom: 8px;
            color: #ffbdc5;
        }

        .cz-clue small {
            font-size: 12px;
            color: #b2bdcc;
        }

        .cz-clue.selected {
            border-color: #ff465b;
            background: #35202c;
        }

        .cz-clue.connected {
            border-color: #35b98a;
        }

        .cz-suspect {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }

        .cz-clue:hover,
        .cz-suspect:hover {
            border-color: #ff465b;
            transform: translateY(-2px);
        }

        .board-status {
            padding: 20px;
            background: #15251f;
            border: 1px solid #285b45;
            border-radius: 10px;
            margin-top: 20px;
            color: #a3f3c8;
            line-height: 1.7;
        }

        .board-progress {
            color: #ffbdc5;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .board-reset {
            margin-top: 18px;
            background: #354153;
        }

        @media(max-width: 700px) {
            .board-layout {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(styles);

    // CREATE INVESTIGATION BOARD

    const board = document.createElement("section");
    board.className = "evidence-board";

    board.innerHTML = `
        <h2 class="board-title">🧩 EVIDENCE CONNECTION BOARD</h2>

        <p class="board-subtitle">
            Select a piece of evidence, then select
            the suspect most directly associated with it.
            Remember: association is not proof of guilt.
        </p>

        <div class="board-progress" id="boardProgress">
            VERIFIED CONNECTIONS: 0 / 5
        </div>

        <div class="board-layout">

            <div class="board-column">
                <h3>FORENSIC EVIDENCE</h3>
                <div id="clueList"></div>
            </div>

            <div class="board-column">
                <h3>SUSPECT DATABASE</h3>
                <div id="suspectList"></div>
            </div>

        </div>

        <div class="board-status"
             id="boardStatus"
             aria-live="polite">
            SYSTEM READY: Select evidence to begin.
        </div>

        <button class="board-reset"
                id="clearBoard"
                type="button">
            RESET CONNECTIONS
        </button>
    `;

    investigation.insertBefore(board, verdict);

    const clueList = board.querySelector("#clueList");
    const suspectList = board.querySelector("#suspectList");
    const boardStatus = board.querySelector("#boardStatus");
    const boardProgress = board.querySelector("#boardProgress");

    function renderClues() {

        clueList.replaceChildren();

        clues.forEach(clue => {

            const button = document.createElement("button");
            button.type = "button";
            button.className = "cz-clue";

            const saved = connections.get(clue.id);

            if (selectedClue === clue.id) {
                button.classList.add("selected");
            }

            if (saved === clue.suspect) {
                button.classList.add("connected");
            }

            button.setAttribute(
                "aria-pressed",
                String(selectedClue === clue.id)
            );

            const title = document.createElement("strong");
            title.textContent = clue.id + " // " + clue.title;

            const description = document.createElement("small");
            description.textContent = clue.description;

            button.append(title, description);

            button.addEventListener("click", () => {
                selectedClue = clue.id;

                boardStatus.textContent =
                    clue.title + " selected. Now choose a suspect.";

                renderClues();
            });

            clueList.appendChild(button);
        });
    }

    // CREATE SUSPECT BUTTONS

    suspects.forEach(suspect => {

        const button = document.createElement("button");
        button.type = "button";
        button.className = "cz-suspect";
        button.textContent = "👤 " + suspect.name;

        button.addEventListener("click", () => {

            if (!selectedClue) {
                boardStatus.textContent =
                    "Select an evidence card first.";
                return;
            }

            const clue = clues.find(
                item => item.id === selectedClue
            );

            connections.set(clue.id, suspect.id);

            if (suspect.id === clue.suspect) {
                boardStatus.textContent =
                    "CONNECTION VERIFIED: " + clue.explanation;
            } else {
                boardStatus.textContent =
                    "CONNECTION NOT SUPPORTED: Review the clue and try a different suspect.";
            }

            selectedClue = null;

            updateProgress();
            renderClues();
        });

        suspectList.appendChild(button);
    });

    function updateProgress() {

        const correct = clues.filter(clue =>
            connections.get(clue.id) === clue.suspect
        ).length;

        boardProgress.textContent =
            "VERIFIED CONNECTIONS: " + correct + " / 5";

        if (correct === clues.length) {
            boardStatus.textContent =
                "BOARD COMPLETE! All five evidence associations are verified. You can now combine these clues with the alibis to reach your verdict.";
        }
    }

    // RESET EVIDENCE CONNECTIONS

    board.querySelector("#clearBoard")
        .addEventListener("click", () => {

            connections.clear();
            selectedClue = null;

            boardStatus.textContent =
                "BOARD RESET: All connections cleared.";

            updateProgress();
            renderClues();
        });

    renderClues();
});

