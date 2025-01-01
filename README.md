# Game of Life

John Conway, inventor of the Game of Life, has died of COVID-19. In his honor I'm making this Game of Life project.

## Main Requirements

> - node.js `v22.9.0`
> - react.js `18.3.1`

## Version

- `1.0.1`

## Platform Compatibility

- [x] macOS
- [x] Linux
- [x] Windows 11

## Installation Guide

Run the following code in the terminal to install and run the project.

```shell
git clone https://github.com/realJustinLee/Game_of_Life.git
cd Game_of_Life

cat>./.env<<EOF
REACT_APP_DEFAULT_ROWS=32
REACT_APP_DEFAULT_COLS=32
REACT_APP_DEFAULT_REPRODUCTION_TIME=100
EOF

npm run rebuild
npm install -g serve
serve -s build
```

## TODO

- [ ] Release this project to a desktop app with electron.

# Made with ❤ by [Justin Lee](https://github.com/realJustinLee)!

™ and © 1997-2023 Justin Lee. All Rights Reserved. [License Agreement](./LICENSE)
