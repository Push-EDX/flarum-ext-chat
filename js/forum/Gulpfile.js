var gulp = require('flarum-gulp');

gulp({
    modules: {
        'pushedx/realtime-chat': [
            'src/**/*.js'
        ]
    }
});
