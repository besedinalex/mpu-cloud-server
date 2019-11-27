# Инструкция

## Разработка

`npm run server` - запуск сервера.

`npm run viewer-dev` - сборка viewer для отладки.

`npm run start` - запуск React приложения для отладки.

## Продакшн

Обязательно пройтись по всем TODO, которые требуют изменения IP и порта.

`npm run viewer-prod` - сборка viewer.

`npm run build` - сборка React приложения.

В папке /server/embedded-viewer удалить всё кроме /public.

Папку /build перенести в /server и переименовать в /public.

На сам сервер перенести /server, /node_modules, package.json, package-lock.json

`npm run server` - запуск сервера.
