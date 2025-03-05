const express = require('express');
const router = express.Router();
const loginController = require('../controllers/logincont');

router.get('/login', loginController.showLoginPage);
router.post('/login', loginController.handleLogin);

router.get('/confirmlogin',loginController.showVerifyCode);
router.post('/confirmlogin',loginController.verifyCode);

module.exports = router;
Error: Route.get() requires a callback function but got a [object Undefined]
    at Route.<computed> [as get] (C:\Users\admin\OneDrive\Ambiente de Trabalho\reconstrucao\node_modules\express\lib\router\route.js:216:15)
o\reconstrucao\src\routers\loginRoutes.js:8:8)
    at Module._compile (node:internal/modules/cjs/loader:1434:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1518:10)
    at Module.load (node:internal/modules/cjs/loader:1249:32)
    at Module._load (node:internal/modules/cjs/loader:1065:12)
    at Module.require (node:internal/modules/cjs/loader:1271:19)
    at require (node:internal/modules/helpers:123:16)
    at Object.<anonymous> (C:\Users\admin\OneDrive\Ambiente de Trabalho\reconstrucao\app.js:22:21)

Node.js v22.2.0
[nodemon] app crashed - waiting for file changes before starting...
