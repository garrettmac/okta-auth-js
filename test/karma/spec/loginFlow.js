/* global $ */
require('jasmine-ajax');

import tokens from '@okta/test.support/tokens';
import { AuthSdkError } from '@okta/okta-auth-js';
import { TestApp } from '@okta/test.app';
import waitFor from '@okta/test.support/waitFor';
import { AuthApiError } from '../../../lib/errors';

// eslint-disable-next-line max-statements
describe('Complete login flow', function() {

  const ASSUMED_TIME = 1449699929;
  const ISSUER = tokens.standardIdTokenParsed.issuer;
  const CALLBACK_PATH = '/implicit/callback';
  const REDIRECT_URI = `${ISSUER}${CALLBACK_PATH}`;
  const CLIENT_ID = tokens.standardIdTokenParsed.clientId;
  const DEFAULT_CONFIG = {
    issuer: ISSUER,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'email'],
    responseType: ['id_token', 'token'],
    tokenManager: {
      autoRenew: false
    }
  };

  const ACCESS_TOKEN = tokens.standardAccessToken;
  const ID_TOKEN = tokens.standardIdToken;
  const NONCE = tokens.standardIdTokenClaims.nonce;
  const AUTHORIZATION_CODE = 'FAKEY';
  const DOC_TITLE = 'i am a doc title';
  const JWKS_URI = 'http://myfake.jwks.local';

  // Values are from okta-core test
  var CODE_CHALLENGE = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';
  var CODE_VERIFIER = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';

  var app;
  var sdk;
  var setLocation;
  var getLocation;
  var getHistory;
  var getDocument;
  var _document;
  var _history;
  var _location;
  var $app;
  var fetch;

  beforeEach(function() {
    _history = {
      replaceState: jasmine.createSpy() 
    };
    _document = {
      title: DOC_TITLE
    };

    document.body.insertAdjacentHTML('beforeend', '<div id="root"></div>');
    var date = new Date();
    date.setTime(ASSUMED_TIME * 1000);
    jasmine.clock().mockDate(date);
    jasmine.Ajax.install();
    fetch = window.fetch;
    window.fetch = null; // disable native fetch, force XHR
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('root'));
    jasmine.clock().uninstall();
    jasmine.Ajax.uninstall();
    window.fetch = fetch;
  });

  async function bootstrap(config, pathname) {
    pathname = pathname || '';
    _location = new URL(`${ISSUER}${pathname}`);
    config = Object.assign({}, DEFAULT_CONFIG, config);
    app = new TestApp(config);
    await app.getSDKInstance();
    sdk = app.oktaAuth;
    sdk.tokenManager.clear();
    setLocation = spyOn(sdk.token.getWithRedirect, '_setLocation');
    getLocation = spyOn(sdk.token.parseFromUrl, '_getLocation').and.returnValue(_location);
    getHistory = spyOn(sdk.token.parseFromUrl, '_getHistory').and.returnValue(_history);
    getDocument = spyOn(sdk.token.parseFromUrl, '_getDocument').and.returnValue(_document);
  
    $app = $('#root');
    await app.mount(window, $app[0]);

    const isCallback = pathname.startsWith('/implicit/callback');
    if (isCallback) {
      await app.bootstrapCallback();
      await app.handleCallback();
    } else {
      await app.bootstrapHome();
    }
    return app;
  }

  function mockWellKnown() {
    sdk.options.storageUtil.getHttpCache(sdk.options.cookies).clearStorage();

    var wellKnown = {
      'jwks_uri': JWKS_URI,
      'code_challenge_methods_supported': ['S256']
    };
    var keys = [
      tokens.standardKey
    ];
    jasmine.Ajax.stubRequest(
      /.*\.well-known/
    ).andReturn({
      status: 200,
      responseText: JSON.stringify(wellKnown)
    });

    jasmine.Ajax.stubRequest(
      JWKS_URI
    ).andReturn({
      status: 200,
      responseText: JSON.stringify({
        keys: keys
      })
    });
  }

  it('implicit login flow', function() {
    // First hit /authorize
    return bootstrap({
      pkce: false
    })
    .then(function(app) {
      return app.loginRedirect({
        nonce: NONCE
      });
    })
    .then(function() {
      return waitFor(function() {
        return setLocation.calls.any();
      });
    })
    .then(function() {
      expect(setLocation.calls.count()).toBe(1);
      var url = new URL(setLocation.calls.first().args[0]);
      expect(url.origin).toBe(ISSUER);
      expect(url.pathname).toBe('/oauth2/v1/authorize');
      expect(url.searchParams.get('client_id')).toBe(CLIENT_ID);
      expect(url.searchParams.get('redirect_uri')).toBe(REDIRECT_URI);
      expect(url.searchParams.get('response_type')).toBe('id_token token');
      expect(url.searchParams.get('scope')).toBe('openid email');
      expect(url.searchParams.get('state')).toBeTruthy();
      expect(url.searchParams.get('nonce')).toBe(NONCE);
      return url;
    })
    .then(function(url) {
      // Now we handle the redirect
      mockWellKnown();
      const state = url.searchParams.get('state');
      // eslint-disable-next-line max-len
      const pathname = `${CALLBACK_PATH}#access_token=${ACCESS_TOKEN}&id_token=${ID_TOKEN}&state=${state}&nonce=${NONCE}&expires_in=1000`;
      return bootstrap({ pkce: false }, pathname)
      .then(function() {

        expect(getLocation).toHaveBeenCalled();

        // removeHash
        expect(getHistory).toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled(); 
        expect(_history.replaceState).toHaveBeenCalledWith(null, DOC_TITLE, CALLBACK_PATH);

        // Validate claims were processed by app
        var $claims = $app.find('#claims');
        expect($claims.length).toBe(1);
      });
    });
  });

  it('PKCE login flow', function() {
    // First hit /authorize
    return bootstrap()
    .then(function(app) {
      mockWellKnown();
      return app.loginRedirect({
        pkce: true,
        nonce: NONCE,
        codeVerifier: CODE_VERIFIER
      });
    }).then(function() {
      return waitFor(function() {
        return setLocation.calls.any();
      });
    })
    .then(function() {
      expect(setLocation.calls.count()).toBe(1);
      var url = new URL(setLocation.calls.first().args[0]);
      expect(url.origin).toBe(ISSUER);
      expect(url.pathname).toBe('/oauth2/v1/authorize');
      expect(url.searchParams.get('client_id')).toBe(CLIENT_ID);
      expect(url.searchParams.get('redirect_uri')).toBe(REDIRECT_URI);
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('scope')).toBe('openid email');
      expect(url.searchParams.get('state')).toBeTruthy();
      expect(url.searchParams.get('nonce')).toBeTruthy();
      expect(url.searchParams.get('code_challenge')).toBe(CODE_CHALLENGE);
      return url;
    })
    .then(function(url) {
      jasmine.Ajax.requests.reset();

      // Now we handle the redirect & hit /token
      const state = url.searchParams.get('state');
      const pathname = `${CALLBACK_PATH}?code=${AUTHORIZATION_CODE}&state=${state}`;
      const tokenResponse = {
        'access_token': ACCESS_TOKEN,
        'id_token': ID_TOKEN,
        'nonce': NONCE,
        'expires_in': 1000
      };
      jasmine.Ajax.stubRequest(
        /.*v1\/token/
      ).andReturn({
        status: 200,
        responseText: JSON.stringify(tokenResponse)
      });

      return bootstrap({}, pathname)
      .then(function() {

        expect(getLocation).toHaveBeenCalled();

        // removeHash
        expect(getHistory).toHaveBeenCalled();
        expect(getDocument).toHaveBeenCalled(); 
        expect(_history.replaceState).toHaveBeenCalledWith(null, DOC_TITLE, CALLBACK_PATH);

        // Validate POST request to /token
        var request = jasmine.Ajax.requests.first();
        expect(request.url).toBe(`${ISSUER}/oauth2/v1/token`);
        expect(request.method).toBe('POST');
        expect(request.requestHeaders['content-type']).toBe('application/x-www-form-urlencoded');
        expect(request.withCredentials).toBe(false);

        // Decode request params
        var params = {};
        request.params.split('&').forEach(function(str) {
          var pair = str.split('=');
          params[pair[0]] = decodeURIComponent(pair[1]);
        });
        expect(params['client_id']).toBe(CLIENT_ID);
        expect(params['redirect_uri']).toBe(REDIRECT_URI);
        expect(params['grant_type']).toBe('authorization_code');
        expect(params['code']).toBe(AUTHORIZATION_CODE);
        expect(params['code_verifier']).toBe(CODE_VERIFIER);

        // Validate claims were processed by app
        var $claims = $app.find('#claims');
        expect($claims.length).toBe(1);
      });
    });
  });

  it('PKCE: throws for invalid code_challenge_method', function() {
    // First hit /authorize
    return bootstrap()
    .then(function(app) {
      mockWellKnown();
      return app.loginRedirect({
        pkce: true,
        nonce: NONCE,
        codeVerifier: CODE_VERIFIER,
        codeChallengeMethod: 'invalid'
      });
    }).catch(function(e) {
      expect(e instanceof AuthSdkError).toBe(true);
      expect(e.message).toBe('Invalid code_challenge_method');
    });
  });

  it('PKCE: throws when authorization code is expired', function() {
    // First hit /authorize
    return bootstrap()
    .then(function(app) {
      mockWellKnown();
      return app.loginRedirect({
        pkce: true,
        nonce: NONCE,
        codeVerifier: CODE_VERIFIER
      });
    }).then(function() {
      return waitFor(function() {
        return setLocation.calls.any();
      });
    })
    .then(function() {
      var url = new URL(setLocation.calls.first().args[0]);
      return url;
    })
    .then(function(url) {
      jasmine.Ajax.requests.reset();

      // Now we handle the redirect & hit /token
      const state = url.searchParams.get('state');
      const pathname = `${CALLBACK_PATH}?code=${AUTHORIZATION_CODE}&state=${state}`;

      // simulate authorization code expiration
      jasmine.Ajax.stubRequest(
        /.*v1\/token/
      ).andReturn({
        status: 400,
        responseJSON: {
          'error': 'invalid_grant',
          'error_description': 'The authorization code is invalid or has expired.'
        }
      });

      return bootstrap({}, pathname)
      .then(function() {
        expect(false).toBe(true, '/token call should not succeed after 1 minute since authorization code issuing');
      }).catch(function (err) {
        expect(err instanceof AuthApiError).toBe(true);
        expect(err.xhr.message).toBe('Authorization code is invalid or expired.');
      });
    });
  });

});
