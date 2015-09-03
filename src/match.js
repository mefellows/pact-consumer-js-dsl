Pact.Match = Pact.Match || {};

(function() {

    function isUndefined(value) {
        return typeof value === 'undefined'
    }

    function isNull(value) {
        return value === null;
    }

    function isUndefinedOrNull(value) {
        return isNull(value) || isUndefined(value);
    }

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    this.term = function(term) {
        if (!term || isUndefined(term.generate) || isUndefined(term.matcher)) {
            throw new Error('Error creating a Pact Term. Please provide an object containing \'generate\' and \'matcher\' properties');
        }

        return {
            'json_class': 'Pact::Term',
            'data': {
                'generate': term.generate,
                'matcher': {
                    'json_class': 'Regexp',
                    'o': 0,
                    's': term.matcher
                }
            }
        };
    };

    this.eachLike = function(content, options) {
        if(isUndefined(content)) {
            throw new Error('Error creating a Pact eachLike. Please provide a content argument');
        }

        return {
            "json_class": 'Pact::ArrayLike',
            "contents": content,
            "min": (!options || isUndefinedOrNull(options.min)) ? 1 : options.min
        };
    } ;

    this.somethingLike = function(value) {
        if (isUndefined(value) || isFunction(value)) {
            throw new Error('Error creating a Pact SomethingLike Match. Value cannot be a function or undefined');
        }

        return {
            'json_class': 'Pact::SomethingLike',
            'contents' : value
        };
    };

}).apply(Pact.Match);