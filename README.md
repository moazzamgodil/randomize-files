# Randomize Files (Specially for Randomized NFTs)

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-14.x-green)

## Installation

You can install the package using [NPM](https://www.npmjs.com/package/randomize-files)

### Using NPM

```bash
npm install randomize-files
```

### Using Yarn

```bash
yarn add randomize-files
```

## Getting Started

-   :writing_hand: If you have questions [submit an issue](https://github.com/moazzamgodil/randomize-files/issues/new/choose)

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Usage

```
Arguments
=========

from (required)     ->  The count where the randomized number should be started (e.g. if from = 15, that means the number should not be less than 15)
to (required)       ->  The count where the randomized number should be ended (e.g. if to = 99, that means the number should not be greater than 99)
json                ->  The folder or path of JSON files (e.g. The metadata files are located at /files/json, so the json = files/json)
images              ->  The folder or path of images files (e.g. The images are located at /files/images, so the images = files/images)
name                ->  The name of NFT in the metadata you want to update. (e.g. name = "MyNFT", so in the metadata, the name will become "MyNFT#1" for NFT number 1)
description         ->  The description of NFT in the metadata you want to update.
image               ->  The image URL of the NFT you want to update in the metadata. Normally, it's an IPFS URI where the image is hosted.
removesource        ->  If you want to remove source files after randomization, pass true (default: false)
```

#### Note
If you want to randomize both JSON and image files, please make sure, the counting of both files is equal otherwise the randomization results in a bad one.

#### Using (Passing Arguments)
```
Command:
npx randomize -- from=[from count] to=[to count] json=[json folder OR path] images=[images folder OR path] name=[update name in metadata] description=[update description in metadata] image=[update image url path in metadata] removesource=[true OR false]

Example:
npx randomize -- from=1 to=1000 json=files/json name="Hello World" description="This is description" image="https://example.com/ipfs" removesource=false
```

#### Using (Prompt)
```
Command:
npx randomize-prompt
```

## Build

After being randomized, the files are moved to the build folder with logs.