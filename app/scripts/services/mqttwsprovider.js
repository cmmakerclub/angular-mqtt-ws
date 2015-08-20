'use strict';

/**
 * @ngdoc service
 * @name myNewProjectApp.mqttwsProvider
 * @description
 * # mqttwsProvider
 * Provider in the myNewProjectApp.
 */
angular.module('myNewProjectApp')
    .provider('mqttwsProvider', function () {
        var host;
        var port;
        var useTLS = false;
        var username = null;
        var password = null;
        var cleansession = true;

        var mqtt;
        var reconnectTimeout = 2000;
        var events = { };

        this.$get = function ($q) {
            return function socketFactory (options) {
                 var wrappedSocket = {
                     on: function(event, func) {
                         events[event] = func;
                     },
                     addListener: function() { },
                     subscribe: function(topic, opts) {
                        var opts = opts || { qos: 0 }
                        return function _subscribe() {
                            var defer = $q.defer();
                            var subscribed = function() {
                                defer.resolve(mqtt);
                            }

                            opts.onSuccess = subscribed;
                            mqtt.subscribe(topic, opts );
                            return defer.promise;
                        }
                     },
                     connect: function() {
                        var defer = $q.defer()
                        var onSuccess = function() {
                            var ev = events.connected || function() { };
                            ev.call(null, arguments);
                            defer.resolve(arguments);
                        }

                        var onFailure = function (message) {
                            console.log("failed");
                        }

                        var options = {
                            timeout: 3,
                            useSSL: useTLS,
                            cleanSession: cleansession,
                            onSuccess: onSuccess,
                            onFailure: onFailure
                        };

                        if (username != null) {
                            options.userName = username;
                            options.password = password;
                        }

                        mqtt.connect(options);

                        mqtt.onMessageArrived = function(message) {
                            var topic = message.destinationName;
                            var payload = message.payloadString;
                            var ev = events.message || function() { };
                            var ev2 = events[topic.toString()] || function() { };                            
                            ev.apply(null, [topic, payload, message]);
                            ev2.apply(null, [payload, message]);
                        }

                        return defer.promise;
                     }
                 };

                 console.log("mqttwsProvider execute");
                 options = options || {};

                 host = options.host || 'cmmc.xyz';
                 port = options.port || 9001;

                 mqtt = new Paho.MQTT.Client(host, port, "web_" + parseInt(Math.random() * 100, 10));

                 var callback = options.callback;


                 return wrappedSocket;
             };
        };


    });
