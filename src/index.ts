const fs = require('fs');

const shuffle = (array: number[]): number[] => {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}
const argObj: { [key: string]: string } = {};
for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    const argVal = arg.slice(arg.indexOf('=') + 1, arg.length);
    const argObjKey = arg.slice(0, arg.indexOf('='));
    if (arg.startsWith('from=')) {
        argObj.from = argVal;
    } else if (arg.startsWith('to=')) {
        argObj.to = argVal;
    } else {
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

let imgExt: string;

if (!argObj.images && !argObj.json) {
    console.log("Please provide either images or json path");
    process.exit(1);
}

console.log("===============================");
console.log("==   Randomization Started   ==");
console.log("===============================");
console.log("\n");

if (argObj.images) {
    const dirImg = 'build/' + argObj?.images?.split('/').pop();
    if (!fs.existsSync(dirImg)) {
        fs.mkdirSync(dirImg);
    }
    fs.readdir(argObj.images, function (error: NodeJS.ErrnoException | null, data: string[]) {
        if (error) {
            console.log(error.message);
            return;
        }
        if (data.length > 0) {
            let i = 0;
            while (i < data.length) {
                const ext = data[i].slice(data[i].indexOf('.'), data[i].length);
                imgExt = ext;

                fs[["yes", "YES", "y", "Y", "true", "TRUE"].includes(argObj.removesource) ? "rename" : "copyFile"](argObj.images + '/' + data[i], dirImg + '/' + arr[i] + ext, (err: NodeJS.ErrnoException | null) => {
                    if (err) console.log('ERROR: ' + err);
                });
                log(data[i] + ' ==> ' + arr[i] + ext, i);
                i++;
            }
        }
    });
}
if (argObj.json) {
    const dirJson = 'build/' + argObj?.json?.split('/').pop();
    if (!fs.existsSync(dirJson)) {
        fs.mkdirSync(dirJson);
    }
    fs.readdir(argObj.json, function (error: NodeJS.ErrnoException | null, data: string[]) {
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
                } else {
                    fs[["yes", "YES", "y", "Y", "true", "TRUE"].includes(argObj.removesource) ? "rename" : "copyFile"](argObj.json + '/' + data[i], dirJson + '/' + arr[i] + ext, function (err: NodeJS.ErrnoException | null) {
                        if (err) console.log('ERROR: ' + err);
                    });
                }

                log(data[i] + ' ==> ' + arr[i] + ext, i);
                i++;
            }
        }
    });
}


const writeFile = (data: string, arr: number, ext: string, dirJson: string, index: number, name?: string, description?: string, image?: string) => {
    fs.readFile(argObj.json + '/' + data, function (error: NodeJS.ErrnoException | null, dataRead: Buffer | string) {
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
        fs.writeFile(argObj.json + '/' + data, jsonFile, function (err: NodeJS.ErrnoException | null) {
            if (err) throw err;
            log("Writing Successfully ==> " + arr + ext, index);
            fs[["yes", "YES", "y", "Y", "true", "TRUE"].includes(argObj.removesource) ? "rename" : "copyFile"](argObj.json + '/' + data, dirJson + '/' + arr + ext, function (err: NodeJS.ErrnoException | null) {
                if (err) console.log('ERROR: ' + err);
            });
        });
    });
}

let completed = [];
const log = (data: string, index: number) => {
    fs.appendFile("build" + '/' + "log.txt", "\n" + data, function (err: NodeJS.ErrnoException | null) {
        if (err) throw err;
        console.log(data);
        if (index === arrKeys.length - 1) {
            completed.push(data.includes("json") ? "json" : "images");
        }
    });
}

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
