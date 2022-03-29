/* Based on this: https://jsfiddle.net/703c96dr/ */
const wordLookupRequest = async (lookup) => {
    if (/^\W/.test(lookup)) {
        console.log(lookup);
        return false
    } else {
        let response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${lookup}`
        );
        let json = await response.json();
        let phon = "";
        // console.log(json);
        if (json[0]) {
            const word = json[0].word;
            const speechPart = json[0].meanings[0].partOfSpeech ? json[0].meanings[0].partOfSpeech : '';
            const phonAudio = (json[0].phonetics.length && json[0].phonetics[0].audio) ? json[0].phonetics[0].audio : '';
            const phonText = (json[0].phonetics.length && json[0].phonetics[0].text) ? json[0].phonetics[0].text : '';
            // console.log(phonText.length && phonAudio.length)
            if (phonText.length && phonAudio.length) {
                phon = ` (<a href="${phonAudio}">${phonText}</a>) `
            } else if (phonText && !phonAudio) {
                phon = ` (${phonText}) `
            }
            const defo = json[0].meanings[0].definitions[0].definition ? json[0].meanings[0].definitions[0].definition : '';
            console.log(`${word} - ${speechPart}${phon}: ${defo}`)
        } else {
            console.log(`Sorry, we could not find "${lookup}" in the dictionary. You can try the search again at later time or head to the web instead.`)
        }
    }
};

function onmouseoverspan() {
    this.style.backgroundColor = "yellow";
}

function onmouseoutspan() {
    this.style.backgroundColor = "transparent";
}

function onclickspan() {
    wordLookupRequest(this.textContent);
    // wordLookupRequest("<script>alert('gotcha!')</script>")
}

let spans;
const p = document.getElementsByTagName("p");
for (let i = 0; i < p.length; i++) {
    if (p[i] == undefined) continue;
    p[i].innerHTML = p[i].innerHTML.replace(/\b(\w+)\b/g, "<span>$1</span>");
    spans = p[i].getElementsByTagName("span")
    for (let a = 0; a < spans.length; a++) {
        spans[a].onmouseover = onmouseoverspan;
        spans[a].onmouseout = onmouseoutspan;
        spans[a].onclick = onclickspan;
    }
}