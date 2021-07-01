# MPU Cloud Server

A web server to organize storage for user's 3D-models and their additional data. Supports group storages.

## Features
All features below can be tested with [Postman](https://www.postman.com/) by using premade [collection and enviroment](https://github.com/besedinalex/mpu-cloud-server/tree/master/postman).
- GET, POST, PUT, DELETE requests via Express.
- SQLite database.
- JWT authentication.
- Config file to change certain settings.
- External GLTF-converter by [Andrey Arhipov](https://github.com/mrnexeon) via HTTP.
- All this Web API are utilized by [Vsevolod Kochnev's](https://github.com/Sevochka) browser app.

## Setup
- Install [Node.js](https://nodejs.org/).
- Make sure your CLI can handle `node` and `npm` commands.
- Run `npm ci` to install dependencies.

## Debug
Run `npm start`.

## Deploy
### If you just need to run it somewhere with Node.js:
- Run `npm build`.
- Run `node dist/index.js`.

### If you have access to web-client and want to bundle everything to one executable file (*works fine on Node 14*):
- Run `npm i pkg -g` (put `sudo` before it if you are on macOS or Linux).
- Install [Python 3](https://www.python.org).
- Make sure your CLI can handle `python` or `python3` command.
- Run `python build.py --os=win --arch=x64` to build for Windows x64.

Additional args for python script:
- `--os` can also handle `macos` or `linux`.
- `arch` can also handle `x86`.
