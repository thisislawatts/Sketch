Sketch
===

Synopsis
---

Sketch is used to create a local development environment for Lightspeed (formerly knows as SEOshop) themes.

Lightspeed uses the [Draft framework](http://developers.lightspeedhq.com/themes/draft/introduction/), the main component of this being the `.rain` language. This consists of variables and filters but otherwise is almost identical to the better known templating language [Twig](http://twig.sensiolabs.org/).


Requirements
---

- [Composer](https://getcomposer.org/)
- [PHP web server](http://php.net/manual/en/features.commandline.webserver.php): The router currently only works with Apache. You can port the apache rules to Nginx in the location block (will provide snippet for it soon)
- [Node.js](https://nodejs.org/en/)
- [Gulp](http://gulpjs.com/)


Installation
---

- Clone the Sketch repo `git clone https://github.com/Willemdumee/Sketch.git`
- Change into the cloned directory and run `npm install && composer install` in terminal.
- Update `sketch.config.json`, so that 'lightspeedUrl' matches your store's URL.
- Run `npm start` in terminal

__Example Configuration__

```json
{
  "lightspeedUrl": "https://example.webshopapp.com",
  "themeId": "123456",
  "localUrl": "http://127.0.0.1:8002",
  "emailAddress": "user@example.com",
  "password": "password"
}
```

__Sync mode__

Running `npm run sync`, will start up the local development as before but in addition will attempt to sync changes to the Lightspeed store.


Directory structure
---

```
src/
  assets/
    javascript/
    scss/
  layouts/
  pages/
  snippets/
theme/
 assets/
 layouts/
 pages/
 snippets/
```

The directory `src` is the primary place to work. The contents of the `theme` directory is generated by Gulp processes.

License
---

MIT




