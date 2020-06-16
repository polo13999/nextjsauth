
switch (process.env.NODE_ENV) {
    case 'production':
        module.exports = {
            serverURL() { return !process.browser ? 'http://localhost:5002' : 'https://test.com' }
        }
        break
    default:
        module.exports = {
            // serverURL() { return !process.browser ? 'http://localhost:5002' : 'http://localhost:5002' }
            serverURL() { return !process.browser ? 'http://localhost:5002' : 'https://clawfun.online' }
        }
}
