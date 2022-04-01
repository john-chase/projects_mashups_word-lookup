(() => {
    /*inject styles*/
    const styleElem = document.head.appendChild(document.createElement("style"));
    styleElem.innerHTML = `
/*GENERAL*/ .p { border: 1px solid dodgerblue; border-radius: .5rem; padding: .5rem; margin: 1rem 5rem; font-size: 15px; line-height: 1.2;} .hidden { display: none; } /*DEFINITION GROUP*/ .def-div { background-color: dodgerblue; position:fixed; z-index:99999999; min-width:100% } .def-span { padding: 0 0 12px 4px; text-align: center; color: blue; font-weight: bold; font-style: italic; margin: 0.5rem; } .def-help { font-style: italic; margin: 0.5rem; } /*TOOLTIPS*/ .def-tooltip { position: relative; transition: all 0.3s ease; text-decoration: none; cursor: grabbing; } .def-tooltip:before { content: ""; position: absolute; opacity: 0; pointer-events: none; left: 50%; transform: translate3d(-50%, 0%, 0); transition: all 0.3s ease; transition-delay: 1.2s; width: 0; height: 0; border-style: solid; border-width: 10px 10px 0 10px; border-color: dodgerblue transparent transparent transparent; } .def-tooltip:after { text-transform: none; content: attr(data-tooltip); font-size: 11px; position: absolute; color:white; font-weight:bold;background: dodgerblue; padding: 8px 12px; width: -webkit-max-content; width: -moz-max-content; width: max-content; max-width: 200px; opacity: 0; pointer-events: none; left: 50%; top: 0; border-radius: 4px; transform: translate3d(-50%, 0%, 0); transition: all 0.3s ease; transition-delay: 1.2s; } .def-tooltip:hover { background-color: rgba(0, 0, 0, 0.12); } .def-tooltip:hover:before, .def-tooltip:hover:after { opacity: 1; } .def-tooltip:hover:before { transform: translate3d(-50%, calc(-50% - 4px), 0); } .def-tooltip:hover:after { transform: translate3d(-50%, calc(-80% - 16px), 0); } .def-tooltip .def-tooltip-content::after { background-color: #05a8ff; content: ""; height: 10px; position: absolute; transform: rotate(45deg); width: 10px; } .def-tooltip-not-found:after { background: red; color:white; font-weight:bold;} .def-tooltip-not-found:before { border-color: red transparent transparent transparent; } /*TOGGLE SWITCH*/ input[type=checkbox], .def-input { margin: 0; -webkit-appearance: none; appearance: none; padding-left: 30px; box-shadow: none; border-radius: 16px; background: radial-gradient(circle 12px, white 100%, transparent calc(100% + 1px)) #ccc -16px; transition: 0.3s ease-in-out; position: inherit; height: 32px; width: 64px; top: 0; bottom: 0;} .def-input::before { content: "OFF"; font: bold 12px/32px Verdana; color: white; text-shadow: 0 1px black; } .def-input:checked { padding-left: 8px; background-color: rgb(37, 151, 62); background-position: 16px; height: 32px; width: 64px; } .def-input:checked::before { content: "ON"; } 
`;
    /*set up elements*/
    const body = document.getElementsByTagName("body")[0];
    const defDiv = document.createElement("div");
    defDiv.classList.add("def-div");
    body.insertBefore(defDiv, body.firstChild);
    const defSwitch = document.createElement("label");
    defDiv.appendChild(defSwitch);
    const defSpan = (document.createElement("span"));
    defSpan.classList.add("def-span");
    defSpan.innerText = "Definitions";
    defSwitch.appendChild(defSpan);
    const defToggle = document.createElement("input");
    defToggle.setAttribute("type", "checkbox");
    defToggle.classList.add('def-input');
    defSwitch.appendChild(defToggle);
    const defHelp = document.createElement("span");
    defHelp.classList.add('hidden', 'def-help');
    defHelp.innerText = "Hover over a word to highlight, then click/tap to show definition tooltip.";
    defSwitch.appendChild(defHelp);
    let spans;
    let p = document.getElementsByTagName("p");
    let originalP = [];
    /*break out punctuation*/
    const breakPunct = (word) => {
        const punctuationMarks = ["'", ".", "-", ","];
        [...punctuationMarks].every(mark => {
            let punct = word.search(mark)
            console.log("Punct occurs at:", punct);
            if (punct !== -1) {
                //Get the position of the punct - wrap non-punct word in span - add punct back in outside span
                return [word.substring(0, punct), word.substring(punct, word.length)];
                console.log(returnArray);
            } else {
                return [word, '']
            }
            /*!!!PROBLEM*/
        });
    }
    /*break p into words, wrap with spans*/
    const addSpans = (paragraph) => {
        let words = paragraph.split(" ");
        let newParagraph = '';
        words.forEach(word => {
            newParagraph += `<span>${breakPunct(word)[0]}</span>${breakPunct(word)[1]} `;
        });
        return newParagraph;
    }
    /*add listeners*/
    defToggle.onchange = () => {
        if (defToggle.checked) {
            /*add spans and toggle ON*/
            defHelp.classList.remove('hidden');
            for (let i = 0; i < p.length; i++) {
                if (p[i] == undefined || p[i].innerText === '') continue;
                p[i].classList.add("p");
                // console.log("innerHTML: ", p[i].innerHTML);
                // console.log("innerText: ", p[i].innerText);
                originalP.push(p[i].innerHTML);
                p[i].innerHTML = addSpans(p[i].innerText);
                spans = p[i].getElementsByTagName("span");
                for (let a = 0; a < spans.length; a++) {
                    spans[a].onmouseover = onmouseoverspan;
                    spans[a].onmouseout = onmouseoutspan;
                    spans[a].onclick = onclickspan;
                }
            }
        } else {
            /*remove spans and toggle OFF*/
            defHelp.classList.add('hidden');
            for (let i = 0; i < p.length; i++) {
                if (p[i] == undefined || p[i].innerText === '') continue;
                p[i].classList.remove("p");
                p[i].innerHTML = originalP[i]
            }
        }
    }
})();

/*fetch word*/
const wordLookupRequest = async (lookup) => {
    if (/^\W/.test(lookup)) {
        return `${lookup} is not a proper word.`
    } else {
        let response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${lookup}`
        );
        const sorry = `Sorry, we could not find "${lookup}" in the dictionary, or the service is down. You can try the search again at later time or head to the web instead.`
        if (response.status >= 200 && response.status <= 299) {
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
                return sorry;
            }
        } else {
            return sorry;
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
    this.classList.remove('def-tooltip');
}

/*fetch word, then add data/class*/
function onclickspan(e) {
    const tag = e.target;
    wordLookupRequest(e.target.innerText).then((word) => {
        tag.setAttribute('data-tooltip', word);
        word.includes("Sorry, we could not find ") ? tag.classList.add('def-tooltip', 'def-tooltip-not-found') : tag.classList.add('def-tooltip');
    });
}