var fs = require('fs');

const shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

if (process.argv.length > 4) {
    argObj = {};
    for (i = 2; i < process.argv.length; i++) {
        var arg = process.argv[i];
        var argVal = arg.slice(arg.indexOf('=') + 1, arg.length);
        var argObjKey = arg.slice(0, arg.indexOf('='));
        if (arg.startsWith('from=')) {
            argObj.from = argVal;
        } else if (arg.startsWith('to=')) {
            argObj.to = argVal;
        } else {
            argObj[argObjKey] = argVal;
        }
    }

    from = parseInt(argObj.from);
    to = parseInt(argObj.to);
    let arrKeys = [...Array(to).keys()].map(i => i + from);
    const arr = shuffle(arrKeys);

    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    var imgExt;

    if (argObj.images) {
        var dirImg = 'build/' + argObj.images;
        if (!fs.existsSync(dirImg)) {
            fs.mkdirSync(dirImg);
        }
        fs.readdir(argObj.images, function(error, data) {
            if (error) {
                console.log(error);
                return;
            }
            if (data.length > 0) {
                var i = 0;
                while (i < data.length) {
                    var ext = data[i].slice(data[i].indexOf('.'), data[i].length);
                    imgExt = ext;
                    fs.rename(argObj.images + '/' + data[i], dirImg + '/' + arr[i] + ext, function(err) {
                        if (err) console.log('ERROR: ' + err);
                    });
                    log(data[i] + ' ==> ' + arr[i] + ext);
                    i++;
                }
            }
        });
    }
    if (argObj.json) {
        var dirJson = 'build/' + argObj.json;
        if (!fs.existsSync(dirJson)) {
            fs.mkdirSync(dirJson);
        }
        fs.readdir(argObj.json, function(error, data) {
            if (error) {
                console.log(error);
                return;
            }
            if (data.length > 0) {
                var i = 0;
                while (i < data.length) {
                    var ext = data[i].slice(data[i].indexOf('.'), data[i].length);

                    if (argObj.name || argObj.description || argObj.image) {
                        writeFile(data[i], arr[i], ext, argObj.name, argObj.description, argObj.image);
                    } else {
                        fs.rename(argObj.json + '/' + data[i], dirJson + '/' + arr[i] + ext, function(err) {
                            if (err) console.log('ERROR: ' + err);
                        });
                    }

                    log(data[i] + ' ==> ' + arr[i] + ext);
                    i++;
                }
            }
        });
    }


    const writeFile = (data, arr, ext, name, description, image) => {
        fs.readFile(argObj.json + '/' + data, function(error, dataRead) {
            if (error) {
                console.log(error);
                return;
            }
            var obj = JSON.parse(dataRead);
            if (name) {
                obj.name = name + ' #' + arr;
            }
            if (description) {
                obj.description = description;
            }
            if (image) {
                obj.image = image + '/' + arr + imgExt;
            }
            obj.randomizationBy = "MAG";
            jsonFile = JSON.stringify(obj);
            fs.writeFile(argObj.json + '/' + data, jsonFile, function(err) {
                if (err) throw err;
                log("Writing Successfully ==> " + arr + ext);
                fs.rename(argObj.json + '/' + data, dirJson + '/' + arr + ext, function(err) {
                    if (err) console.log('ERROR: ' + err);
                });
            });
        });
    }


    const log = (data) => {
        fs.appendFile("build" + '/' + "log.txt", "\n" + data, function(err) {
            if (err) throw err;
            console.log(data);
        });
    }

    console.log("Randomization Completed.")
}