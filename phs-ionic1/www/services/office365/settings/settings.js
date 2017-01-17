/*var O365 = {
    clientId: '03c64c87-17e2-4c06-adfe-813bb48799b0',
    authUri: 'https://login.microsoftonline.com/common/',
    redirectUri: 'http://localhost:4400/services/office365/redirectTarget.html',
    domain: 'pukekohehigh.onmicrosoft.com',
    tenantId: '7b39214a-4248-4a00-9d48-38eec67ae997'
};*/


var O365Auth;
(function(O365Auth) {
    (function(Settings) {
        Settings.clientId = '03c64c87-17e2-4c06-adfe-813bb48799b0';
        Settings.authUri = 'https://login.microsoftonline.com/common/';
        Settings.redirectUri = 'http://localhost:4400/services/office365/redirectTarget.html';
        Settings.domain = 'pukekohehigh.onmicrosoft.com';
        Settings.tenantId= '7b39214a-4248-4a00-9d48-38eec67ae997';
    })(O365Auth.Settings || (O365Auth.Settings = {}));
    var Settings = O365Auth.Settings;
})(O365Auth || (O365Auth = {}));
