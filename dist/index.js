#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
class RandomizeFiles {
    constructor() {
        this.argObj = {};
        this.EXPORT_DIR = 'build';
        this.completed = [];
        this.arr = [];
        this.arrKeys = [];
        this.getArgs = () => {
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
            return argObj;
        };
        this.validateArgs = () => {
            if (!this.argObj.from || !this.argObj.to) {
                console.log("Please provide from and to count");
                process.exit(1);
            }
        };
        this.validateFolders = () => {
            if (!this.argObj.images && !this.argObj.json) {
                console.log("Please provide either images or json path");
                process.exit(1);
            }
        };
        this.shuffle = (array) => {
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
        this.checkFolder = (path) => __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(path)) {
                yield new Promise((resolve, reject) => {
                    fs.readdirSync(path).forEach((file) => {
                        var curPath = path + "/" + file;
                        if (fs.lstatSync(curPath).isDirectory()) { // recurse
                            this.checkFolder(curPath);
                        }
                        else {
                            fs.unlinkSync(curPath);
                        }
                    });
                    resolve();
                });
            }
            else {
                yield fs.mkdirSync(this.EXPORT_DIR);
            }
        });
        this.actionPerform = (from, to, callback) => {
            var _a;
            fs[["yes", "y", "true"].includes((_a = this.argObj.removesource) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ? "rename" : "copyFile"](from, to, callback);
        };
        this.randomizeImages = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const dirImg = `${this.EXPORT_DIR}/` + ((_b = (_a = this.argObj) === null || _a === void 0 ? void 0 : _a.images) === null || _b === void 0 ? void 0 : _b.split('/').pop());
                if (!fs.existsSync(dirImg)) {
                    yield fs.mkdirSync(dirImg);
                }
                fs.readdir(this.argObj.images, (error, data) => {
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
                            this.actionPerform(this.argObj.images + '/' + data[i], dirImg + '/' + this.arr[i] + ext, (err) => {
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
            }));
        });
        this.randomizeJson = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a, _b;
                const dirJson = `${this.EXPORT_DIR}/` + ((_b = (_a = this.argObj) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b.split('/').pop());
                if (!fs.existsSync(dirJson)) {
                    fs.mkdirSync(dirJson);
                }
                fs.readdir(this.argObj.json, (error, data) => __awaiter(this, void 0, void 0, function* () {
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
                                yield this.writeFile(data[i], this.arr[i], ext, dirJson, this.argObj.name, this.argObj.description, this.argObj.image);
                            }
                            else {
                                this.actionPerform(this.argObj.json + '/' + data[i], dirJson + '/' + this.arr[i] + ext, function (err) {
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
                }));
            });
        });
        this.writeFile = (data, arr, ext, dirJson, name, description, image) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.readFile(this.argObj.json + '/' + data, (error, dataRead) => {
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
                    this.actionPerform(this.argObj.json + '/' + data, dirJson + '/' + arr + ext, (err) => {
                        if (err) {
                            console.log('ERROR: ' + err);
                            reject();
                        }
                        fs.writeFile(dirJson + '/' + arr + ext, jsonFile, (err) => {
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
        });
        this.startMessage = () => {
            console.log("===============================");
            console.log("==   Randomization Started   ==");
            console.log("===============================");
            console.log("\n");
        };
        this.endMessage = () => {
            setTimeout(() => {
                console.log("\n");
                console.log("===============================");
                console.log("==   Randomization Ended     ==");
                console.log("===============================");
                console.log("\n");
                process.exit();
            }, 1000);
        };
        this.log = (data) => {
            fs.appendFile(`${this.EXPORT_DIR}/` + "log.txt", "\n" + data, (err) => {
                if (err)
                    throw err;
                console.log(data);
            });
        };
        this.randomize = () => __awaiter(this, void 0, void 0, function* () {
            const from = parseInt(this.argObj.from);
            const to = parseInt(this.argObj.to);
            this.arrKeys = [...Array(to).keys()].map(i => i + from);
            this.arr = this.shuffle(this.arrKeys);
            yield this.checkFolder(this.EXPORT_DIR);
            this.validateFolders();
            this.startMessage();
            if (this.argObj.images) {
                yield this.randomizeImages();
            }
            if (this.argObj.json) {
                yield this.randomizeJson();
            }
            this.endMessage();
        });
        this.argObj = this.getArgs();
        this.validateArgs();
        this.randomize();
    }
}
new RandomizeFiles();
