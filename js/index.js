const newBtn = document.querySelector(".new-btn");
let sel

function getSign() {
    const date = new Date;
    const today = `${date.getMonth()+1}/${date.getDate()}`
    let sign = ''
    // console.log(today.split("/")[0], today.split("/")[1]);
    // January 20–February 18 
    if ((today.split("/")[0] === "1" && today.split("/")[1] >= 20) || (today.split("/")[0] === "2" && today.split("/")[1] <= 18)) {
        sign = 'Aquarius'
    }
    // February 19–March 20 
    if ((today.split("/")[0] === "2" && today.split("/")[1] >= 19) || (today.split("/")[0] === "3" && today.split("/")[1] <= 20)) {
        sign = 'Pisces'
    }
    // March 21–April 19 
    if ((today.split("/")[0] === "3" && today.split("/")[1] >= 21) || (today.split("/")[0] === "4" && today.split("/")[1] <= 19)) {
        sign = 'Aries'
    }
    // April 20–May 20 
    if ((today.split("/")[0] === "4" && today.split("/")[1] >= 20) || (today.split("/")[0] === "5" && today.split("/")[1] <= 20)) {
        sign = 'Taurus'
    }
    // May 21–June 21 
    if ((today.split("/")[0] === "5" && today.split("/")[1] >= 21) || (today.split("/")[0] === "6" && today.split("/")[1] <= 21)) {
        sign = 'Gemini'
    }
    // June 22–July 22 
    if ((today.split("/")[0] === "6" && today.split("/")[1] >= 22) || (today.split("/")[0] === "7" && today.split("/")[1] <= 22)) {
        sign = 'Cancer'
    }
    // July 23–August 22 
    if ((today.split("/")[0] === "7" && today.split("/")[1] >= 23) || (today.split("/")[0] === "8" && today.split("/")[1] <= 22)) {
        sign = 'Leo'
    }
    // August 23–September 22 
    if ((today.split("/")[0] === "8" && today.split("/")[1] >= 23) || (today.split("/")[0] === "9" && today.split("/")[1] <= 22)) {
        sign = 'Virgo'
    }
    // September 23–October 23 
    if ((today.split("/")[0] === "9" && today.split("/")[1] >= 23) || (today.split("/")[0] === "10" && today.split("/")[1] <= 23)) {
        sign = 'Libra'
    }
    // October 24–November 21 
    if ((today.split("/")[0] === "10" && today.split("/")[1] >= 24) || (today.split("/")[0] === "11" && today.split("/")[1] <= 21)) {
        sign = 'Scorpius'
    }
    // November 22–December 21 
    if ((today.split("/")[0] === "11" && today.split("/")[1] >= 22) || (today.split("/")[0] === "12" && today.split("/")[1] <= 21)) {
        sign = 'Sagittarius'
    }
    // December 22–January 19 
    if ((today.split("/")[0] === "12" && today.split("/")[1] >= 22) || (today.split("/")[0] === "1" && today.split("/")[1] <= 19)) {
        sign = 'Capricornus'
    }
    // console.log("Sign:" + sign);
    return sign
}
/*Paragraph fetch*/
const paragraphLoad = (selection) => {
    const paraTag = document.querySelector("p")
    // console.log(selection);
    let url, options = {}
    switch (selection) {
        case "1":
            url = 'https://api.aakhilv.me/fun/facts'
            break;
        case "2":
            url = 'https://uselessfacts.jsph.pl/random.json?language=en'
            break;
        case "3":
            url = 'https://api.quotable.io/random'
            break;
        case "4":
            url = 'https://aztro.sameerkumar.website/?sign=' + getSign() + '&day=today';
            options = {
                method: 'POST',
            };
            break;
        case "5":
            url = 'https://fakerapi.it/api/v1/texts?_quantity=1&_characters=500'
            break;
    }
    // console.log(url, options);
    fetch(url, options)
        .then(response => {
            // console.log(response.status);
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(data => {
            let paraText
            // console.log(data);
            switch (selection) {
                case "1":
                    paraText = data[0];
                    paraTag.innerText = paraText
                    break;
                case "2":
                    paraText = data.text;
                    paraTag.innerText = paraText
                    break;
                case "3":
                    paraText = data.content;
                    paraTag.innerText = paraText
                    break;
                case "4":
                    paraText = data.description;
                    const today = data.current_date;
                    paraTag.innerText = `${getSign()} (${today}): ${paraText}`;
                    break;
                case "5":
                    paraText = data.data[0].content;
                    const paraAuth = data.data[0].author;
                    paraTag.innerText = `${paraText} - ${paraAuth}`;
                    break;
            }
            newBtn.innerText = "Load Content";
            newBtn.classList.add("hidden")
        })
        .catch(err => {
            console.error(err)
            paraTag.innerText = err
            newBtn.innerText = "Load Content";
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
let spans;
const toggle = document.querySelector("#def-toggle")
const apiSel = document.querySelector("#api-sel")
const help = document.querySelector("#help")
const p = document.getElementsByTagName("p");
/*Load a new paragraph*/
newBtn.addEventListener('click', (e) => {
    // console.log("EL newBtn");
    newBtn.innerText = "Please wait..."
    toggleOFF();
    paragraphLoad(sel)
});
/*Select a new api*/
apiSel.addEventListener('change', (e) => {
    // console.log("EL apiSel");
    sel = e.target.options[e.target.selectedIndex].value
    if (sel !== "0") {
        newBtn.classList.remove('hidden')
    }
});
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
            p[i].classList.add("p")
            // console.log(p[i]);
            if (p[i] == undefined) continue;
            if (p[i] === '<br>') continue;
            p[i].innerHTML = p[i].innerHTML.replace(/(\b\w*[^<br\\/>'\-\s]\b)/g, '<span>$1</span>'); //get words on boundaries and ignore <br>s and punct
            spans = p[i].getElementsByTagName("span")
            for (let a = 0; a < spans.length; a++) {
                spans[a].onmouseover = onmouseoverspan;
                spans[a].onmouseout = onmouseoutspan;
                spans[a].onclick = onclickspan;
            }
        }
    } else {
        for (let i = 0; i < p.length; i++) {
            p[i].classList.remove("p")
        }
        toggleOFF();
    }
};
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
    // console.log(tag);
    wordLookupRequest(e.target.innerText).then((word) => {
        // console.log(word, tag)
        tag.setAttribute('data-tooltip', word)
        word.includes("Sorry, we could not find ") ? tag.classList.add('tooltip', 'notfound') : tag.classList.add('tooltip')
    })
}