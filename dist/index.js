"use strict";
var _a, _b;
const fs = require('fs');
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
};
const argObj = {};
for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    const argVal = arg.slice(arg.indexOf('=') + 1, arg.length);
    const argObjKey = arg.slice(0, arg.indexOf('='));
    if (arg.startsWith('from=')) {
        argObj.from = argVal;
    }
    else if (arg.startsWith('to=')) {
        argObj.to = argVal;
    }
    else {
        argObj[argObjKey] = argVal;
    }
}
const from = parseInt(argObj.from);
const to = parseInt(argObj.to);
const arrKeys = [...Array(to).keys()].map(i => i + from);
const arr = shuffle(arrKeys);
if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}
let imgExt;
if (!argObj.images && !argObj.json) {
    console.log("Please provide either images or json path");
    process.exit(1);
}
console.log("===============================");
console.log("==   Randomization Started   ==");
console.log("===============================");
console.log("\n");
if (argObj.images) {
    const dirImg = 'build/' + ((_a = argObj === null || argObj === void 0 ? void 0 : argObj.images) === null || _a === void 0 ? void 0 : _a.split('/').pop());
    if (!fs.existsSync(dirImg)) {
        fs.mkdirSync(dirImg);
    }
    fs.readdir(argObj.images, function (error, data) {
        if (error) {
            console.log(error.message);
            return;
        }
        if (data.length > 0) {
            let i = 0;
            while (i < data.length) {
                const ext = data[i].slice(data[i].indexOf('.'), data[i].length);
                imgExt = ext;
                fs[["yes", "YES", "y", "Y", "true", "TRUE"].includes(argObj.removesource) ? "rename" : "copyFile"](argObj.images + '/' + data[i], dirImg + '/' + arr[i] + ext, (err) => {
                    if (err)
                        console.log('ERROR: ' + err);
                });
                log(data[i] + ' ==> ' + arr[i] + ext, i);
                i++;
            }
        }
    });
}
if (argObj.json) {
    const dirJson = 'build/' + ((_b = argObj === null || argObj === void 0 ? void 0 : argObj.json) === null || _b === void 0 ? void 0 : _b.split('/').pop());
    if (!fs.existsSync(dirJson)) {
        fs.mkdirSync(dirJson);
    }
    fs.readdir(argObj.json, function (error, data) {
        if (error) {
            console.log(error.message);
            return;
        }
        if (data.length > 0) {
            let i = 0;
            while (i < data.length) {
                const ext = data[i].slice(data[i].indexOf('.'), data[i].length);
                if (argObj.name || argObj.description || argObj.image) {
                    writeFile(data[i], arr[i], ext, dirJson, i, argObj.name, argObj.description, argObj.image);
                }
                else {
                    fs[["yes", "YES", "y", "Y", "true", "TRUE"].includes(argObj.removesource) ? "rename" : "copyFile"](argObj.json + '/' + data[i], dirJson + '/' + arr[i] + ext, function (err) {
                        if (err)
                            console.log('ERROR: ' + err);
                    });
                }
                log(data[i] + ' ==> ' + arr[i] + ext, i);
                i++;
            }
        }
    });
}
const writeFile = (data, arr, ext, dirJson, index, name, description, image) => {
    fs.readFile(argObj.json + '/' + data, function (error, dataRead) {
        if (error) {
            console.log(error);
            return;
        }
        let obj = typeof dataRead === 'string' ? JSON.parse(dataRead) : dataRead;
        if (obj == "") {
            obj = {};
        }
        if (name) {
            obj.name = name + ' #' + arr;
        }
        if (description) {
            obj.description = description;
        }
        if (image) {
            obj.image = image + '/' + arr + imgExt;
        }
        obj.randomizationBy = "MG:https://github.com/moazzamgodil";
        const jsonFile = JSON.stringify(obj);
        fs.writeFile(argObj.json + '/' + data, jsonFile, function (err) {
            if (err)
                throw err;
            log("Writing Successfully ==> " + arr + ext, index);
            fs[["yes", "YES", "y", "Y", "true", "TRUE"].includes(argObj.removesource) ? "rename" : "copyFile"](argObj.json + '/' + data, dirJson + '/' + arr + ext, function (err) {
                if (err)
                    console.log('ERROR: ' + err);
            });
        });
    });
};
let completed = [];
const log = (data, index) => {
    fs.appendFile("build" + '/' + "log.txt", "\n" + data, function (err) {
        if (err)
            throw err;
        console.log(data);
        if (index === arrKeys.length - 1) {
            completed.push(data.includes("json") ? "json" : "images");
        }
    });
};
let interval = setInterval(() => {
    if ((argObj.images && argObj.json && completed.length === 2) || ((argObj.images || argObj.json) && completed.length === 1)) {
        console.log("\n");
        console.log("=================================");
        console.log("==   Randomization Completed   ==");
        console.log("=================================");
        console.log("\n");
        clearInterval(interval);
    }
}, 1000);
