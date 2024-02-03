'use strict'
const { spawn, execSync } = require('child_process');
const readline = require('readline');

const exec = (commands: any) => {
    execSync(commands, { stdio: 'inherit', shell: true });
};
const spawnProcess = (commands: any) => {
    spawn(commands, { stdio: 'inherit', shell: true });
};

const args: any = {};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const question1 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter count starts from [required]: ', (answer: string) => {
            if (!answer) {
                reject('Please enter a valid number');
                return;
            }
            args.from = answer;
            resolve("");
        })
    })
}

const question2 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter count ends to [required]: ', (answer: string) => {
            if (!answer) {
                reject('Please enter a valid number');
                return;
            }
            args.to = answer;
            resolve("");
        })
    })
}

const question3 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter path of json folder (default: none): ', (answer: string) => {
            args.json = answer;
            resolve("");
        })
    })
}

const question4 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter path of images folder (default: none): ', (answer: string) => {
            args.images = answer;
            resolve("");
        })
    })
}

const question5 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter name to update in metadata (default: none): ', (answer: string) => {
            args.name = answer;
            resolve("");
        })
    })
}

const question6 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter description to update in metadata (default: none): ', (answer: string) => {
            args.description = answer;
            resolve("");
        })
    })
}

const question7 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter image url path to update in metadata (default: none): ', (answer: string) => {
            args.image = answer;
            resolve("");
        })
    })
}

const main = async () => {
    try {
        await question1();
        await question2();
        await question3();
        await question4();
        await question5();
        await question6();
        await question7();
        
        let execString = "npm run start -- ";
        execString += args?.from ? `from=${args?.from} ` : "";
        execString += args?.to ? `to=${args?.to} ` : "";
        execString += args?.json ? `json=${args?.json} ` : "";
        execString += args?.images ? `images=${args?.images} ` : "";
        execString += args?.name ? `name=${args?.name} ` : "";
        execString += args?.description ? `description=${args?.description} ` : "";
        execString += args?.image ? `image=${args?.image}` : "";
        exec(execString);
    } catch (error) {
        console.error(error)
    }
    rl.close()
}

main()