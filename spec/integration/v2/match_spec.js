'use strict';

fdescribe('Match integration test', function() {

    var doneCallback;
    var mockService;
    var somethingLike = Pact.Match.somethingLike;
    var term = Pact.Match.term;
    var eachLike = Pact.Match.eachLike;

    beforeEach(function() {
        doneCallback = jasmine.createSpy('doneCallback').and.callFake(function (error) {
            expect(error).toBe(null);
        });

        mockService = Pact.mockService({
            consumer: 'Consumer',
            provider: 'Provider',
            port: 1234,
            done: doneCallback
        });
    });

    describe('complex object with multiple Pact.Matchers', function () {
        it('should respond with correct object', function(done) {
            var doHttpCall = function(callback) {
                specHelper.makeRequest({
                    body: 'body',
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    method: 'POST',
                    path: '/thing'
                }, callback);
            };

            mockService
                .uponReceiving('a request with Pact.Match using argument list')
                .withRequest('post', '/thing', {
                    'Content-Type': 'text/plain'
                }, 'body')
                .willRespondWith(200, {
                    'Content-Type': 'application/json'
                }, {
                    "items":eachLike({
                                size: somethingLike(10),
                                colour: term({generate: "red", matcher: "red|green|blue"}),
                                tag: eachLike([
                                    somethingLike("jumper"),
                                    somethingLike("shirt")
                                ], {min: 2})
                            }, {min: 1})
                }
            );

            mockService.run(done, function(runComplete) {
                doHttpCall(function (error, response) {
                    expect(error).toBe(null, 'error');
                    expect(JSON.parse(response.responseText)).toEqual({reply: 'Hello', language: 'English'}, 'responseText');
                    expect(response.status).toEqual(200, 'status');
                    expect(response.getResponseHeader('Content-Type')).toEqual('application/json', 'Content-Type header');
                    runComplete();
                });
            });
        });

    });
});