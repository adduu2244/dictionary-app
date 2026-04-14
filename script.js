const input = document.getElementById("searchInput");
const button = document.getElementById("searchBtn");

const wordEl = document.getElementById("word");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const posEl = document.getElementById("pos");
const audioBtn = document.getElementById("playAudio");
const synonymsEl = document.getElementById("synonyms");

let audioSrc = "";

// SEARCH FUNCTION
button.addEventListener("click", () => {
    const word = input.value.trim();
    if (word !== "") {
        fetchWord(word);
    }
});

// FETCH DATA FROM API
async function fetchWord(word) {
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await res.json();

        if (!data || data.title === "No Definitions Found") {
            showError();
            return;
        }

        const result = data[0];

        // WORD
        wordEl.textContent = result.word;

        // MEANING + EXAMPLE + POS
        const meaning = result.meanings[0];

        meaningEl.textContent = meaning.definitions[0].definition || "N/A";
        exampleEl.textContent = meaning.definitions[0].example || "No example";
        posEl.textContent = meaning.partOfSpeech || "N/A";

        //  SYNONYMS
        const synonyms = meaning.synonyms;
        synonymsEl.textContent =
            synonyms && synonyms.length > 0
                ? "Synonyms: " + synonyms.slice(0, 3).join(", ")
                : "Synonyms: Not available";

        // AUDIO
        audioSrc = result.phonetics.find(p => p.audio)?.audio || "";

    } catch (error) {
        showError();
    }
}

// PLAY AUDIO
audioBtn.addEventListener("click", () => {
    if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play();
    } else {
        alert("No audio available");
    }
});

// ERROR HANDLING
function showError() {
    wordEl.textContent = "Not Found ❌";
    meaningEl.textContent = "";
    exampleEl.textContent = "";
    posEl.textContent = "";
    synonymsEl.textContent = "";
}