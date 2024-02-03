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
With * are required.

from *
to *
```

#### Using (Passing Arguments)
```
Command:
npm run start -- from=[from count] to=[to count] json=[json folder OR path] images=[images folder OR path] name=[update name in metadata] description=[update description in metadata] image=[update image url path in metadata]

Example:
npm run start -- from=1 to=1000 json=files/json name="Hello World" description="This is description" image="https://example.com/ipfs"
```

#### Using (Prompt)
```
Command:
npm run prompt
```