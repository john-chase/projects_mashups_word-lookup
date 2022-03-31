"use strict";

function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);
        return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        step("next", value);
                    }, function (err) {
                        step("throw", err);
                    });
                }
            }
            return step("next");
        });
    };
}

var newBtn = document.querySelector(".new-btn");
var sel = void 0;

function getSign() {
    var date = new Date();
    var today = date.getMonth() + 1 + "/" + date.getDate();
    var sign = '';
    console.log(today.split("/")[0], today.split("/")[1]);
    // January 20–February 18 
    if (today.split("/")[0] === "1" && today.split("/")[1] >= 20 || today.split("/")[0] === "2" && today.split("/")[1] <= 18) {
        sign = 'Aquarius';
    }
    // February 19–March 20 
    if (today.split("/")[0] === "2" && today.split("/")[1] >= 19 || today.split("/")[0] === "3" && today.split("/")[1] <= 20) {
        sign = 'Pisces';
    }
    // March 21–April 19 
    if (today.split("/")[0] === "3" && today.split("/")[1] >= 21 || today.split("/")[0] === "4" && today.split("/")[1] <= 19) {
        sign = 'Aries';
    }
    // April 20–May 20 
    if (today.split("/")[0] === "4" && today.split("/")[1] >= 20 || today.split("/")[0] === "5" && today.split("/")[1] <= 20) {
        sign = 'Taurus';
    }
    // May 21–June 21 
    if (today.split("/")[0] === "5" && today.split("/")[1] >= 21 || today.split("/")[0] === "6" && today.split("/")[1] <= 21) {
        sign = 'Gemini';
    }
    // June 22–July 22 
    if (today.split("/")[0] === "6" && today.split("/")[1] >= 22 || today.split("/")[0] === "7" && today.split("/")[1] <= 22) {
        sign = 'Cancer';
    }
    // July 23–August 22 
    if (today.split("/")[0] === "7" && today.split("/")[1] >= 23 || today.split("/")[0] === "8" && today.split("/")[1] <= 22) {
        sign = 'Leo';
    }
    // August 23–September 22 
    if (today.split("/")[0] === "8" && today.split("/")[1] >= 23 || today.split("/")[0] === "9" && today.split("/")[1] <= 22) {
        sign = 'Virgo';
    }
    // September 23–October 23 
    if (today.split("/")[0] === "9" && today.split("/")[1] >= 23 || today.split("/")[0] === "10" && today.split("/")[1] <= 23) {
        sign = 'Libra';
    }
    // October 24–November 21 
    if (today.split("/")[0] === "10" && today.split("/")[1] >= 24 || today.split("/")[0] === "11" && today.split("/")[1] <= 21) {
        sign = 'Scorpius';
    }
    // November 22–December 21 
    if (today.split("/")[0] === "11" && today.split("/")[1] >= 22 || today.split("/")[0] === "12" && today.split("/")[1] <= 21) {
        sign = 'Sagittarius';
    }
    // December 22–January 19 
    if (today.split("/")[0] === "12" && today.split("/")[1] >= 22 || today.split("/")[0] === "1" && today.split("/")[1] <= 19) {
        sign = 'Capricornus';
    }
    console.log("Sign:" + sign);
    return sign;
}
/*Paragraph fetch*/
var paragraphLoad = function paragraphLoad(selection) {
    var paraTag = document.querySelector("p");
    console.log(selection);
    var url = void 0,
        options = {};
    switch (selection) {
        case "1":
            url = 'https://api.aakhilv.me/fun/facts';
            break;
        case "2":
            url = 'https://uselessfacts.jsph.pl/random.json?language=en';
            break;
        case "3":
            url = 'https://api.quotable.io/random';
            break;
        case "4":
            url = 'https://aztro.sameerkumar.website/?sign=' + getSign() + '&day=today';
            options = {
                method: 'POST'
            };
            break;
        case "5":
            url = 'https://fakerapi.it/api/v1/texts?_quantity=1&_characters=500';
            break;
    }
    console.log(url, options);
    fetch(url, options).then(function (response) {
        console.log(response.status);
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    }).then(function (data) {
        var paraText = void 0;
        console.log(data);
        switch (selection) {
            case "1":
                paraText = data[0];
                paraTag.innerText = paraText;
                break;
            case "2":
                paraText = data.text;
                paraTag.innerText = paraText;
                break;
            case "3":
                paraText = data.content;
                paraTag.innerText = paraText;
                break;
            case "4":
                paraText = data.description;
                var today = data.current_date;
                paraTag.innerText = getSign() + " (" + today + "): " + paraText;
                break;
            case "5":
                paraText = data.data[0].content;
                var paraAuth = data.data[0].author;
                paraTag.innerText = paraText + " - " + paraAuth;
                break;
        }
        newBtn.innerText = "Load Content";
        newBtn.classList.add("hidden");
    }).catch(function (err) {
        console.error(err);
        paraTag.innerText = err;
        newBtn.innerText = "Load Content";
    });
};

/* Word lookup - Based on this: https://jsfiddle.net/703c96dr/ */
var wordLookupRequest = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(lookup) {
        var response, sorry, json, phon, word, speechPart, phonText, defo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!/^\W/.test(lookup)) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt("return", lookup + " is not a proper word.");

                    case 4:
                        _context.next = 6;
                        return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + lookup);

                    case 6:
                        response = _context.sent;
                        sorry = "Sorry, we could not find \"" + lookup + "\" in the dictionary, or the service is down. You can try the search again at later time or head to the web instead.";

                        if (!(response.status >= 200 && response.status <= 299)) {
                            _context.next = 25;
                            break;
                        }

                        _context.next = 11;
                        return response.json();

                    case 11:
                        json = _context.sent;
                        phon = "";

                        if (!json[0]) {
                            _context.next = 22;
                            break;
                        }

                        word = json[0].word;
                        speechPart = json[0].meanings[0].partOfSpeech ? json[0].meanings[0].partOfSpeech : '';
                        phonText = json[0].phonetics.length && json[0].phonetics[0].text ? json[0].phonetics[0].text : '';

                        if (phonText.length) {
                            phon = " (" + phonText + ") ";
                        }
                        defo = json[0].meanings[0].definitions[0].definition ? json[0].meanings[0].definitions[0].definition : '';
                        return _context.abrupt("return", word + " - " + speechPart + phon + ": " + defo);

                    case 22:
                        return _context.abrupt("return", sorry);

                    case 23:
                        _context.next = 26;
                        break;

                    case 25:
                        return _context.abrupt("return", sorry);

                    case 26:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function wordLookupRequest(_x) {
        return _ref.apply(this, arguments);
    };
}();
var spans = void 0;
var toggle = document.querySelector("#def-toggle");
var apiSel = document.querySelector("#api-sel");
var help = document.querySelector("#help");
var p = document.getElementsByTagName("p");
/*Load a new paragraph*/
newBtn.addEventListener('click', function (e) {
    console.log("EL newBtn");
    newBtn.innerText = "Please wait...";
    toggleOFF();
    paragraphLoad(sel);
});
/*Select a new api*/
apiSel.addEventListener('change', function (e) {
    console.log("EL apiSel");
    sel = e.target.options[e.target.selectedIndex].value;
    if (sel !== "0") {
        newBtn.classList.remove('hidden');
    }
});
/*Remove Spans and toggle OFF*/
var toggleOFF = function toggleOFF() {
    help.classList.add('hidden');
    toggle.checked = false;
    for (var i = 0; i < p.length; i++) {
        if (p[i] == undefined) continue;
        p[i].innerHTML = p[i].innerHTML.replace(/<[^>^br]*>/g, '');
    }
};
/*Break paragraph into wordspans and add listeners*/
toggle.onchange = function () {
    if (toggle.checked) {
        help.classList.remove('hidden');
        for (var i = 0; i < p.length; i++) {
            p[i].classList.add("p");
            console.log(p[i]);
            if (p[i] == undefined) continue;
            if (p[i] === '<br>') continue;
            p[i].innerHTML = p[i].innerHTML.replace(/(\b\w*[^<br\\/>'\-\s]\b)/g, '<span>$1</span>'); //get words on boundaries and ignore <br>s and punct
            spans = p[i].getElementsByTagName("span");
            for (var a = 0; a < spans.length; a++) {
                spans[a].onmouseover = onmouseoverspan;
                spans[a].onmouseout = onmouseoutspan;
                spans[a].onclick = onclickspan;
            }
        }
    } else {
        for (var _i = 0; _i < p.length; _i++) {
            p[_i].classList.remove("p");
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
    var tag = e.target;
    console.log(tag);
    wordLookupRequest(e.target.innerText).then(function (word) {
        // console.log(word, tag)
        tag.setAttribute('data-tooltip', word);
        word.includes("Sorry, we could not find ") ? tag.classList.add('tooltip', 'notfound') : tag.classList.add('tooltip');
    });
}