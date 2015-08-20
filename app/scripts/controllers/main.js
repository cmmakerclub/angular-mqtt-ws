'use strict';

/**
 * @ngdoc function
 * @name myNewProjectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the myNewProjectApp
 */
angular.module('myNewProjectApp')
  .factory("myMqtt", function(mqttwsProvider) {
      var options = {};
      var MQTT = mqttwsProvider(options);
      return MQTT;
  })
  .controller('MainCtrl', function (myMqtt, $scope) {

    $scope.dead = [];
    $scope.online = [];

    $scope.status = { };

    myMqtt.on("message", function(topic, payload, message) {
      var match = topic.match(/(.*)\/(.*)\/(.*)/)
      if (match[3] === "online") {
        console.log(match[2], payload)
        if (payload === "DEAD") {
          $scope.dead.push(match[2])
        }
        else {
          $scope.online.push(match[2])
        }
      }
      else if (match[3] == "status") {
        $scope.status[match[2]] = payload;
      }
    });

    myMqtt.on("esp8266/18:fe:34:a0:7d:99/status", function(payload, message) {
    //   console.log("ON STATUS", JSON.parse(payload));
    });

    myMqtt.connect("cmmc.xyz", 1883)
      .then(myMqtt.subscribe("esp8266/+/command"))
      .then(myMqtt.subscribe("esp8266/+/online"))
      .then(myMqtt.subscribe("esp8266/+/status")).then(function(mqtt) {
    mqtt.send("TEST TOPIC", "TEST PAYLOAD", 0, false);
      });
  });
