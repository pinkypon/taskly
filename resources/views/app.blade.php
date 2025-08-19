<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>My SPA</title>

    <!-- {{-- ✅ Add CSRF token --}}
    <meta name="csrf-token" content="{{ csrf_token() }}" /> -->
    <link rel="stylesheet" href="https://unpkg.com/@vercel/geist@latest/font.css">

    @viteReactRefresh
    @vite('resources/js/apps.tsx')
  </head>
  <body class="color=bg-red-100">
    {{-- ✅ Add the root element for React --}}
    {{-- This is where your React app will be mounted --}}

    <div id="root"></div>
  </body>
</html>
