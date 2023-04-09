module.exports = {
    apps: [
        {
            name: 'bj-locations-api',
            exec_mode: 'cluster',
            instances: 2,
            port: 3000,
            script: 'dist/main.js'
        }
    ]
};