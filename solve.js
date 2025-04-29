let trickshot_score = null;
let trickshot = null;

let minim_score = null;
let minim = null;

let best_score = null;
let best = null;

let found = [];
let out = "";

function replace(arr, a, b) {
    arr[arr.indexOf(a)] = b
}

function sorted(arr) {
    let new_ = arr.slice();
    new_.sort();
    return new_;
}

function ar_eq(a, b) {
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

function includes_sub(a, b) {
    for (let el of a) {
        if (ar_eq(el, b)) return true;
    }

    return false;
}

function reversed(arr) {
    let out = [];
    for (let el of arr) {
        out = [el].concat(out);
    }
    return out;
}

function count(arr, el) {
    let c = 0;
    for (let e of arr) {
        if (e == el) {
            c++;
        }
    }
    return c;
}

function solve(n, target, soln = "") {
    if (n.includes(target)) {
        let parts = soln.split(", ");
        parts.pop();

        if (includes_sub(found, sorted(parts))) {
            return;
        }

        let created = parts.slice(0, -1).map(part => part.split('= ')[1]);

        let used = [];
        for (let part of parts) {
            for (let i = 0; i < 2; i++) {
                used.push(part.split(" =")[0].split(" ")[i * 2]);
            }
        }

        let max_n = Math.max(...created.map(e => parseInt(e)));
        if (trickshot_score == null || max_n > trickshot_score) {
            trickshot = soln.slice(0, -2);
            trickshot_score = max_n;
        }

        if (minim_score == null || parts.length < minim_score) {
            minim = soln.slice(0, -2);
            minim_score = parts.length;
        }

        if (best_score == null || full_heuristic(parts) > best_score) {
            best = soln.slice(0, -2);
            best_score = full_heuristic(parts);
        }

        for (let n of created) {
            if (!used.includes(n)) return
        }

        found.push(sorted(parts));
        if (n.length == 1) out += ">>> ";
        out += `${soln.slice(0, -2)}\n`;
        return;
    }

    else if (n.length == 1) {
        return
    }

    let operators = {
        "+": (a, b) => a + b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "-": (a, b) => a - b
    };

    n.sort();

    let pairs = [];
    let i = 0;
    for (let a of n) {
        let j = 0;
        for (let b of n) {
            if (i < j) pairs.push([a, b]);
            j++;
        }
        i++;
    }

    let calcs = [];
    for (let pair of pairs) {
        for (let op of "+-*/") {
            calcs.push([pair, op]);
            if (op == "-" || op == "/") calcs.push([reversed(pair), op])
        }
    }

    let seen_pm = [];

    for (let calc of calcs) {
        let pair = calc[0];
        let op = calc[1];

        let a = pair[0];
        let b = pair[1];

        if ("+*".includes(op)) {
            if (!includes_sub(seen_pm, [reversed(pair), op])) {
                seen_pm.push([pair, op])
            } else continue
        }

        let res = operators[op](a, b);
        if (res == parseInt(res) && res > 0 && !pair.includes(res)) {
            res = parseInt(res);
            let new_n = n.slice();
            replace(new_n, a, res);
            new_n.splice(new_n.indexOf(b), 1);

            solve(new_n, target, soln + `${a} ${op} ${b} = ${res}, `);
        } else if (pair.includes(res)) {
            console.log(pair, res);
        }
    }
}

function S() {
    trickshot_score = null;
    trickshot = null;
    
    minim_score = null;
    minim = null;
    
    best_score = null;
    best = null;

    found = [];
    out = "";
    
    let el = document.getElementById("nums")
    let args = el.value.split(" ").map(e => parseInt(e));
    let target = args.slice(-1)[0];
    let nums = args.slice(0, -1);
    solve(nums, target);
    document.getElementById("out").innerText = best ? best : ":(";
    document.getElementById("out-trickshot").innerText = best ? `Trickshot: ${trickshot}` : ":(";
}

function full_heuristic(parts) {
    let sum = 0;
    let num = 0;
    for (let part of parts) {
        if (part.includes("*")) {
            let a = part.split(" * ")[0];
            let b = part.split(" * ")[1];
            b = b.split(" =")[0];
            a = parseInt(a);
            b = parseInt(b);
            sum += multiplication_familiarity(a, b);
            num++;
        }
    }

    return num ? sum / (num) : 1.0;
}

function multiplication_familiarity(a, b) {
    if (a > b) [a, b] = [b, a]  
    let product = a * b;
  
    let table_familiarity = {
        1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.0,
        6: 0.9, 7: 0.9, 8: 0.8, 9: 0.8, 10: 1.0,
        11: 0.9, 12: 0.9, 13: 0.6, 14: 0.5, 15: 0.9,
        16: 0.5, 17: 0.4, 18: 0.5, 19: 0.3,
        20: 0.9, 25: 0.95, 50: 0.95, 75: 0.85, 100: 1.0
    };
  
    // let mental_trick_numbers = new Set([11, 25, 50, 100]);
  
    let fam_a = table_familiarity[a] || 0.3;
    let fam_b = table_familiarity[b] || 0.3;
    let familiarity = Math.max(fam_a, fam_b);
    
    let nice_score = 0.5;

    if (product % 100 === 0) nice_score = 1.0;
    else if (product % 10 === 0 || product % 10 === 5) nice_score = 0.9;

    if (product > 1000) nice_score = 0;
  
    return familiarity * 0.6 + nice_score * 0.7;
}
