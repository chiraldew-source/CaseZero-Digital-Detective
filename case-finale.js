
document.addEventListener("DOMContentLoaded", () => {

    const investigation = document.getElementById("investigation");
    const verdict = document.getElementById("verdict");
    const submitVerdict = document.getElementById("submitVerdict");
    const finalResult = document.getElementById("finalResult");

    if (!investigation || !verdict || !submitVerdict || !finalResult) {
        console.error("CASE ZERO: Required elements missing.");
        return;
    }

    const styles = document.createElement("style");

    styles.textContent = `
        .cz-tracker, .cz-finale {
            background: linear-gradient(135deg, #111a29, #211522);
            border: 1px solid #3f3549;
            border-radius: 16px;
            padding: 28px;
            margin: 30px 0;
        }

        .cz-tracker h2, .cz-finale h2 {
            color: #ff6778;
            margin-bottom: 12px;
        }

        .cz-tracker p {
            color: #aab5c6;
            margin-bottom: 22px;
        }

        .cz-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 24px;
        }

        .cz-stat {
            padding: 22px;
            border-radius: 12px;
            background: #182334;
            border: 1px solid #334257;
        }

        .cz-stat strong {
            display: block;
            font-size: 28px;
            color: #ff6778;
        }

        .cz-stat small {
            display: block;
            color: #b0bdcf;
            margin-top: 10px;
        }

        .cz-alias {
            display: block;
            width: 100%;
            max-width: 450px;
            background: #192535;
            border: 1px solid #495668;
            border-radius: 9px;
            padding: 15px;
            color: white;
            font-size: 15px;
            margin-top: 10px;
        }

        .cz-tracker label {
            color: #f3f4f7;
            font-weight: bold;
        }

        .cz-certificate {
            margin-top: 20px;
            padding: 35px;
            background: #f6f1e7;
            color: #172033;
            border: 8px double #c6a76b;
            border-radius: 8px;
            text-align: center;
        }

        .cz-seal {
            font-size: 46px;
            margin-bottom: 12px;
        }

        .cz-certificate h2 {
            color: #26354a;
            font-size: 30px;
            margin: 12px 0;
        }

        .cz-certificate h3 {
            font-size: 25px;
            color: #8a6335;
            margin: 18px 0;
            overflow-wrap: anywhere;
        }

        .cz-certificate p {
            color: #39465a;
            margin: 10px 0;
            line-height: 1.7;
        }

        .cz-score {
            font-size: 37px;
            font-weight: bold;
            color: #9b293b;
            margin: 18px 0;
        }

        .cz-rank {
            font-size: 20px;
            font-weight: bold;
            color: #26354a;
        }

        .cz-finale button {
            margin-top: 22px;
        }

        [hidden] {
            display: none !important;
        }

        @media(max-width: 650px) {
            .cz-stats {
                grid-template-columns: 1fr;
            }

            .cz-certificate {
                padding: 18px;
            }
        }

        @media print {
            body * {
                visibility: hidden !important;
            }

            .cz-certificate,
            .cz-certificate * {
                visibility: visible !important;
            }

            .cz-certificate {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                border: 5px double #8a6335;
                box-shadow: none;
            }
        }
    `;

    document.head.appendChild(styles);

    // INVESTIGATION TRACKER

    const tracker = document.createElement("section");
    tracker.className = "cz-tracker";

    tracker.innerHTML = `
        <h2>🛰️ INVESTIGATION COMMAND CENTER</h2>

        <p>Live case progress and detective identification.</p>

        <div class="cz-stats">
            <div class="cz-stat">
                <strong id="czFiles">0 / 3</strong>
                <small>CASE FILES EXAMINED</small>
            </div>

            <div class="cz-stat">
                <strong id="czConnections">0 / 5</strong>
                <small>VERIFIED CONNECTIONS</small>
            </div>

            <div class="cz-stat">
                <strong id="czVerdict">PENDING</strong>
                <small>FINAL VERDICT</small>
            </div>
        </div>

        <label for="czAlias">DETECTIVE CODENAME</label>
        <input
            id="czAlias"
            class="cz-alias"
            type="text"
            maxlength="30"
            placeholder="Enter your detective name"
        >
    `;

    const dashboard = investigation.querySelector(".dashboard-grid");
    investigation.insertBefore(tracker, dashboard);

    const openedFiles = new Set();

    function updateProgress() {
        tracker.querySelector("#czFiles").textContent =
            openedFiles.size + " / 3";

        const boardProgress = document.getElementById("boardProgress");

        if (boardProgress) {
            const match = boardProgress.textContent.match(/(\d+)\s*\/\s*5/);

            if (match) {
                tracker.querySelector("#czConnections").textContent =
                    match[1] + " / 5";
            }
        }
    }

    document.querySelectorAll("[data-file]").forEach(card => {
        const markOpened = () => {
            openedFiles.add(card.dataset.file);
            updateProgress();
        };

        card.addEventListener("click", markOpened);
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                markOpened();
            }
        });
    });

    const board = document.querySelector(".evidence-board");

    if (board) {
        board.addEventListener("click", () => {
            updateProgress();
        });
    }

    // FINAL CASE REPORT

    const finale = document.createElement("section");
    finale.className = "cz-finale";
    finale.hidden = true;

    finale.innerHTML = `
        <h2>🏆 DETECTIVE CASE REPORT</h2>

        <div class="cz-certificate" id="czCertificate">
            <div class="cz-seal">✦</div>
            <p>CASE ZERO — DIGITAL FORENSICS DIVISION</p>

            <h2>OFFICIAL CASE REPORT</h2>

            <p>This report recognizes the investigation performed by</p>

            <h3 id="czDetectiveName"></h3>

            <p>CASE #CZ-001 — THE MIDNIGHT BREACH</p>

            <div id="czFinalScore" class="cz-score"></div>

            <div id="czRank" class="cz-rank"></div>

            <p id="czOutcome"></p>

            <p>Digital Investigation System • Fictional Training Case</p>
        </div>

        <button id="czPrint" type="button">
            SAVE REPORT AS PDF
        </button>
    `;

    verdict.insertAdjacentElement("afterend", finale);

    // SHOW REPORT AFTER THE ORIGINAL VERDICT

    submitVerdict.addEventListener("click", () => {

        if (finalResult.classList.contains("hidden")) return;

        const scoreMatch = finalResult.textContent.match(
            /DETECTIVE SCORE:\s*(\d+)\s*\/\s*100/
        );

        if (!scoreMatch) return;

        const score = Number(scoreMatch[1]);

        const alias = document.getElementById("czAlias").value.trim();
        const detectiveName = alias || "UNKNOWN DETECTIVE";

        let rank;
        let outcome;

        if (score === 100) {
            rank = "MASTER DETECTIVE";
            outcome = "CASE SOLVED — Outstanding deduction!";
        } else if (score >= 60) {
            rank = "CASE ANALYST";
            outcome = "Correct suspect. Evidence selection needs improvement.";
        } else {
            rank = "INVESTIGATOR IN TRAINING";
            outcome = "Case not fully solved. Further investigation recommended.";
        }

        document.getElementById("czDetectiveName").textContent =
            detectiveName;

        document.getElementById("czFinalScore").textContent =
            score + " / 100";

        document.getElementById("czRank").textContent =
            rank;

        document.getElementById("czOutcome").textContent =
            outcome;

        tracker.querySelector("#czVerdict").textContent =
            score === 100 ? "SOLVED" : "REVIEWED";

        finale.hidden = false;

        finale.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // PRINT OR SAVE TO PDF

    finale.querySelector("#czPrint").addEventListener("click", () => {
        window.print();
    });

    updateProgress();

    console.log("CASE ZERO — Finale module ready");
});
