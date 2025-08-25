<?php

// cors.phpasdsa
return [

    'paths' => ['api/*', 'login', 'logout', 'register', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://train-react.test',         // Laravel
        'http://train-react.test:5173',    // ✅ Vite dev server
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
