// fetch("https://api.dictionaryapi.dev/api/v2/entries/en/sanguine", {
const wordLookupRqst = async (lookup) => {
    let response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${lookup}`
    );
    let json = await response.json();
    // let summary = `${json.name}, ${json.company}`;
    console.log(json);
    const word = json[0].word;
    const speechPart = json[0].meanings[0].partOfSpeech;
    const phonAudio = json[0].phonetics[0].audio;
    const phonText = json[0].phonetics[0].text;
    const defo = json[0].meanings[0].definitions[0].definition;
    console.log(`${word} - ${speechPart} (<a href="${phonAudio}">${phonText}</a>): ${defo}`)
};

wordLookupRqst("closure");