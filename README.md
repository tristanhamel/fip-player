# fip-player

[Demo here](https://fip-player.herokuapp.com/)

This app is a just for fun project entirely made with svgs. 
It uses [free apis](http://www.fipradio.fr/comment-ecouter-fip) from FIP, a great radio station from Radio France, the French national broadcast. 
Because it's deployed on a free server, the application stops to work after some minutes in order to save my traffic credit. 
If you like what you hear and want to keep listening, please use [the official FIP player](http://www.fipradio.fr/player)

## installation and usage
Make sure you have `node`, `yarn` and webpack (v3.6.0^) installed globally on your system.

Clone the repository:
```
git clone git@github.com:tristanhamel/fip-player.git
```

Install all dependencies:
```
cd fip-player
yarn
```

Start the proxy server:
```
yarn start
```

In another terminal window, the project in dev mode:
```
yarn serve
```

Build for production:
```
yarn build
```
