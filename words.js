words = [];

async function load_words() {
    let file = await fetch("list.txt");
    let text = await file.text();
    words = text.split("\n").map(e => e.replace(/\r$/, ""));
}

load_words();

function solve_word(letters) {
    let new_words = words.slice();
    let disallowed = "abcdefghijklmnopqrstuvwxyz";
    for (let letter of letters) {
        disallowed = disallowed.replace(letter, "");
    }

    new_words = new_words.filter(e => {
        for (let letter of e) {
            if (disallowed.includes(letter)) return false;
        }

        return true;
    });

    for (let letter of letters) {
        new_words = new_words.filter(e => {
            if (count(e, letter) > count(letters, letter)) return false;
            return true;
        });
    }

    new_words.sort((a, b) => b.length - a.length);
    console.log(new_words.slice(0, 10));
    let lengths = {};
    for (let word of new_words) {
        if (!Object.keys(lengths).includes(String(word.length))) {
            lengths[word.length] = [word];
        } else {
            lengths[word.length].push(word);
        }
    }

    // Object.keys(lengths).forEach(e => {
    //     lengths[e] = lengths[e]; // .slice(0, 10)
    // })
    // return new_words.slice(0, 3);
    return lengths;
}

function SW() {
    let el = document.getElementById("letters");
    let letters = el.value.toLowerCase();
    let lengths = solve_word(letters);
    let out = document.getElementById("outl");
    out.innerHTML = "";
    for (let length of Object.keys(lengths)) {
        out.innerHTML += `<h1>${length}-letter words</h1><br>${lengths[length].join("<br>")}<hr>`;
    }

    out.innerHTML = reversed(out.innerHTML.split("<hr>")).join("<hr>");
}

function check() {
    let el = document.getElementById("check");
    let word = el.value.toLowerCase();
    let btn = document.getElementById("check-btn");
    btn.style.background = (words.includes(word)) ? "green" : "red";
}