const newBtn = document.querySelector(".new-btn");
/*Paragraph fetch*/
const paragraphLoad = () => {
    const paraTag = document.querySelector("p")
    fetch('https://www.poemist.com/api/v1/randompoems')
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(response => {
            const paraText = response[0].content.replace(/<[^>]*>/g, '');
            console.log(paraText);
            paraTag.innerText = paraText;
            newBtn.innerText = "Load New Content";
        })
        .catch(err => {
            console.error(err)
            paraTag.innerText = err
        });
}

/* Word lookup - Based on this: https://jsfiddle.net/703c96dr/ */
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
let spans;
const toggle = document.querySelector("#def-toggle")
const help = document.querySelector("#help")
const p = document.getElementsByTagName("p");
/*Remove Spans and toggle OFF*/
const toggleOFF = () => {
    help.classList.add('hidden')
    toggle.checked = false;
    for (let i = 0; i < p.length; i++) {
        if (p[i] == undefined) continue;
        p[i].innerHTML = p[i].innerHTML.replace(/<[^>^br]*>/g, '');
    }
}
/*Break paragraph into wordspans and add listeners*/
toggle.onchange = () => {
    if (toggle.checked) {
        help.classList.remove('hidden')
        for (let i = 0; i < p.length; i++) {
            console.log(p[i]);
            if (p[i] == undefined) continue;
            if (p[i] === '<br>') continue;
            p[i].innerHTML = p[i].innerHTML.replace(/(\b\w*[']*[^<br\\/>]\b)/g, '<span>$1</span>'); //get words with 's and ignore <br>s
            spans = p[i].getElementsByTagName("span")
            for (let a = 0; a < spans.length; a++) {
                spans[a].onmouseover = onmouseoverspan;
                spans[a].onmouseout = onmouseoutspan;
                spans[a].onclick = onclickspan;
            }
        }
    } else {
        toggleOFF();
    }
};
/*Load a new paragraph*/
newBtn.addEventListener('click', (e) => {
    newBtn.innerText = "Please wait..."
    toggleOFF();
    paragraphLoad()
});
/*highlight the word*/
function onmouseoverspan() {
    this.style.backgroundColor = "yellow";
}
/*unhighlight word, remove tooltip*/
function onmouseoutspan() {
    this.style.backgroundColor = "transparent";
    this.classList.remove('tooltip');
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