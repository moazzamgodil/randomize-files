#! /usr/bin/env node
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { spawn, execSync } = require('child_process');
const readline = require('readline');
const exec = (commands) => {
    execSync(commands, { stdio: 'inherit', shell: true });
};
const spawnProcess = (commands) => {
    spawn(commands, { stdio: 'inherit', shell: true });
};
const args = {};
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const question1 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter count starts from [required]: ', (answer) => {
            if (!answer) {
                reject('Please enter a valid number');
                return;
            }
            args.from = answer;
            resolve("");
        });
    });
};
const question2 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter count ends to [required]: ', (answer) => {
            if (!answer) {
                reject('Please enter a valid number');
                return;
            }
            args.to = answer;
            resolve("");
        });
    });
};
const question3 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter path of json folder (default: none): ', (answer) => {
            args.json = answer;
            resolve("");
        });
    });
};
const question4 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter path of images folder (default: none): ', (answer) => {
            args.images = answer;
            resolve("");
        });
    });
};
const question5 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter name to update in metadata (default: none): ', (answer) => {
            args.name = answer;
            resolve("");
        });
    });
};
const question6 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter description to update in metadata (default: none): ', (answer) => {
            args.description = answer;
            resolve("");
        });
    });
};
const question7 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter image url path to update in metadata (default: none): ', (answer) => {
            args.image = answer;
            resolve("");
        });
    });
};
const question8 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Do you want to remove source files after randomization. This will permanently delete your files from source directory you provided (default: false): ', (answer) => {
            if (!answer) {
                answer = "false";
            }
            args.remove = answer;
            resolve("");
        });
    });
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield question1();
        yield question2();
        yield question3();
        yield question4();
        yield question5();
        yield question6();
        yield question7();
        yield question8();
        let execString = "npm run start -- ";
        execString += (args === null || args === void 0 ? void 0 : args.from) ? `from=${args === null || args === void 0 ? void 0 : args.from} ` : "";
        execString += (args === null || args === void 0 ? void 0 : args.to) ? `to=${args === null || args === void 0 ? void 0 : args.to} ` : "";
        execString += (args === null || args === void 0 ? void 0 : args.json) ? `json=${args === null || args === void 0 ? void 0 : args.json} ` : "";
        execString += (args === null || args === void 0 ? void 0 : args.images) ? `images=${args === null || args === void 0 ? void 0 : args.images} ` : "";
        execString += (args === null || args === void 0 ? void 0 : args.name) ? `name=${args === null || args === void 0 ? void 0 : args.name} ` : "";
        execString += (args === null || args === void 0 ? void 0 : args.description) ? `description=${args === null || args === void 0 ? void 0 : args.description} ` : "";
        execString += (args === null || args === void 0 ? void 0 : args.image) ? `image=${args === null || args === void 0 ? void 0 : args.image}` : "";
        execString += (args === null || args === void 0 ? void 0 : args.remove) ? `removesource=${args === null || args === void 0 ? void 0 : args.remove}` : "";
        exec(execString);
    }
    catch (error) {
        console.error(error.message);
    }
    rl.close();
});
main();
