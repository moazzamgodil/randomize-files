#! /usr/bin/env node
const fs = require('fs');

class RandomizeFiles {

    argObj: { [key: string]: string } = {};
    EXPORT_DIR = 'build';
    imgExt: string | undefined;
    completed: string[] = [];
    arr: number[] = [];
    arrKeys: number[] = [];

    constructor() {
        this.argObj = this.getArgs();
        this.validateArgs();
        this.randomize();
    }

    getArgs = (): { [key: string]: string } => {
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
        return argObj;
    }

    validateArgs = () => {
        if (!this.argObj.from || !this.argObj.to) {
            console.log("Please provide from and to count");
            process.exit(1);
        }
    }

    validateFolders = () => {
        if (!this.argObj.images && !this.argObj.json) {
            console.log("Please provide either images or json path");
            process.exit(1);
        }
    }

    shuffle = (array: number[]): number[] => {
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

    checkFolder = async (path: string) => {
        if (fs.existsSync(path)) {
            await new Promise<void>((resolve, reject) => {
                fs.readdirSync(path).forEach((file: string) => {
                    var curPath = path + "/" + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        this.checkFolder(curPath);
                    } else {
                        fs.unlinkSync(curPath);
                    }
                });
                resolve();
            })
        } else {
            await fs.mkdirSync(this.EXPORT_DIR);
        }
    };

    actionPerform = (from: string, to: string, callback: (err: NodeJS.ErrnoException | null) => void) => {
        fs[["yes", "y", "true"].includes(this.argObj.removesource?.toLowerCase()) ? "rename" : "copyFile"](from, to, callback);
    }

    randomizeImages = async () => {
        return new Promise<void>(async (resolve, reject) => {
            const dirImg = `${this.EXPORT_DIR}/` + this.argObj?.images?.split('/').pop();
            if (!fs.existsSync(dirImg)) {
                await fs.mkdirSync(dirImg);
            }
            fs.readdir(this.argObj.images, (error: NodeJS.ErrnoException | null, data: string[]) => {
                if (error) {
                    console.log(error.message);
                    reject();
                    return;
                }
                if (data.length > 0) {
                    let i = 0;
                    while (i < data.length) {
                        const ext = data[i].slice(data[i].indexOf('.'), data[i].length);
                        this.imgExt = ext;

                        this.actionPerform(this.argObj.images + '/' + data[i], dirImg + '/' + this.arr[i] + ext, (err: NodeJS.ErrnoException | null) => {
                            if (err) {
                                console.log('ERROR: ' + err);
                                reject();
                            }
                        });
                        this.log(data[i] + ' ==> ' + this.arr[i] + ext);
                        i++;
                    }
                }
                resolve();
            });
        });
    }

    randomizeJson = async () => {
        return new Promise<void>((resolve, reject) => {
            const dirJson = `${this.EXPORT_DIR}/` + this.argObj?.json?.split('/').pop();
            if (!fs.existsSync(dirJson)) {
                fs.mkdirSync(dirJson);
            }
            fs.readdir(this.argObj.json, async (error: NodeJS.ErrnoException | null, data: string[]) => {
                if (error) {
                    console.log(error.message);
                    reject();
                    return;
                }
                if (data.length > 0) {
                    let i = 0;
                    while (i < data.length) {
                        const ext = data[i].slice(data[i].indexOf('.'), data[i].length);

                        if (this.argObj.name || this.argObj.description || this.argObj.image) {
                            await this.writeFile(data[i], this.arr[i], ext, dirJson, this.argObj.name, this.argObj.description, this.argObj.image);
                        } else {
                            this.actionPerform(this.argObj.json + '/' + data[i], dirJson + '/' + this.arr[i] + ext, function (err: NodeJS.ErrnoException | null) {
                                if (err) {
                                    console.log('ERROR: ' + err);
                                    reject();
                                }
                            });
                        }

                        this.log(data[i] + ' ==> ' + this.arr[i] + ext);
                        i++;
                    }
                }
                resolve();
            });
        });
    }

    writeFile = async (data: string, arr: number, ext: string, dirJson: string, name?: string, description?: string, image?: string) => {
        return new Promise<void>((resolve, reject) => {
            fs.readFile(this.argObj.json + '/' + data, (error: NodeJS.ErrnoException | null, dataRead: Buffer | string) => {
                if (error) {
                    console.log(error);
                    reject();
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
                    obj.image = image + '/' + arr + this.imgExt;
                }
                obj.randomizationBy = "MG:https://github.com/moazzamgodil";
                const jsonFile = JSON.stringify(obj);
                this.actionPerform(this.argObj.json + '/' + data, dirJson + '/' + arr + ext, (err: NodeJS.ErrnoException | null) => {
                    if (err) {
                        console.log('ERROR: ' + err);
                        reject();
                    }
                    fs.writeFile(dirJson + '/' + arr + ext, jsonFile, (err: NodeJS.ErrnoException | null) => {
                        if (err) {
                            console.log('ERROR: ' + err);
                            reject();
                        }
                        this.log("Writing Successfully ==> " + arr + ext);
                        resolve();
                    });
                });
            });
        });
    }

    startMessage = () => {
        console.log("===============================");
        console.log("==   Randomization Started   ==");
        console.log("===============================");
        console.log("\n");
    }

    endMessage = () => {
        setTimeout(() => {
            console.log("\n");
            console.log("===============================");
            console.log("==   Randomization Ended     ==");
            console.log("===============================");
            console.log("\n");
            process.exit();
        }, 1000);
    }

    log = (data: string) => {
        fs.appendFile(`${this.EXPORT_DIR}/` + "log.txt", "\n" + data, (err: NodeJS.ErrnoException | null) => {
            if (err) throw err;
            console.log(data);
        });
    }

    randomize = async () => {
        const from = parseInt(this.argObj.from);
        const to = parseInt(this.argObj.to);
        this.arrKeys = [...Array(to).keys()].map(i => i + from);
        this.arr = this.shuffle(this.arrKeys);

        await this.checkFolder(this.EXPORT_DIR);

        this.validateFolders();
        this.startMessage();

        if (this.argObj.images) {
            await this.randomizeImages();
        }
        if (this.argObj.json) {
            await this.randomizeJson();
        }

        this.endMessage();
    }

}

new RandomizeFiles();