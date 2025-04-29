let trickshot_score = null;
let trickshot = null;

let minim_score = null;
let minim = null;

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

        let max_n = Math.max(created.map(e => parseInt(e)));
        if (trickshot_score == null || max_n > trickshot_score) {
            trickshot_score = max_n;
            trickshot = soln.slice(0, -2);
        }

        if (minim_score == null || parts.length < minim_score) {
            minim = soln.slice(0, -2);
            minim_score = parts.length;
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
            if (i != j) pairs.push([a, b]);
            j++;
        }
        i++;
    }

    let calcs = [];
    for (let pair of pairs) {
        for (let op of "+-*/") {
            calcs.push([pair, op]);
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

        let valid = true;
        for (let part of pair) {
            if (count(n, part) < count(pair, part)) {
                valid = false;
            }
        }

        if (!valid) continue;

        let res = operators[op](a, b);
        if (res == parseInt(res) && res > 0 && !n.includes(res)) {
            res = parseInt(res);
            let new_n = n.slice();
            replace(new_n, a, res);
            new_n.splice(new_n.indexOf(b), 1);

            solve(new_n, target, soln + `${a} ${op} ${b} = ${res}, `);
        }
    }
}

function S() {
    trickshot_score = null;
    trickshot = null;
    
    minim_score = null;
    minim = null;
    
    found = [];
    out = "";
    
    let el = document.getElementById("nums")
    let args = el.value.split(" ").map(e => parseInt(e));
    let target = args.slice(-1)[0];
    let nums = args.slice(0, -1);
    console.log(args, target, nums, el);
    solve(nums, target);
    document.getElementById("out").innerText = minim ? minim : ":(";
}
