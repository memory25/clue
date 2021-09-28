## Prepare the build environment
1. Download NodeJS from [here](https://nodejs.org/zh-tw/download/) and install it.
2. Run command `npm ci` to install modules.

## Upload files to device
1. Run command `npm run build` 
2. Upload all files in `/build` folder to device folder `/www` via TFTP.

## Upload files to Web Server with mocking APIs
1. Run command `npm run simulator:build`
2. Upload all files in `/build` folder and deploy to web server (Heroku, Github page...)

## Develop Web GUI on your PC with mocking APIs under development mode
1. Run command `npm run simulator`
2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Develop Web GUI on your PC with device APIs under development mode
1. Edit `.env.local` to change device ip
2. Run command `npm start`
3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.





## How to remove nodejs pkg.
`sudo apt-get purge --auto-remove nodejs`

## Force to install dedicated version.
`Ex: Node.js v10.x:`

`curl -fsSL https://deb.nodesource.com/setup_10.x | sudo -E bash -`

`sudo apt-get install -y nodejs`

## Check nodejs version.
`node -v`
