"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

(function () {
    /*inject styles*/
    var styleElem = document.head.appendChild(document.createElement("style"));
    styleElem.innerHTML = "\n    /*GENERAL*/ .p { border: 1px solid dodgerblue; border-radius: .5rem; padding: .5rem; margin: 1rem 5rem; font-size: 15px; line-height: 21px; } .hidden { display: none; } /*DEFINITION GROUP*/ .def-div { background-color: dodgerblue; position: fixed; z-index: 99999999; min-width: 100%; height: 32px; top:0;text-align: left;} .def-span { padding: 0 0 12px 4px; text-align: center; color: blue; font-weight: bold; font-style: italic; margin: 0.5rem; } .def-help { font-style: italic; margin: 0.5rem; } /*TOOLTIPS*/ .def-tooltip { position: relative; transition: all 0.3s ease; text-decoration: none; cursor: grabbing; } .def-tooltip:before { content: \"\"; position: absolute; opacity: 0; pointer-events: none; left: 50%; transform: translate3d(-50%, 0%, 0); transition: all 0.3s ease; transition-delay: 1.2s; width: 0; height: 0; border-style: solid; border-width: 10px 10px 0 10px; border-color: dodgerblue transparent transparent transparent; } .def-tooltip:after { text-transform: none; content: attr(data-tooltip); font-size: 12px; line-height: 18px; position: absolute; color: white; font-weight: bold; background: dodgerblue; padding: 8px 12px; width: -webkit-max-content; width: -moz-max-content; width: max-content; max-width: 200px; opacity: 0; pointer-events: none; left: 50%; top: 0; border-radius: 4px; transform: translate3d(-50%, 0%, 0); transition: all 0.3s ease; transition-delay: 1.2s; } .def-tooltip:hover { background-color: rgba(0, 0, 0, 0.12); } .def-tooltip:hover:before, .def-tooltip:hover:after { opacity: 1; } .def-tooltip:hover:before { transform: translate3d(-50%, calc(-50% - 4px), 0); } .def-tooltip:hover:after { transform: translate3d(-50%, calc(-80% - 16px), 0); } .def-tooltip .def-tooltip-content::after { background-color: #05a8ff; content: \"\"; height: 10px; position: absolute; transform: rotate(45deg); width: 10px; } .def-tooltip-not-found:after { color: white; font-weight: bold; background: red; } .def-tooltip-not-found:before { border-color: red transparent transparent transparent; } /*TOGGLE SWITCH*/ input[type=checkbox], .def-input { margin: 0; -webkit-appearance: none; appearance: none; padding: 0 0 0 30px; border-radius: 16px; background: radial-gradient(circle 12px, white 100%, transparent calc(100% + 1px)) #ccc -16px; transition: 0.3s ease-in-out; position: inherit; height: 32px; width: 64px; top: 0; bottom: 0; box-shadow: none; } .def-input::before { content: \"OFF\"; font: bold 12px/32px Verdana; color: white; text-shadow: 0 1px black; } .def-input:checked { padding: 0 0 0 8px; background-color: rgb(37, 151, 62); background-position: 16px; height: 32px; width: 64px; } .def-input:checked::before { content: \"ON\"; }\n";
    /*set up elements*/
    var body = document.getElementsByTagName("body")[0];
    var defDiv = document.createElement("div");
    defDiv.classList.add("def-div");
    body.insertBefore(defDiv, body.firstChild);
    var defSwitch = document.createElement("label");
    defDiv.appendChild(defSwitch);
    var defSpan = document.createElement("span");
    defSpan.classList.add("def-span");
    defSpan.innerText = "Definitions";
    defSwitch.appendChild(defSpan);
    var defToggle = document.createElement("input");
    defToggle.setAttribute("type", "checkbox");
    defToggle.classList.add('def-input');
    defSwitch.appendChild(defToggle);
    var defHelp = document.createElement("span");
    defHelp.classList.add('hidden', 'def-help');
    defHelp.innerText = "Hover over a word to highlight, then click/tap to show definition tooltip.";
    defSwitch.appendChild(defHelp);
    var spans = void 0;
    var p = document.getElementsByTagName("p");
    var originalP = [];
    /*break p into words, wrap with spans*/
    var addSpans = function addSpans(paragraph) {
        paragraph = paragraph.replace('&nbsp;', ' '); //!!!no workey
        var words = paragraph.split(" ");
        var newParagraph = '';
        words.forEach(function (word) {
            newParagraph += "<span>" + word + "</span> ";
        });
        return newParagraph;
    };
    /*add listeners*/
    defToggle.onchange = function () {
        if (defToggle.checked) {
            /*add spans and toggle ON*/
            defHelp.classList.remove('hidden');
            for (var i = 0; i < p.length; i++) {
                if (p[i] == undefined || p[i].innerText === '') continue;
                p[i].classList.add("p");
                originalP.push(p[i].innerHTML);
                p[i].innerHTML = addSpans(p[i].innerText);
                spans = p[i].getElementsByTagName("span");
                for (var a = 0; a < spans.length; a++) {
                    spans[a].onmouseover = onmouseoverspan;
                    spans[a].onmouseout = onmouseoutspan;
                    spans[a].onclick = onclickspan;
                }
            }
        } else {
            /*remove spans and toggle OFF*/
            defHelp.classList.add('hidden');
            for (var _i = 0; _i < p.length; _i++) {
                if (p[_i] == undefined || p[_i].innerText === '') continue;
                p[_i].classList.remove("p");
                p[_i].innerHTML = originalP[_i];
            }
        }
    };
})();
/*fetch word*/
var wordLookupRequest = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(lookup) {
        var response, sorry, json, phon, word, speechPart, phonText, defo;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        lookup = lookup.replace(/[\u2000-\u206F\u2E00-\u2E7F!"#$%&()*+,\.\/:;<=>?@\[\]^_`{|}~]/g, ''); //all punct but - and '
                        lookup = lookup.replace(/'(.*?)'/g, '$1'); //add ' if not just one (quoted)
                        console.log(lookup);
                        _context.next = 5;
                        return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + lookup);

                    case 5:
                        response = _context.sent;
                        sorry = "Sorry, we could not find \" " + lookup + " \" in the dictionary, or the service is down. You can try the search again at later time or head to the web instead.";

                        if (!(response.status >= 200 && response.status <= 299)) {
                            _context.next = 24;
                            break;
                        }

                        _context.next = 10;
                        return response.json();

                    case 10:
                        json = _context.sent;
                        phon = "";

                        if (!json[0]) {
                            _context.next = 21;
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

                    case 21:
                        return _context.abrupt("return", sorry);

                    case 22:
                        _context.next = 25;
                        break;

                    case 24:
                        return _context.abrupt("return", sorry);

                    case 25:
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
    var tag = e.target;
    wordLookupRequest(e.target.innerText).then(function (word) {
        tag.setAttribute('data-tooltip', word);
        word.includes("Sorry, we could not find ") ? tag.classList.add('def-tooltip', 'def-tooltip-not-found') : tag.classList.add('def-tooltip');
    });
}