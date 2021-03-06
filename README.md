## Событийно-ориентированное программирование

* Каталог `/EventEmitter`
  - `emitter.js` - простейшая реализация EventEmitter
  - 'events.js' - расширенная версию EventEmitter для Node.js
* Каталог 'LiveTable' - пример таблицы, которая синхронизируется
между несколькими браузерами через отправку событий по Websocket

## Задания

1. Реализовать расширенный EventEmitter, как в 'events.js' на базе простого из
`emitter.js`, а не на базе встроенной в Node.js библиотеки `events`.
Адаптировать расширенный EventEmitter для одинаковой работы как в Node.js, так
и в браузере.
2. Модифицировать 'LiveTable' так, чтоб в ячейках можно было использовать
формулы, как в электронных таблицах, например: `= A1 + B2`, но сделать это без
использования циклов, а на событийной модели, т.е. при помощи подписки на
изменения, с применением EventEmitter.
3. Транслировать события не только внутри приложения, но и по сети через
Websocket и отправлять их в EventEmitter.

## Дополнительные задания

4. Сделать сетевую реализацию EventEmitter, делающую взаимодействие по сети
прозрачным между клиентом и сервером.

5. Модифицировать сетевую реализацию EventEmitter, чтоб взаимодействие по сети
было прозрачным между несколькими клиентами, через сервером. Реализовать
ретрансляцию событий.
