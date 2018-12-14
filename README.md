# Playlist Generator for Spotify

Easily generate spotify playlists based on the Recommendations api from spotify.

[![Latest Release](https://img.shields.io/github/release/ItsWendell/playlist-generator-spotify/all.svg?style=flat-square)](https://github.com/ItsWendell/playlist-generator-spotify/releases)
[![Build Status](https://img.shields.io/travis/com/ItsWendell/playlist-generator-spotify/develop.svg?style=flat-square)](https://travis-ci.com/ItsWendell/playlist-generator-spotify)

## Start Developing

To get started playing around in this app first ofcourse clone this repo. 

This web app is build using a minimal Create React App setup and is all client-side. The app directly connects to the Spotify API. 

In order to connect to the Spotify API we need a Client ID in our environment variables. Create one at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) for free.

For local development copy the `.env.example` into `.env` and set your `REACT_APP_SPOTIFY_CLIENT_ID` to your custom client ID.

After that start the same way as any Create React App.

```bash
$ npm install
$ npm start
```

## Deploying

Want to deploy directly into a instance live on [Zeit Now](https://zeit.co/now)? It's really easy. First we need to add your client ID into your 'secrets' environment variables in Zeit.

Then we can simply deploy `now`.

```bash
$ now secret add REACT_APP_SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID
$ now
```

## Contributing

Contributions are always welcome.
This project is open source, and anyone may contribute.
To keep the project healthy and running smoothly, a couple of rules are defined.

1. Keep it friendly and accessible at all times.
2. Use the templates adequately with the required information.
3. Adhere the code styling and make sure CI passes.

Make something awesome!

## Contributors

* [byCedric](https://github.com/byCedric) - Code structure is based on his [Github Website](https://github.com/byCedric/GitHub-Website) project.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

--- ---

<p align="center">
    Made with :heart:
</p>
