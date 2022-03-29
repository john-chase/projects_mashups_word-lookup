/* Based on this: https://jsfiddle.net/703c96dr/ */
const wordLookupRequest = async (lookup) => {
    if (/^\W/.test(lookup)) {
        return `${lookup} is not a proper word.`
    } else {
        let response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${lookup}`
        );
        let json = await response.json();
        let phon = "";
        if (json[0]) {
            const word = json[0].word;
            const speechPart = json[0].meanings[0].partOfSpeech ? json[0].meanings[0].partOfSpeech : '';
            const phonText = (json[0].phonetics.length && json[0].phonetics[0].text) ? json[0].phonetics[0].text : '';
            if (phonText.length) {
                phon = ` (${phonText}) `
            }
            const defo = json[0].meanings[0].definitions[0].definition ? json[0].meanings[0].definitions[0].definition : '';
            return `${word} - ${speechPart}${phon}: ${defo}`

        } else {
            return `Sorry, we could not find "${lookup}" in the dictionary. You can try the search again at later time or head to the web instead.`;
        }
    }
}
/*highlight the word*/
function onmouseoverspan() {
    this.style.backgroundColor = "yellow";
}
/*unhighlight word, remove tooltip*/
function onmouseoutspan() {
    this.style.backgroundColor = "transparent";
    this.classList.remove('tooltip', 'notfound');
}
/*fetch word, then add data/class*/
function onclickspan(e) {
    // wordLookupRequest("<script>alert('gotcha!')</script>").then((resolvedValue) => console.log(resolvedValue))
    const tag = e.target;
    console.log(tag);
    wordLookupRequest(e.target.innerText).then((word) => {
        // console.log(word, tag)
        tag.setAttribute('data-tooltip', word)
        word.includes("Sorry, we could not find ") ? tag.classList.add('tooltip', 'notfound') : tag.classList.add('tooltip')
    })
}
/*Break paragraph into wordspans and add listeners*/
let spans;
const toggle = document.querySelector("#def-toggle")
const help = document.querySelector("#help")
const p = document.getElementsByTagName("p");
toggle.onchange = () => {
    if (toggle.checked) {
        help.classList.remove('hidden')
        for (let i = 0; i < p.length; i++) {
            if (p[i] == undefined) continue;
            p[i].innerHTML = p[i].innerHTML.replace(/\b(\w+)\b/g, '<span>$1</span>');
            spans = p[i].getElementsByTagName("span")
            for (let a = 0; a < spans.length; a++) {
                spans[a].onmouseover = onmouseoverspan;
                spans[a].onmouseout = onmouseoutspan;
                spans[a].onclick = onclickspan;
            }
        }
    } else {
        help.classList.add('hidden')
        for (let i = 0; i < p.length; i++) {
            if (p[i] == undefined) continue;
            p[i].innerHTML = p[i].innerHTML.replace(/<[^>]*>/g, '');
        }
    }
};