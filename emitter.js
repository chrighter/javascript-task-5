'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function getEvents(event) {
    let littleEvents = [];
    littleEvents.push(event);
    let ind = event.lastIndexOf('.');
    while (ind >= 0) {
        event = event.slice(0, ind);
        littleEvents.push(event);
        ind = event.lastIndexOf('.');
    }

    return littleEvents;
}

function isInclude(includingEvent, includedEvent) {
    return includingEvent.startsWith(includedEvent + '.') || includingEvent === includedEvent;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let emitents = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            // сколько всего нужно вызвать, частота, текущий счетчиквызова
            emitents.push({ event, context, handler, times: Infinity, frequency: 1,
                currentIndex: 0 });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            emitents = emitents.filter(function (emitent) {
                if (emitent.context !== context) {
                    return true;
                }

                return !isInclude(emitent.event, event);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const allEvents = getEvents(event);

            allEvents.forEach(function (littleEvent) {
                emitents.forEach(function (emitent) {
                    if (emitent.event === littleEvent) {
                        if (emitent.times > 0 && !(emitent.currentIndex % emitent.frequency)) {
                            emitent.handler.call(emitent.context);
                        }
                        emitent.currentIndex += 1;
                        emitent.times -= 1;
                    }
                });
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            emitents.push({ event, context, handler, times, frequency: 1, currentIndex: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            emitents.push({ event, context, handler, times: Infinity, frequency, currentIndex: 0 });

            return this;
        }
    };
}
