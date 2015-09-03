'use strict';

describe('Match', function() {

    //create alias
    var somethingLike = Pact.Match.somethingLike;
    var term = Pact.Match.term;
    var eachLike = Pact.Match.eachLike;


    describe('term', function() {
        describe('when provided a term', function() {
            it('should return a serialized Ruby object', function() {
                var expected = {
                    "json_class": "Pact::Term",
                    "data": {
                        "generate": "myawesomeword",
                        "matcher": {
                            "json_class": "Regexp",
                            "o": 0,
                            "s": "\\w+"
                        }
                    }
                };

                var match = term({
                    generate: "myawesomeword",
                    matcher: "\\w+"
                });

                expect(match).toEqual(expected);
            });
        });

        describe("when not provided with a valid term", function() {
            var createTheTerm = function (badArg) {
                return function () {
                    term(badArg);
                }
            };

            describe("when no term is provided", function() {
                it("should throw an Error", function() {
                    expect(createTheTerm()).toThrow();
                });
            });

            describe("when an invalid term is provided", function() {
                it("should throw an Error", function () {
                    expect(createTheTerm({})).toThrow();
                    expect(createTheTerm("")).toThrow();
                    expect(createTheTerm({generate: "foo"})).toThrow();
                    expect(createTheTerm({matcher: "\\w+"})).toThrow();
                });
            });
        });
    });

    describe('somethingLike', function () {
        describe('when provided a value', function() {
            it('should return a serialized Ruby object', function() {
                var expected = {
                    "json_class": "Pact::SomethingLike",
                    "contents": "myspecialvalue"
                };

                var match = somethingLike("myspecialvalue");
                expect(match).toEqual(expected);
            });
        });

        describe("when not provided with a valid value", function() {
            var createTheValue = function (badArg) {
                return function () {
                    somethingLike(badArg);
                }
            };

            describe("when no value is provided", function() {
                it("should throw an Error", function() {
                    expect(createTheValue()).toThrow();
                });
            });

            describe("when an invalid value is provided", function() {
                it("should throw an Error", function() {
                    expect(createTheValue(undefined)).toThrow();
                    expect(createTheValue(function(){})).toThrow();
                });
            });
        });
    });

    describe('eachLike', function() {
        describe('when content is null', function() {
            it('should provide null as contents', function() {
                var expected = {
                    "json_class": "Pact::ArrayLike",
                    "contents": null,
                    "min": 1
                };

                var match = eachLike(null, {min: 1});
                expect(match).toEqual(expected);
            });
        });

        describe('when an object is provided', function() {
            it('should provide the object as contents', function() {
                var expected = {
                    "json_class": "Pact::ArrayLike",
                    "contents": {a:1},
                    "min": 1
                };

                var match = eachLike({a: 1}, {min: 1});
                expect(match).toEqual(expected);
            });
        });

        describe('when an array is provided', function() {
            it('should provide the array as contents', function() {
                var expected = {
                    "json_class": "Pact::ArrayLike",
                    "contents": [1,2,3],
                    "min": 1
                };

                var match = eachLike([1,2,3], {min: 1});
                expect(match).toEqual(expected);
            });
        });

        describe('when a value is provided', function() {
            it('should add the value in contents', function() {
                var expected = {
                    "json_class": "Pact::ArrayLike",
                    "contents": "test",
                    "min": 1
                };

                var match = eachLike("test", {min: 1});
                expect(match).toEqual(expected);
            });
        });

        describe('when the content has Pact.Macters', function() {
            describe('of type somethingLike', function() {
                it('should nest somethingLike correctly', function() {
                    var expected = {
                        "json_class": "Pact::ArrayLike",
                        "contents": {
                            "id": {
                                "json_class": "Pact::SomethingLike",
                                "contents": 10
                            }
                        },
                        "min": 1
                    };

                    var match = eachLike({ id: somethingLike(10) }, {min: 1});
                    expect(match).toEqual(expected);
                });
            });

            describe('of type term', function() {
                it('should nest term correctly', function() {
                    var expected = {
                        "json_class": "Pact::ArrayLike",
                        "contents": {
                            "colour": {
                                "json_class": "Pact::Term",
                                "data": {
                                    "generate": "red",
                                    "matcher": {
                                        "json_class": "Regexp",
                                        "o": 0,
                                        "s": "red|green"
                                    }
                                }
                            }
                        },
                        "min": 1
                    };

                    var match = eachLike({
                        colour: term({
                            generate: 'red',
                            matcher: 'red|green'
                        })
                    }, {min: 1});

                    expect(match).toEqual(expected);
                });
            });

            describe('of type eachLike', function() {
                it('should nest eachlike in contents', function() {
                    var expected = {
                        "json_class": "Pact::ArrayLike",
                        "contents": {
                            "json_class": "Pact::ArrayLike",
                            "contents": "blue",
                            "min": 1
                        },
                        "min": 1
                    };

                    var match = eachLike(eachLike("blue", {min: 1}), {min: 1});
                    expect(match).toEqual(expected);
                });
            });

            describe('complex object with multiple Pact.Matchers', function() {
                it('should nest objects correctly', function() {
                    var expected = {
                        "json_class": "Pact::ArrayLike",
                        "contents": {
                            "json_class": "Pact::ArrayLike",
                            "contents": {
                                "size": {
                                    "json_class": "Pact::SomethingLike",
                                    "contents": 10
                                },
                                "colour": {
                                    "json_class": "Pact::Term",
                                    "data": {
                                        "generate": "red",
                                        "matcher": {
                                            "json_class": "Regexp",
                                            "o": 0,
                                            "s": "red|green|blue"
                                        }
                                    }
                                },
                                "tag": {
                                    "json_class": "Pact::ArrayLike",
                                    "contents": [
                                        {
                                            "json_class": "Pact::SomethingLike",
                                            "contents": "jumper"
                                        },
                                        {
                                            "json_class": "Pact::SomethingLike",
                                            "contents": "shirt"
                                        }
                                    ],
                                    "min": 2
                                }
                            },
                            "min": 1
                        },
                        "min": 1
                    };

                    var match = eachLike(
                                    eachLike({
                                        size: somethingLike(10),
                                        colour: term({generate: "red", matcher: "red|green|blue"}),
                                        tag: eachLike([
                                                somethingLike("jumper"),
                                                somethingLike("shirt")
                                            ], {min: 2})
                                        }, {min: 1}),
                                    {min: 1});

                    expect(match).toEqual(expected);
                });
            });
        });

        describe('When no options.min is not provided', function() {
            it('should default to a min of 1', function () {
                var expected = {
                    "json_class": "Pact::ArrayLike",
                    "contents": {a: 1},
                    "min": 1
                };

                var match = eachLike({a: 1});
                expect(match).toEqual(expected);
            });
        });

        describe('When a options.min is provided', function() {
            it('should provide the object as contents', function() {
                var expected = {
                    "json_class": "Pact::ArrayLike",
                    "contents": {a: 1},
                    "min": 3
                };

                var match = eachLike({a: 1}, {min: 3});
                expect(match).toEqual(expected);
            });
        });

    });

});
