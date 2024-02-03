// import fs from 'fs';
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

if (process.argv.length > 4) {
    const argObj: { [key: string]: string } = {};
    for (let i = 2; i < process.argv.length; i++) {
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
                    fs.rename(argObj.images + '/' + data[i], dirImg + '/' + arr[i] + ext, function (err: NodeJS.ErrnoException | null) {
                        if (err) console.log('ERROR: ' + err);
                    });
                    log(data[i] + ' ==> ' + arr[i] + ext);
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
                        writeFile(data[i], arr[i], ext, dirJson, argObj.name, argObj.description, argObj.image);
                    } else {
                        fs.rename(argObj.json + '/' + data[i], dirJson + '/' + arr[i] + ext, function (err: NodeJS.ErrnoException | null) {
                            if (err) console.log('ERROR: ' + err);
                        });
                    }

                    log(data[i] + ' ==> ' + arr[i] + ext);
                    i++;
                }
            }
        });
    }


    const writeFile = (data: string, arr: number, ext: string, dirJson: string, name?: string, description?: string, image?: string) => {
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
                log("Writing Successfully ==> " + arr + ext);
                fs.rename(argObj.json + '/' + data, dirJson + '/' + arr + ext, function (err: NodeJS.ErrnoException | null) {
                    if (err) console.log('ERROR: ' + err);
                });
            });
        });
    }


    const log = (data: string) => {
        fs.appendFile("build" + '/' + "log.txt", "\n" + data, function (err: NodeJS.ErrnoException | null) {
            if (err) throw err;
            console.log(data);
        });
    }

    console.log("Randomization Completed.")

}