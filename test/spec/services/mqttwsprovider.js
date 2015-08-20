'use strict';

describe('Service: mqttwsProvider', function () {

  // instantiate service
  var mqttwsProvider,
    init = function () {
      inject(function (_mqttwsProvider_) {
        mqttwsProvider = _mqttwsProvider_;
      });
    };

  // load the service's module
  beforeEach(module('myNewProjectApp'));

  it('should do something', function () {
    init();

    expect(!!mqttwsProvider).toBe(true);
  });

  it('should be configurable', function () {
    module(function (mqttwsProviderProvider) {
      mqttwsProviderProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(mqttwsProvider.greet()).toEqual('Lorem ipsum');
  });

});
