/**
 * MIT license
 */

// Callback index.
var count = 0;

/**
 * JSONP handler
 *
 * Options:
 * - prefix {String} callback prefix (defaults to `__jp`)
 * - jsonp {String} qs jsonpeter (defaults to `callback`)
 * - timeout {Number} how long after the request until a timeout error
 *   is emitted (defaults to `15000`)
 */
var jsonp = function(url, options) {
    options = options || {};

    var prefix = options.prefix || '__jp';
    var jsonp = options.jsonp || 'callback';
    var params = options.params || {};
    var timeout = options.timeout ? options.timeout : 15000;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;
    var timer;
    var cleanup;
    var promise;
    var callback = options.callback || '';
    var noop = function() {};

    // Generate a unique id for the request.
    var id = callback ? callback : prefix + (count++);

    cleanup = function() {
        // Remove the script tag.
        if (script && script.parentNode) {
            script.parentNode.removeChild(script);
        }

        window[id] = noop;

        if (timer) {
            clearTimeout(timer);
        }
    };

    promise = new Promise(function(resolve, reject) {
        if (timeout) {
            timer = setTimeout(function() {
                cleanup();
                reject(new Error('Timeout'));
            }, timeout);
        }

        window[id] = function(data) {
            cleanup();
            resolve(data);
        };

        for(var key in params){
	        url += (~url.indexOf('?') ? '&' : '?') + key + '=' + params[key];
        }
        // Add querystring component
        url += (~url.indexOf('?') ? '&' : '?') + jsonp + '=' + encodeURIComponent(id);
        url = url.replace('?&', '?');

        // Create script.
        script = document.createElement('script');
        script.src = url;
	    script.onerror = function() {
	        cleanup();
		    reject(new Error('Network Error'));
        }
        target.parentNode.insertBefore(script, target);

    });

    return promise;
};

export default jsonp

