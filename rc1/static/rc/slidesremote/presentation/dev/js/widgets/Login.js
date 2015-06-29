define(function(require, exports, module){
    function Login(){
        var googleapi = {
            setToken: function(data) {
                //Cache the token
                localStorage.access_token = data.access_token;
                //Cache the refresh token, if there is one
                localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;
                //Figure out when the token will expire by using the current
                //time, plus the valid time (in seconds), minus a 1 minute buffer
                var expiresAt = new Date().getTime() + parseInt(data.expires_in, 10) * 1000 - 60000;
                localStorage.expires_at = expiresAt;
            },
            authorize: function(options) {
                var deferred = $.Deferred();

                //Build the OAuth consent page URL
                var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                    client_id: options.client_id,
                    redirect_uri: options.redirect_uri,
                    response_type: 'code',
                    scope: options.scope
                });

                //Open the OAuth consent page in the InAppBrowser
                var authWindow = window.open(authUrl, '_blank','location=no,toolbar=no');

                //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
                //which sets the authorization code in the browser's title. However, we can't
                //access the title of the InAppBrowser.
                //
                //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
                //authorization code will get set in the url. We can access the url in the
                //loadstart and loadstop events. So if we bind the loadstart event, we can
                //find the authorization code and close the InAppBrowser after the user
                //has granted us access to their data.
                authWindow.addEventListener('loadstart', googleCallback);
                function googleCallback(e){
                    var url = (typeof e.url !== 'undefined' ? e.url : e.originalEvent.url);
                    var code = /\?code=(.+)$/.exec(url);
                    var error = /\?error=(.+)$/.exec(url);

                    if (code || error) {
                        //Always close the browser when match is found
                        authWindow.close();
                    }

                    if (code) {
                        //Exchange the authorization code for an access token
                        $.post('https://accounts.google.com/o/oauth2/token', {
                            code: code[1],
                            client_id: options.client_id,
                            client_secret: options.client_secret,
                            redirect_uri: options.redirect_uri,
                            grant_type: 'authorization_code'
                        }).done(function(data) {
                                googleapi.setToken(data);
                                deferred.resolve(data);
                            }).fail(function(response) {
                                deferred.reject(response.responseJSON);
                            });
                    } else if (error) {
                        //The user denied access to the app
                        deferred.reject({
                            error: error[1]
                        });
                    }
                }

                return deferred.promise();
            },
            getToken: function(options) {
                var deferred = $.Deferred();

                if (localStorage.expires_at && new Date().getTime() < localStorage.expires_at) {
                    deferred.resolve({
                        access_token: localStorage.access_token
                    });
                } else if (localStorage.refresh_token) {
                    $.post('https://accounts.google.com/o/oauth2/token', {
                        refresh_token: localStorage.refresh_token,
                        client_id: options.client_id,
                        client_secret: options.client_secret,
                        grant_type: 'refresh_token'
                    }).done(function(data) {
                            googleapi.setToken(data);
                            deferred.resolve(data);
                        }).fail(function(response) {
                            deferred.reject(response.responseJSON);
                        });
                } else {
                    deferred.reject();
                }

                return deferred.promise();
            },
            userInfo: function(options) {
                return $.getJSON('https://www.googleapis.com/drive/v2/files', options);
            }
        };

        var app = {
//            client_id: '5092555877-1in60f722m52mt2hr47lrc2d6r6qvbc9.apps.googleusercontent.com',
            client_id: '273547054679-siniqrmvqije3mlrha58fbp5v1ltguic.apps.googleusercontent.com',
//            client_secret: 'kKJSppdZ2Z-ePh7QmLhzuvt0',
            client_secret: 'yUAaR4Xjcyjn2uV6Ghzf8Fes',
            redirect_uri: 'http://localhost',
//            scope:'https://www.googleapis.com/auth/drive',
            scope:'https://www.googleapis.com/auth/drive.readonly',
            //scope: 'https://www.googleapis.com/auth/userinfo.profile',

            onLoginButtonClick: function(done, fail) {
                //Show the consent page
                googleapi.authorize({
                    client_id: app.client_id,
                    client_secret: app.client_secret,
                    redirect_uri: app.redirect_uri,
                    scope: app.scope
                }).done(done).fail(fail);
            }
        };
        return {
            googleapi: googleapi,
            app: app
        }
    }
    Login.prototype = Object.create(Object.prototype);
    Login.prototype.constructor = Login;
    module.exports = Login;

});