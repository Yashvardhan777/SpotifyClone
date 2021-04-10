const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//================================ REFRESH ROUTE ================================

app.post('/refresh', (req,res) => {
    const refreshToken = req.body.refreshToken
    console.log('refresh')
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/',
        clientId: '684f7829461e45cbb8748d0d378ecda5',
        clientSecret: '9f4e62e1aaaf44798b98b6537c955a37',
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400);
        });
})

//================================ LOGIN ROUTE ================================

app.post('/login', (req, res)=>{

    const code = req.body.code;
    // console.log(code)
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/',
        clientId: '684f7829461e45cbb8748d0d378ecda5',
        clientSecret: '9f4e62e1aaaf44798b98b6537c955a37'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        // console.log('The token expires in ' + data.body['expires_in']);
        // console.log('The access token is ' + data.body['access_token']);
        // console.log('The refresh token is ' + data.body['refresh_token']);
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((err) => {
        console.error(err)
        res.sendStatus(400);
    })

})

app.listen(3001,() => {
    console.log("App is live");
})

