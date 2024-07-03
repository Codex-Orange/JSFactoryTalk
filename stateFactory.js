// =================================================================
// return a promise that resolves after specified or random delay
// =================================================================
function pWait(msMin, msMax) {
    let delay = msMin;
    if (msMax) {
        delay = Math.floor(Math.random() * (msMax - msMin + 1)) + msMin;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(delay);
        }, delay);
    });
}

// =========================================
// return elapsed time in milliseconds
// =========================================
// const start = since();
// const elapsed1 = since(start);
// const elapsed2 = since(start);
function since(iMilliseconds) {
    if (iMilliseconds) {
        return new Date().getTime() - iMilliseconds;
    } else {
        return new Date().getTime();
    }
}

// ===============================================
// create a first class promise (ES6)
// ===============================================
function createStatePromise() {
    let resolveFunction;
    const promise = new Promise((resolve) => {
        resolveFunction = resolve;
    });
    promise.resolve = resolveFunction;
    return promise;
}

// =========================================
// state promise singleton factory
// =========================================
class StateFactory {
    constructor() {
        return new Proxy(this, {
            get(target, prop) {
                if (!(prop in target)) {
                    target[prop] = createStatePromise();
                    if (prop === "start") {
                        target[prop].resolve();
                    }
                }
                return target[prop];
            },
        });
    }
}

// ========================
// example start-up code
// ========================
const sf = new StateFactory();
const start = since();
console.log("Start");
sf.start.then(async () => {
    console.log("Start aa");
    await pWait(1000, 3000);
    console.log("Done aa " + since(start));
    sf.aaDone.resolve();
});
sf.start.then(async () => {
    console.log("Start bb");
    await pWait(1000, 3000);
    console.log("Done bb " + since(start));
    sf.bbDone.resolve();
});
sf.bbDone.then(async () => {
    console.log("Start cc");
    await pWait(1000, 3000);
    console.log("Done cc " + since(start));
    sf.ccDone.resolve();
});
Promise.all([sf.aaDone, sf.ccDone])
    .then(async () => {
        console.log("Start dd");
        await pWait(1000, 3000);
        console.log("Done dd " + since(start));
        sf.ddDone.resolve();
    });
sf.start.then(async () => {
    console.log("Start ee");
    await pWait(1000, 3000);
    console.log("Done ee " + since(start));
    sf.eeDone.resolve();
});
Promise.all([sf.ddDone, sf.eeDone])
    .then(async () => {
        console.log("Everything is Done " + since(start));
    });
console.log("Everything is launched " + since(start));
