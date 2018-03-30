webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(102);
	__webpack_require__(351);
	__webpack_require__(361);
	__webpack_require__(369);
	__webpack_require__(362);
	__webpack_require__(372);
	__webpack_require__(366);
	__webpack_require__(375);
	__webpack_require__(405);
	__webpack_require__(531);
	__webpack_require__(530);
	module.exports = __webpack_require__(532);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.TOGGLE_AVAILABLE = exports.DECREMENT_WEEK_OFFSET = exports.INCREMENT_WEEK_OFFSET = exports.FILTER_TEXT_CHANGED = exports.FETCHED_SITE_DATA = undefined;
	exports.updateFilterText = updateFilterText;
	exports.incrementWeekOffset = incrementWeekOffset;
	exports.decrementWeekOffset = decrementWeekOffset;
	exports.toggleAvailable = toggleAvailable;
	exports.fetchSiteData = fetchSiteData;
	
	var _superagent = __webpack_require__(2);
	
	var _superagent2 = _interopRequireDefault(_superagent);
	
	var _immutable = __webpack_require__(7);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _errorActions = __webpack_require__(8);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var FETCHED_SITE_DATA = exports.FETCHED_SITE_DATA = 'FETCHED_SITE_DATA';
	var FILTER_TEXT_CHANGED = exports.FILTER_TEXT_CHANGED = 'FILTER_TEXT_CHANGED';
	var INCREMENT_WEEK_OFFSET = exports.INCREMENT_WEEK_OFFSET = 'INCREMENT_WEEK_OFFSET';
	var DECREMENT_WEEK_OFFSET = exports.DECREMENT_WEEK_OFFSET = 'DECREMENT_WEEK_OFFSET';
	var TOGGLE_AVAILABLE = exports.TOGGLE_AVAILABLE = 'TOGGLE_AVAILABLE';
	
	var fetchedSiteData = function fetchedSiteData(payload) {
	    return {
	        type: FETCHED_SITE_DATA,
	        payload: payload
	    };
	};
	
	function updateFilterText(text) {
	    return {
	        type: FILTER_TEXT_CHANGED,
	        payload: text
	    };
	}
	
	function incrementWeekOffset() {
	    return {
	        type: INCREMENT_WEEK_OFFSET
	    };
	}
	
	function decrementWeekOffset() {
	    return {
	        type: DECREMENT_WEEK_OFFSET
	    };
	}
	
	function toggleAvailable() {
	    return {
	        type: TOGGLE_AVAILABLE
	    };
	}
	
	function fetchSiteData() {
	    return function (dispatch) {
	        _superagent2.default.get('/api/availability').end(function (err, res) {
	            if (res && res.ok) {
	                /*
	                validate that we have the same number of dates here?
	                 */
	                dispatch(fetchedSiteData(_immutable2.default.fromJS(res.body)));
	            } else {
	                dispatch((0, _errorActions.fetchError)());
	            }
	        });
	    };
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */
	
	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}
	
	var Emitter = __webpack_require__(3);
	var requestBase = __webpack_require__(4);
	var isObject = __webpack_require__(5);
	
	/**
	 * Noop.
	 */
	
	function noop(){};
	
	/**
	 * Expose `request`.
	 */
	
	var request = module.exports = __webpack_require__(6).bind(null, Request);
	
	/**
	 * Determine XHR.
	 */
	
	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};
	
	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */
	
	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };
	
	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */
	
	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}
	
	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */
	
	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}
	
	/**
	 * Expose serialization method.
	 */
	
	 request.serializeObject = serialize;
	
	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */
	
	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;
	
	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }
	
	  return obj;
	}
	
	/**
	 * Expose parser.
	 */
	
	request.parseString = parseString;
	
	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */
	
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	
	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */
	
	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };
	
	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */
	
	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};
	
	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;
	
	  lines.pop(); // trailing CRLF
	
	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }
	
	  return fields;
	}
	
	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */
	
	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}
	
	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */
	
	function type(str){
	  return str.split(/ *; */).shift();
	};
	
	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */
	
	function params(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();
	
	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};
	
	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */
	
	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}
	
	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};
	
	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */
	
	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);
	
	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};
	
	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */
	
	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};
	
	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */
	
	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	
	  var type = status / 100 | 0;
	
	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;
	
	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;
	
	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};
	
	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */
	
	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;
	
	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;
	
	  return err;
	};
	
	/**
	 * Expose `Response`.
	 */
	
	request.Response = Response;
	
	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */
	
	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;
	
	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }
	
	    self.emit('response', res);
	
	    var new_err;
	    try {
	      if (res.status < 200 || res.status >= 300) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }
	
	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}
	
	/**
	 * Mixin `Emitter` and `requestBase`.
	 */
	
	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}
	
	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};
	
	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};
	
	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }
	
	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;
	
	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};
	
	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/
	
	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};
	
	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};
	
	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};
	
	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */
	
	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};
	
	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */
	
	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;
	
	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;
	
	  this.callback(err);
	};
	
	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */
	
	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};
	
	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */
	
	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};
	
	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */
	
	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;
	
	  // store callback
	  this._callback = fn || noop;
	
	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	
	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }
	
	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };
	
	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }
	
	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }
	
	  // querystring
	  this._appendQueryString();
	
	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }
	
	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;
	
	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }
	
	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }
	
	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }
	
	  // send stuff
	  this.emit('request', this);
	
	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};
	
	
	/**
	 * Expose `Request`.
	 */
	
	request.Request = Request;
	
	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};
	
	request['del'] = del;
	request['delete'] = del;
	
	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};
	
	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */
	
	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */
	
	if (true) {
	  module.exports = Emitter;
	}
	
	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */
	
	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};
	
	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */
	
	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}
	
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};
	
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }
	
	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};
	
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */
	
	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	
	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }
	
	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;
	
	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }
	
	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};
	
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */
	
	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];
	
	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */
	
	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};
	
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */
	
	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(5);
	
	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};
	
	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};
	
	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */
	
	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};
	
	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};
	
	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */
	
	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}
	
	exports.catch = function(cb) {
	  return this.then(undefined, cb);
	};
	
	/**
	 * Allow for extension
	 */
	
	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}
	
	
	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */
	
	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};
	
	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */
	
	exports.getHeader = exports.get;
	
	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};
	
	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};
	
	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	
	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }
	
	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }
	
	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  this._getFormData().append(name, val);
	  return this;
	};
	
	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};
	
	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */
	
	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};
	
	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};
	
	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */
	
	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};
	
	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);
	
	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}
	
	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */
	
	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];
	
	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }
	
	  if (!obj || this._isHost(data)) return this;
	
	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	
	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}
	
	module.exports = isObject;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */
	
	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }
	
	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }
	
	  return new RequestConstructor(method, url);
	}
	
	module.exports = request;


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.fetchError = fetchError;
	exports.clearError = clearError;
	var FETCH_ERROR = exports.FETCH_ERROR = 'FETCH_ERROR';
	var CLEAR_ERROR = exports.CLEAR_ERROR = 'CLEAR_ERROR';
	
	function fetchError() {
	    return {
	        type: FETCH_ERROR
	    };
	}
	
	function clearError() {
	    return {
	        type: CLEAR_ERROR
	    };
	}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Button = __webpack_require__(46);
	
	var _Button2 = _interopRequireDefault(_Button);
	
	var _IconChevronRight = __webpack_require__(89);
	
	var _IconChevronRight2 = _interopRequireDefault(_IconChevronRight);
	
	var _IconChevronLeft = __webpack_require__(96);
	
	var _IconChevronLeft2 = _interopRequireDefault(_IconChevronLeft);
	
	__webpack_require__(97);
	
	var _calendarPicker = __webpack_require__(102);
	
	var _calendarPicker2 = _interopRequireDefault(_calendarPicker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarControl = function (_React$Component) {
	    _inherits(CalendarControl, _React$Component);
	
	    function CalendarControl() {
	        _classCallCheck(this, CalendarControl);
	
	        return _possibleConstructorReturn(this, (CalendarControl.__proto__ || Object.getPrototypeOf(CalendarControl)).apply(this, arguments));
	    }
	
	    _createClass(CalendarControl, [{
	        key: 'render',
	        value: function render() {
	            var startIcon = _react2.default.createElement(_IconChevronLeft2.default, null);
	            var endIcon = _react2.default.createElement(_IconChevronRight2.default, null);
	            return _react2.default.createElement(
	                'div',
	                { className: 'calendar-control' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'offset' },
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'cal-control-text' },
	                        'Calendar Controls'
	                    ),
	                    _react2.default.createElement(_Button2.default, { iconStart: startIcon, onClick: this.props.decrementWeekOffset,
	                        disabled: this.props.weekOffset == 0 }),
	                    _react2.default.createElement(_Button2.default, { iconEnd: endIcon, onClick: this.props.incrementWeekOffset })
	                ),
	                _react2.default.createElement(
	                    'span',
	                    { className: 'picker' },
	                    _react2.default.createElement(_calendarPicker2.default, null)
	                )
	            );
	        }
	    }]);
	
	    return CalendarControl;
	}(_react2.default.Component);
	
	exports.default = CalendarControl;
	
	
	CalendarControl.propTypes = {
	    incrementWeekOffset: _react2.default.PropTypes.func.isRequired,
	    decrementWeekOffset: _react2.default.PropTypes.func.isRequired
	};

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Button = __webpack_require__(47);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Button).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    Button_backgroundColor: baseTheme.color_gray_20,
	    Button_backgroundColor_active: baseTheme.color_gray_30,
	    Button_backgroundColor_focus: baseTheme.color_gray_20,
	    Button_backgroundColor_hover: baseTheme.color_gray_10,
	    Button_backgroundColor_minimal_active: baseTheme.color_gray_20,
	    Button_backgroundColor_minimal_hover: baseTheme.color_gray_10,
	    Button_backgroundColor_primary: baseTheme.color_theme_60,
	    Button_backgroundColor_primary_active: baseTheme.color_theme_70,
	    Button_backgroundColor_primary_focus: baseTheme.color_theme_60,
	    Button_backgroundColor_primary_hover: baseTheme.color_theme_50,
	    Button_borderColor: baseTheme.borderColor,
	    Button_borderColor_focus: baseTheme.color_white,
	    Button_borderRadius: baseTheme.borderRadius_1,
	    Button_borderWidth: 1, // px
	    Button_boxShadow_focus: '0 0 0 1px ' + baseTheme.borderColor_focus,
	    Button_color_text: baseTheme.color_gray_100,
	    Button_color_text_minimal: baseTheme.color_text_primary,
	    Button_color_text_primary: baseTheme.color_text_onprimary,
	    Button_fontWeight: baseTheme.fontWeight_semiBold,
	    Button_paddingHorizontal: baseTheme.space_inset_sm,
	    Button_paddingIconOnly_small: (0, _styles.pxToEm)(3),
	    Button_paddingIconOnly_medium: (0, _styles.pxToEm)(7),
	    Button_paddingIconOnly_large: (0, _styles.pxToEm)(7),
	    Button_paddingIconOnly_jumbo: (0, _styles.pxToEm)(13),
	    Button_height_small: baseTheme.size_small,
	    Button_height_medium: baseTheme.size_medium,
	    Button_height_large: baseTheme.size_large,
	    Button_height_jumbo: baseTheme.size_jumbo,
	
	    ButtonContent_fontSize: baseTheme.fontSize_ui,
	    ButtonContent_fontSize_small: (0, _styles.pxToEm)(12),
	
	    ButtonIcon_margin: baseTheme.space_inset_sm
	
	  }, baseTheme);
	};
	
	function chooseColor(_ref, theme) {
	  var disabled = _ref.disabled,
	      primary = _ref.primary,
	      minimal = _ref.minimal;
	
	  if (disabled) {
	    return theme.color_text_disabled;
	  } else if (primary) {
	    return theme.Button_color_text_primary;
	  } else if (minimal) {
	    return theme.Button_color_text_minimal;
	  } else {
	    return theme.Button_color_text;
	  }
	}
	
	var styles = {
	  button: function button(props) {
	    var theme = componentTheme(props.theme);
	    var circular = props.circular,
	        disabled = props.disabled,
	        fullWidth = props.fullWidth,
	        minimal = props.minimal,
	        primary = props.primary,
	        size = props.size,
	        text = props.text,
	        variant = props.variant;
	
	
	    if (variant !== 'regular') {
	      // prettier-ignore
	      theme = _extends({}, theme, {
	        Button_backgroundColor_primary: theme['backgroundColor_' + variant],
	        Button_backgroundColor_primary_active: theme['backgroundColor_' + variant + '_active'],
	        Button_backgroundColor_primary_focus: theme['backgroundColor_' + variant + '_focus'],
	        Button_backgroundColor_primary_hover: theme['backgroundColor_' + variant + '_hover'],
	        Button_boxShadow_focus: '0 0 0 1px ' + theme['borderColor_' + variant + '_focus'],
	        Button_color_text: theme['color_text_' + variant],
	        Button_color_text_minimal: theme['color_text_' + variant],
	        Button_color_text_primary: theme['color_text_on' + variant]
	      });
	    }
	
	    var color = chooseColor(props, theme);
	    return {
	      backgroundColor: function () {
	        if (disabled && !minimal) {
	          return theme.color_gray_30;
	        } else if (primary) {
	          return theme.Button_backgroundColor_primary;
	        } else if (minimal) {
	          return 'transparent';
	        } else {
	          return theme.Button_backgroundColor;
	        }
	      }(),
	      borderColor: disabled || primary || minimal ? 'transparent' : theme.Button_borderColor,
	      borderRadius: circular ? parseFloat(theme['Button_height_' + size]) / 2 + 'em' : theme.Button_borderRadius,
	      borderStyle: 'solid',
	      borderWidth: theme.Button_borderWidth + 'px',
	      color: color,
	      cursor: disabled ? 'default' : 'pointer',
	      display: 'inline-block',
	      fontWeight: theme.Button_fontWeight,
	      height: theme['Button_height_' + size],
	      // if the user puts in a small icon in a large button
	      // we want to force the button to be round/square
	      // (really just pertinent on icon-only buttons)
	      minWidth: theme['Button_height_' + size],
	      padding: text === undefined ? theme['Button_paddingIconOnly_' + size] : '0 ' + theme.Button_paddingHorizontal,
	      textDecoration: 'none',
	      verticalAlign: 'middle',
	      width: fullWidth && '100%',
	      '&:focus': {
	        backgroundColor: function () {
	          if (primary) {
	            return theme.Button_backgroundColor_primary_focus;
	          } else if (minimal) {
	            return theme.Button_backgroundColor_minimal_focus;
	          } else {
	            return theme.Button_backgroundColor_focus;
	          }
	        }(),
	        borderColor: theme.Button_borderColor_focus,
	        boxShadow: theme.Button_boxShadow_focus,
	        color: color,
	        textDecoration: 'none'
	      },
	      '&:hover': {
	        backgroundColor: function () {
	          if (!disabled) {
	            if (primary) {
	              return theme.Button_backgroundColor_primary_hover;
	            } else if (minimal) {
	              return theme.Button_backgroundColor_minimal_hover;
	            } else {
	              return theme.Button_backgroundColor_hover;
	            }
	          }
	        }(),
	        color: color,
	        textDecoration: 'none'
	      },
	      // `:active` must be last, to follow LVHFA order:
	      // https://developer.mozilla.org/en-US/docs/Web/CSS/:active
	      '&:active': {
	        backgroundColor: function () {
	          if (!disabled) {
	            if (primary) {
	              return theme.Button_backgroundColor_primary_active;
	            } else if (minimal) {
	              return theme.Button_backgroundColor_minimal_active;
	            } else {
	              return theme.Button_backgroundColor_active;
	            }
	          }
	        }(),
	        color: color
	      },
	      '&::-moz-focus-inner': { border: 0 },
	
	      '& [role="img"]': {
	        boxSizing: 'content-box',
	        fill: disabled || primary || minimal || variant !== 'regular' ? 'currentColor' : theme.Button_backgroundColor_primary,
	        display: 'block',
	
	        '&:first-child': {
	          marginLeft: theme.direction === 'rtl' ? theme.ButtonIcon_margin : null,
	          marginRight: theme.direction === 'ltr' ? theme.ButtonIcon_margin : null
	        },
	
	        '&:last-child': {
	          marginLeft: theme.direction === 'ltr' ? theme.ButtonIcon_margin : null,
	          marginRight: theme.direction === 'rtl' ? theme.ButtonIcon_margin : null
	        },
	
	        '&:only-child': {
	          margin: 0
	        }
	      }
	    };
	  },
	  content: function content(props) {
	    var theme = componentTheme(props.theme);
	    var size = props.size;
	
	
	    var paddings = void 0;
	
	    var fontSize = size === 'small' ? theme.ButtonContent_fontSize_small : theme.ButtonContent_fontSize;
	
	    if (size === undefined || size === 'large' || size === 'jumbo') {
	      var padding = (0, _styles.getNormalizedValue)(theme.Button_paddingHorizontal, fontSize);
	      paddings = {
	        '&:first-child': {
	          paddingLeft: theme.direction === 'ltr' ? padding : null,
	          paddingRight: theme.direction === 'rtl' ? padding : null
	        },
	
	        '&:last-child': {
	          paddingLeft: theme.direction === 'rtl' ? padding : null,
	          paddingRight: theme.direction === 'ltr' ? padding : null
	        }
	      };
	    }
	
	    return _extends({
	      display: 'inline-block',
	      maxWidth: '100%',
	      overflow: 'hidden',
	      textOverflow: 'ellipsis',
	      whiteSpace: 'nowrap',
	      wordWrap: 'normal'
	    }, {
	
	      display: 'block',
	      fontSize: fontSize,
	      lineHeight: (0, _styles.getNormalizedValue)(theme['Button_height_' + size], fontSize)
	    }, paddings);
	  },
	  inner: {
	    alignItems: 'center',
	    display: 'inline-flex',
	    justifyContent: 'center',
	    maxHeight: '100%',
	    width: '100%'
	  }
	};
	
	var iconSize = {
	  small: 'medium',
	  medium: 'medium',
	  large: (0, _styles.pxToEm)(24),
	  jumbo: (0, _styles.pxToEm)(24)
	};
	
	var Content = (0, _styles.createStyledComponent)('span', styles.content);
	var Inner = (0, _styles.createStyledComponent)('span', styles.inner);
	
	function isTypeButton(type) {
	  return ['button', 'submit', 'reset'].indexOf(type) !== -1;
	}
	
	function filterProps(_ref2) {
	  var element = _ref2.element,
	      type = _ref2.type;
	
	  // When element is a component, e.g. ReactRouterLink,
	  // these are not filtered automatically by rootEl
	  var invalidComponentProps = ['primary', 'text', 'variant'];
	  var invalidLinkProps = element === 'a' && isTypeButton(type) ? ['type'] : [];
	  return Array.prototype.concat(invalidComponentProps, invalidLinkProps);
	}
	
	// Button's root node must be created outside of render, so that the entire DOM
	// element is replaced only when the element prop is changed, otherwise it is
	// updated in place
	function createRootNode(props) {
	  var _props$element = props.element,
	      element = _props$element === undefined ? Button.defaultProps.element : _props$element;
	
	
	  return (0, _styles.createStyledComponent)(element, styles.button, {
	    filterProps: filterProps(props),
	    includeStyleReset: true,
	    rootEl: element
	  });
	}
	
	/**
	 * The Button component represents a clickable button.
	 * Buttons draw attention to actions that can be performed in your app.
	 * Buttons are used to trigger any sort of event.
	 */
	
	var Button = function (_Component) {
	  _inherits(Button, _Component);
	
	  function Button() {
	    var _ref3;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Button);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = Button.__proto__ || Object.getPrototypeOf(Button)).call.apply(_ref3, [this].concat(args))), _this), _this.rootNode = createRootNode(_this.props), _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Button, [{
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps) {
	      if (this.props.element !== nextProps.element) {
	        this.rootNode = createRootNode(nextProps);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          children = _props.children,
	          iconStart = _props.iconStart,
	          iconEnd = _props.iconEnd,
	          _props$size = _props.size,
	          size = _props$size === undefined ? Button.defaultProps.size : _props$size,
	          _props$type = _props.type,
	          type = _props$type === undefined ? Button.defaultProps.type : _props$type,
	          _props$variant = _props.variant,
	          variant = _props$variant === undefined ? Button.defaultProps.variant : _props$variant,
	          restProps = _objectWithoutProperties(_props, ['children', 'iconStart', 'iconEnd', 'size', 'type', 'variant']);
	
	      var rootProps = _extends({
	        size: size,
	        text: children,
	        type: type,
	        variant: variant
	      }, restProps);
	
	      var Root = this.rootNode;
	
	      var startIcon = iconStart ? (0, _react.cloneElement)(iconStart, { size: iconSize[size], key: 'iconStart' }) : null;
	      var endIcon = iconEnd ? (0, _react.cloneElement)(iconEnd, { size: iconSize[size], key: 'iconEnd' }) : null;
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        _jsx(Inner, {}, void 0, startIcon, children && _jsx(Content, {
	          size: size
	        }, void 0, children), endIcon)
	      );
	    }
	  }]);
	
	  return Button;
	}(_react.Component);
	
	Button.propTypes = {
	  /** Rendered content of the component */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Displays a circular Button */
	  circular: __webpack_require__(82).bool,
	
	  /** Disables the Button */
	  disabled: __webpack_require__(82).bool,
	
	  /** Element to be used as the root node - e.g. `a` can be used to create a link that is styled like a Button */
	  element: typeof $FlowFixMe === 'function' ? __webpack_require__(82).instanceOf($FlowFixMe) : __webpack_require__(82).any,
	  // Should allow string | React class
	  /** Stretch Button to fill its container */
	  fullWidth: __webpack_require__(82).bool,
	
	  /** Icon that goes after the children*/
	  iconEnd: typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any,
	
	  /** Icon that goes before the children */
	  iconStart: typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any,
	
	  /** Display a minimal Button */
	  minimal: __webpack_require__(82).bool,
	
	  /** Called with the click event */
	  onClick: __webpack_require__(82).func,
	
	  /** Display a primary Button */
	  primary: __webpack_require__(82).bool,
	
	  /** Available sizes */
	  size: __webpack_require__(82).oneOf(['small', 'medium', 'large', 'jumbo']),
	
	  /** Available types */
	  type: __webpack_require__(82).string,
	
	  /** Available variants */
	  variant: __webpack_require__(82).oneOf(['regular', 'danger', 'success', 'warning'])
	};
	Button.defaultProps = {
	  element: 'button',
	  size: 'large',
	  type: 'button',
	  variant: 'regular'
	};
	exports.default = Button;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createStyledComponent = __webpack_require__(49);
	
	Object.defineProperty(exports, 'createStyledComponent', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createStyledComponent).default;
	  }
	});
	
	var _getNormalizedValue = __webpack_require__(85);
	
	Object.defineProperty(exports, 'getNormalizedValue', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_getNormalizedValue).default;
	  }
	});
	
	var _getResponsiveStyles = __webpack_require__(86);
	
	Object.defineProperty(exports, 'getResponsiveStyles', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_getResponsiveStyles).default;
	  }
	});
	
	var _pxToEm = __webpack_require__(87);
	
	Object.defineProperty(exports, 'pxToEm', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_pxToEm).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = createStyledComponent;
	
	var _glamorous = __webpack_require__(50);
	
	var _glamorous2 = _interopRequireDefault(_glamorous);
	
	var _componentStyleReset = __webpack_require__(84);
	
	var _componentStyleReset2 = _interopRequireDefault(_componentStyleReset);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function createStyledComponent(element, styles) {
	  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	  var includeStyleReset = options.includeStyleReset,
	      restOptions = _objectWithoutProperties(options, ['includeStyleReset']);
	
	  var outStyles = void 0;
	
	  if (includeStyleReset) {
	    outStyles = function outStyles(props, context) {
	      var componentStyles = typeof styles === 'function' ? styles(props, context) : styles;
	
	      return _extends({}, (0, _componentStyleReset2.default)(props), componentStyles);
	    };
	  } else {
	    outStyles = styles;
	  }
	
	  return (0, _glamorous2.default)(element, restOptions)(outStyles);
	}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
	
	var React = _interopDefault(__webpack_require__(10));
	var glamor = __webpack_require__(51);
	
	var htmlTagNames = [
	  "a",
	  "abbr",
	  "acronym",
	  "address",
	  "applet",
	  "area",
	  "article",
	  "aside",
	  "audio",
	  "b",
	  "base",
	  "basefont",
	  "bdi",
	  "bdo",
	  "bgsound",
	  "big",
	  "blink",
	  "blockquote",
	  "body",
	  "br",
	  "button",
	  "canvas",
	  "caption",
	  "center",
	  "cite",
	  "code",
	  "col",
	  "colgroup",
	  "command",
	  "content",
	  "data",
	  "datalist",
	  "dd",
	  "del",
	  "details",
	  "dfn",
	  "dialog",
	  "dir",
	  "div",
	  "dl",
	  "dt",
	  "element",
	  "em",
	  "embed",
	  "fieldset",
	  "figcaption",
	  "figure",
	  "font",
	  "footer",
	  "form",
	  "frame",
	  "frameset",
	  "h1",
	  "h2",
	  "h3",
	  "h4",
	  "h5",
	  "h6",
	  "head",
	  "header",
	  "hgroup",
	  "hr",
	  "html",
	  "i",
	  "iframe",
	  "image",
	  "img",
	  "input",
	  "ins",
	  "isindex",
	  "kbd",
	  "keygen",
	  "label",
	  "legend",
	  "li",
	  "link",
	  "listing",
	  "main",
	  "map",
	  "mark",
	  "marquee",
	  "math",
	  "menu",
	  "menuitem",
	  "meta",
	  "meter",
	  "multicol",
	  "nav",
	  "nextid",
	  "nobr",
	  "noembed",
	  "noframes",
	  "noscript",
	  "object",
	  "ol",
	  "optgroup",
	  "option",
	  "output",
	  "p",
	  "param",
	  "picture",
	  "plaintext",
	  "pre",
	  "progress",
	  "q",
	  "rb",
	  "rbc",
	  "rp",
	  "rt",
	  "rtc",
	  "ruby",
	  "s",
	  "samp",
	  "script",
	  "section",
	  "select",
	  "shadow",
	  "slot",
	  "small",
	  "source",
	  "spacer",
	  "span",
	  "strike",
	  "strong",
	  "style",
	  "sub",
	  "summary",
	  "sup",
	  "svg",
	  "table",
	  "tbody",
	  "td",
	  "template",
	  "textarea",
	  "tfoot",
	  "th",
	  "thead",
	  "time",
	  "title",
	  "tr",
	  "track",
	  "tt",
	  "u",
	  "ul",
	  "var",
	  "video",
	  "wbr",
	  "xmp"
	]
	;
	
	var svgTagNames = [
	  "a",
	  "altGlyph",
	  "altGlyphDef",
	  "altGlyphItem",
	  "animate",
	  "animateColor",
	  "animateMotion",
	  "animateTransform",
	  "animation",
	  "audio",
	  "canvas",
	  "circle",
	  "clipPath",
	  "color-profile",
	  "cursor",
	  "defs",
	  "desc",
	  "discard",
	  "ellipse",
	  "feBlend",
	  "feColorMatrix",
	  "feComponentTransfer",
	  "feComposite",
	  "feConvolveMatrix",
	  "feDiffuseLighting",
	  "feDisplacementMap",
	  "feDistantLight",
	  "feDropShadow",
	  "feFlood",
	  "feFuncA",
	  "feFuncB",
	  "feFuncG",
	  "feFuncR",
	  "feGaussianBlur",
	  "feImage",
	  "feMerge",
	  "feMergeNode",
	  "feMorphology",
	  "feOffset",
	  "fePointLight",
	  "feSpecularLighting",
	  "feSpotLight",
	  "feTile",
	  "feTurbulence",
	  "filter",
	  "font",
	  "font-face",
	  "font-face-format",
	  "font-face-name",
	  "font-face-src",
	  "font-face-uri",
	  "foreignObject",
	  "g",
	  "glyph",
	  "glyphRef",
	  "handler",
	  "hatch",
	  "hatchpath",
	  "hkern",
	  "iframe",
	  "image",
	  "line",
	  "linearGradient",
	  "listener",
	  "marker",
	  "mask",
	  "mesh",
	  "meshgradient",
	  "meshpatch",
	  "meshrow",
	  "metadata",
	  "missing-glyph",
	  "mpath",
	  "path",
	  "pattern",
	  "polygon",
	  "polyline",
	  "prefetch",
	  "radialGradient",
	  "rect",
	  "script",
	  "set",
	  "solidColor",
	  "solidcolor",
	  "stop",
	  "style",
	  "svg",
	  "switch",
	  "symbol",
	  "tbreak",
	  "text",
	  "textArea",
	  "textPath",
	  "title",
	  "tref",
	  "tspan",
	  "unknown",
	  "use",
	  "video",
	  "view",
	  "vkern"
	]
	;
	
	var domElements = htmlTagNames.concat(svgTagNames).filter(function (tag, index, array) {
	  return array.indexOf(tag) === index;
	});
	
	var CHANNEL = '__glamorous__'; /* istanbul ignore next */
	
	var isPreact = false;
	
	var _PropTypes = void 0;
	
	/* istanbul ignore next */
	if (isPreact) {
	  if (!React.PropTypes) {
	    _PropTypes = function PropTypes() {
	      return _PropTypes;
	    };
	
	    ['array', 'bool', 'func', 'number', 'object', 'string', 'symbol', 'any', 'arrayOf', 'element', 'instanceOf', 'node', 'objectOf', 'oneOf', 'oneOfType', 'shape', 'exact'].forEach(function (type) {
	      _PropTypes[type] = _PropTypes;
	    });
	  }
	  // copied from preact-compat
	  /* eslint-disable no-eq-null, eqeqeq, consistent-return */
	  if (!React.Children) {
	    var Children = {
	      map: function map(children, fn, ctx) {
	        if (children == null) {
	          return null;
	        }
	        children = Children.toArray(children);
	        if (ctx && ctx !== children) {
	          fn = fn.bind(ctx);
	        }
	        return children.map(fn);
	      },
	      forEach: function forEach(children, fn, ctx) {
	        if (children == null) {
	          return null;
	        }
	        children = Children.toArray(children);
	        if (ctx && ctx !== children) {
	          fn = fn.bind(ctx);
	        }
	        children.forEach(fn);
	      },
	      count: function count(children) {
	        return children && children.length || 0;
	      },
	      only: function only(children) {
	        children = Children.toArray(children);
	        if (children.length !== 1) {
	          throw new Error('Children.only() expects only one child.');
	        }
	        return children[0];
	      },
	      toArray: function toArray(children) {
	        if (children == null) {
	          return [];
	        }
	        return [].concat(children);
	      }
	    };
	    React.Children = Children;
	  }
	  /* eslint-enable no-eq-null, eqeqeq, consistent-return */
	} else if (parseFloat(React.version.slice(0, 4)) >= 15.5) {
	  /* istanbul ignore next */
	  try {
	    _PropTypes = __webpack_require__(82);
	    /* istanbul ignore next */
	  } catch (error) {
	    // ignore
	  }
	}
	/* istanbul ignore next */
	_PropTypes = _PropTypes || React.PropTypes;
	
	/*
	eslint
	  import/no-mutable-exports:0,
	  import/prefer-default-export:0,
	  react/no-deprecated:0
	 */
	
	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};
	
	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	
	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};
	
	var objectWithoutProperties = function (obj, keys) {
	  var target = {};
	
	  for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	    target[i] = obj[i];
	  }
	
	  return target;
	};
	
	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};
	
	function generateWarningMessage(Comp) {
	  var componentName = Comp.displayName || Comp.name || 'FunctionComponent';
	  // eslint-disable-next-line max-len
	  return 'glamorous warning: Expected component called "' + componentName + '" which uses withTheme to be within a ThemeProvider but none was found.';
	}
	
	function withTheme(ComponentToTheme) {
	  var _defaultContextTypes;
	
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	      _ref$noWarn = _ref.noWarn,
	      noWarn = _ref$noWarn === undefined ? false : _ref$noWarn,
	      _ref$createElement = _ref.createElement,
	      createElement = _ref$createElement === undefined ? true : _ref$createElement;
	
	  var ThemedComponent = function (_React$Component) {
	    inherits(ThemedComponent, _React$Component);
	
	    function ThemedComponent() {
	      var _temp, _this, _ret;
	
	      classCallCheck(this, ThemedComponent);
	
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.warned = noWarn, _this.state = { theme: {} }, _this.setTheme = function (theme) {
	        return _this.setState({ theme: theme });
	      }, _temp), possibleConstructorReturn(_this, _ret);
	    }
	
	    // eslint-disable-next-line complexity
	    ThemedComponent.prototype.componentWillMount = function componentWillMount() {
	      if (!this.context[CHANNEL]) {
	        if (process.env.NODE_ENV !== 'production' && !this.warned) {
	          this.warned = true;
	          // eslint-disable-next-line no-console
	          console.warn(generateWarningMessage(ComponentToTheme));
	        }
	      }
	      var theme = this.props.theme;
	
	      if (this.context[CHANNEL]) {
	        // if a theme is provided via props,
	        // it takes precedence over context
	        this.setTheme(theme ? theme : this.context[CHANNEL].getState());
	      } else {
	        this.setTheme(theme || {});
	      }
	    };
	
	    ThemedComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	      if (this.props.theme !== nextProps.theme) {
	        this.setTheme(nextProps.theme);
	      }
	    };
	
	    ThemedComponent.prototype.componentDidMount = function componentDidMount() {
	      if (this.context[CHANNEL] && !this.props.theme) {
	        // subscribe to future theme changes
	        this.subscriptionId = this.context[CHANNEL].subscribe(this.setTheme);
	      }
	    };
	
	    ThemedComponent.prototype.componentWillUnmount = function componentWillUnmount() {
	      // cleanup subscription
	      this.subscriptionId && this.context[CHANNEL].unsubscribe(this.subscriptionId);
	    };
	
	    ThemedComponent.prototype.render = function render() {
	      if (createElement) {
	        return React.createElement(ComponentToTheme, _extends({}, this.props, this.state));
	      } else {
	        // this allows us to effectively use the GlamorousComponent
	        // as our `render` method without going through lifecycle hooks.
	        // Also allows us to forward the context in the scenario where
	        // a user wants to add more context.
	        // eslint-disable-next-line babel/new-cap
	        return ComponentToTheme.call(this, _extends({}, this.props, this.state), this.context);
	      }
	    };
	
	    return ThemedComponent;
	  }(React.Component);
	
	  process.env.NODE_ENV !== "production" ? ThemedComponent.propTypes = {
	    theme: _PropTypes.object
	  } : void 0;
	
	
	  var defaultContextTypes = (_defaultContextTypes = {}, _defaultContextTypes[CHANNEL] = _PropTypes.object, _defaultContextTypes);
	
	  var userDefinedContextTypes = null;
	
	  // configure the contextTypes to be settable by the user,
	  // however also retaining the glamorous channel.
	  Object.defineProperty(ThemedComponent, 'contextTypes', {
	    enumerable: true,
	    configurable: true,
	    set: function set$$1(value) {
	      userDefinedContextTypes = value;
	    },
	    get: function get$$1() {
	      // if the user has provided a contextTypes definition,
	      // merge the default context types with the provided ones.
	      if (userDefinedContextTypes) {
	        return _extends({}, defaultContextTypes, userDefinedContextTypes);
	      }
	      return defaultContextTypes;
	    }
	  });
	
	  return ThemedComponent;
	}
	
	var isFunction_1 = isFunction;
	
	var toString = Object.prototype.toString;
	
	function isFunction (fn) {
	  var string = toString.call(fn);
	  return string === '[object Function]' ||
	    (typeof fn === 'function' && string !== '[object RegExp]') ||
	    (typeof window !== 'undefined' &&
	     // IE8 and below
	     (fn === window.setTimeout ||
	      fn === window.alert ||
	      fn === window.confirm ||
	      fn === window.prompt))
	}
	
	/*!
	 * isobject <https://github.com/jonschlinkert/isobject>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */
	
	var isobject = function isObject(val) {
	  return val != null && typeof val === 'object' && Array.isArray(val) === false;
	};
	
	function isObjectObject(o) {
	  return isobject(o) === true
	    && Object.prototype.toString.call(o) === '[object Object]';
	}
	
	var isPlainObject = function isPlainObject(o) {
	  var ctor,prot;
	
	  if (isObjectObject(o) === false) return false;
	
	  // If has modified constructor
	  ctor = o.constructor;
	  if (typeof ctor !== 'function') return false;
	
	  // If has modified prototype
	  prot = ctor.prototype;
	  if (isObjectObject(prot) === false) return false;
	
	  // If constructor does not have an Object-specific method
	  if (prot.hasOwnProperty('isPrototypeOf') === false) {
	    return false;
	  }
	
	  // Most likely a plain Object
	  return true;
	};
	
	function createBroadcast (initialState) {
	  var listeners = {};
	  var id = 1;
	  var _state = initialState;
	
	  function getState () {
	    return _state
	  }
	
	  function setState (state) {
	    _state = state;
	    var keys = Object.keys(listeners);
	    var i = 0;
	    var len = keys.length;
	    for (; i < len; i++) {
	      // if a listener gets unsubscribed during setState we just skip it
	      if (listeners[keys[i]]) { listeners[keys[i]](state); }
	    }
	  }
	
	  // subscribe to changes and return the subscriptionId
	  function subscribe (listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('listener must be a function.')
	    }
	    var currentId = id;
	    listeners[currentId] = listener;
	    id += 1;
	    return currentId
	  }
	
	  // remove subscription by removing the listener function
	  function unsubscribe (id) {
	    listeners[id] = undefined;
	  }
	
	  return { getState: getState, setState: setState, subscribe: subscribe, unsubscribe: unsubscribe }
	}
	
	var _ThemeProvider$childC, _ThemeProvider$contex;
	
	/**
	 * This is a component which will provide a theme to the entire tree
	 * via context and event listener
	 * (because pure components block context updates)
	 * inspired by the styled-components implementation
	 * https://github.com/styled-components/styled-components
	 * @param {Object} theme the theme object..
	 */
	
	var ThemeProvider = function (_React$Component) {
	  inherits(ThemeProvider, _React$Component);
	
	  function ThemeProvider() {
	    var _temp, _this, _ret;
	
	    classCallCheck(this, ThemeProvider);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.setOuterTheme = function (theme) {
	      _this.outerTheme = theme;
	      if (_this.broadcast !== undefined) {
	        _this.publishTheme();
	      }
	    }, _temp), possibleConstructorReturn(_this, _ret);
	  }
	
	  // create theme, by merging with outer theme, if present
	  ThemeProvider.prototype.getTheme = function getTheme(passedTheme) {
	    var theme = passedTheme || this.props.theme;
	    if (isFunction_1(theme)) {
	      var mergedTheme = theme(this.outerTheme);
	      if (!isPlainObject(mergedTheme)) {
	        throw new Error('[ThemeProvider] Please return an object from your theme function, ' + 'i.e. theme={() => ({})}!');
	      }
	      return mergedTheme;
	    }
	    return _extends({}, this.outerTheme, theme);
	  };
	
	  ThemeProvider.prototype.getChildContext = function getChildContext() {
	    var _ref;
	
	    return _ref = {}, _ref[CHANNEL] = this.broadcast, _ref;
	  };
	
	  ThemeProvider.prototype.publishTheme = function publishTheme(theme) {
	    this.broadcast.setState(this.getTheme(theme));
	  };
	
	  ThemeProvider.prototype.componentDidMount = function componentDidMount() {
	    // create a new subscription for keeping track of outer theme, if present
	    if (this.context[CHANNEL]) {
	      this.subscriptionId = this.context[CHANNEL].subscribe(this.setOuterTheme);
	    }
	  };
	
	  ThemeProvider.prototype.componentWillMount = function componentWillMount() {
	    // set broadcast state by merging outer theme with own
	    if (this.context[CHANNEL]) {
	      this.setOuterTheme(this.context[CHANNEL].getState());
	    }
	    this.broadcast = createBroadcast(this.getTheme(this.props.theme));
	  };
	
	  ThemeProvider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    if (this.props.theme !== nextProps.theme) {
	      this.publishTheme(nextProps.theme);
	    }
	  };
	
	  ThemeProvider.prototype.componentWillUnmount = function componentWillUnmount() {
	    this.subscriptionId && this.context[CHANNEL].unsubscribe(this.subscriptionId);
	  };
	
	  ThemeProvider.prototype.render = function render() {
	    return this.props.children ? React.Children.only(this.props.children) : null;
	  };
	
	  return ThemeProvider;
	}(React.Component);
	
	ThemeProvider.childContextTypes = (_ThemeProvider$childC = {}, _ThemeProvider$childC[CHANNEL] = _PropTypes.object.isRequired, _ThemeProvider$childC);
	
	ThemeProvider.contextTypes = (_ThemeProvider$contex = {}, _ThemeProvider$contex[CHANNEL] = _PropTypes.object, _ThemeProvider$contex);
	
	process.env.NODE_ENV !== "production" ? ThemeProvider.propTypes = {
	  theme: _PropTypes.oneOfType([_PropTypes.object, _PropTypes.func]).isRequired,
	  children: _PropTypes.node
	} : void 0;
	
	/**
	 * This function takes a className string and gets all the
	 * associated glamor styles. It's used to merge glamor styles
	 * from a className to make sure that specificity is not
	 * a problem when passing a className to a component.
	 * @param {String} [className=''] the className string
	 * @return {Object} { glamorStyles, glamorlessClassName }
	 *   - glamorStyles is an array of all the glamor styles objects
	 *   - glamorlessClassName is the rest of the className string
	 *     without the glamor classNames
	 */
	function extractGlamorStyles(className) {
	  var glamorlessClassName = [];
	  var glamorStyles = [];
	  className.toString().split(' ').forEach(function (name) {
	    if (name.indexOf('css-') === 0) {
	      var style = buildGlamorSrcFromClassName(name);
	      glamorStyles.push(style);
	    } else {
	      glamorlessClassName.push(name);
	    }
	  });
	
	  return { glamorlessClassName: glamorlessClassName, glamorStyles: glamorStyles };
	}
	
	/** Glamor's css function returns an object with the shape
	 *
	 * {
	 *   [`data-css-${hash}`]: '',
	 *   toString() { return `css-${hash}` }
	 * }
	 *
	 * Whenever glamor's build function encounters an object with
	 * this shape it just pulls the resulting styles from the cache.
	 *
	 * note: the toString method is not needed to qualify the shape
	 **/
	function buildGlamorSrcFromClassName(className) {
	  var _ref;
	
	  return _ref = {}, _ref['data-' + className] = '', _ref;
	}
	
	function getGlamorClassName(_ref2) {
	  var styles = _ref2.styles,
	      props = _ref2.props,
	      cssOverrides = _ref2.cssOverrides,
	      cssProp = _ref2.cssProp,
	      context = _ref2.context,
	      displayName = _ref2.displayName;
	
	  var _handleStyles = handleStyles([].concat(styles, [props.className, cssOverrides, cssProp]), props, context),
	      mappedArgs = _handleStyles.mappedArgs,
	      nonGlamorClassNames = _handleStyles.nonGlamorClassNames;
	  // eslint-disable-next-line max-len
	
	
	  var isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
	  var devRules = isDev ? { label: displayName } : null;
	  var glamorClassName = glamor.css.apply(undefined, [devRules].concat(mappedArgs)).toString();
	  var extras = nonGlamorClassNames.join(' ').trim();
	  return (glamorClassName + ' ' + extras).trim();
	}
	
	// this next function is on a "hot" code-path
	// so it's pretty complex to make sure it's fast.
	// eslint-disable-next-line complexity
	function handleStyles(styles, props, context) {
	  var current = void 0;
	  var mappedArgs = [];
	  var nonGlamorClassNames = [];
	  for (var i = 0; i < styles.length; i++) {
	    current = styles[i];
	    while (typeof current === 'function') {
	      current = current(props, context);
	    }
	    if (typeof current === 'string') {
	      var _extractGlamorStyles = extractGlamorStyles(current),
	          glamorStyles = _extractGlamorStyles.glamorStyles,
	          glamorlessClassName = _extractGlamorStyles.glamorlessClassName;
	
	      mappedArgs.push.apply(mappedArgs, glamorStyles);
	      nonGlamorClassNames.push.apply(nonGlamorClassNames, glamorlessClassName);
	    } else if (Array.isArray(current)) {
	      var recursed = handleStyles(current, props, context);
	      mappedArgs.push.apply(mappedArgs, recursed.mappedArgs);
	      nonGlamorClassNames.push.apply(nonGlamorClassNames, recursed.nonGlamorClassNames);
	    } else {
	      mappedArgs.push(current);
	    }
	  }
	  return { mappedArgs: mappedArgs, nonGlamorClassNames: nonGlamorClassNames };
	}
	
	/*
	 * This is a relatively small abstraction that's ripe for open sourcing.
	 * Documentation is in the README.md
	 */
	
	function createGlamorous(splitProps) {
	  return glamorous;
	
	  /**
	   * This is the main export and the function that people
	   * interact with most directly.
	   *
	   * It accepts a component which can be a string or
	   * a React Component and returns
	   * a "glamorousComponentFactory"
	   * @param {String|ReactComponent} comp the component to render
	   * @param {Object} options helpful info for the GlamorousComponents
	   * @return {Function} the glamorousComponentFactory
	   */
	  function glamorous(comp) {
	    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    var rootEl = config.rootEl,
	        displayName = config.displayName,
	        shouldClassNameUpdate = config.shouldClassNameUpdate,
	        _config$filterProps = config.filterProps,
	        filterProps = _config$filterProps === undefined ? [] : _config$filterProps,
	        _config$forwardProps = config.forwardProps,
	        forwardProps = _config$forwardProps === undefined ? [] : _config$forwardProps,
	        _config$propsAreCssOv = config.propsAreCssOverrides,
	        propsAreCssOverrides = _config$propsAreCssOv === undefined ? comp.propsAreCssOverrides : _config$propsAreCssOv,
	        basePropsToApply = config.withProps;
	
	    Object.assign(glamorousComponentFactory, { withConfig: withConfig });
	    return glamorousComponentFactory;
	
	    function withConfig(newConfig) {
	      return glamorous(comp, _extends({}, config, newConfig));
	    }
	
	    /**
	     * This returns a React Component that renders the comp (closure)
	     * with a className based on the given glamor styles object(s)
	     * @param {...Object|Function} styles the styles to create with glamor.
	     *   If any of these are functions, they are invoked with the component
	     *   props and the return value is used.
	     * @return {ReactComponent} the ReactComponent function
	     */
	    function glamorousComponentFactory() {
	      for (var _len = arguments.length, styles = Array(_len), _key = 0; _key < _len; _key++) {
	        styles[_key] = arguments[_key];
	      }
	
	      /**
	       * This is a component which will render the comp (closure)
	       * with the glamorous styles (closure). Forwards any valid
	       * props to the underlying component.
	       */
	      var GlamorousComponent = withTheme(function (props, context) {
	        props = getPropsToApply(GlamorousComponent.propsToApply, {}, props, context);
	        var updateClassName = shouldUpdate(props, context, this.previous);
	
	        if (shouldClassNameUpdate) {
	          this.previous = { props: props, context: context };
	        }
	
	        var _splitProps = splitProps(props, GlamorousComponent),
	            toForward = _splitProps.toForward,
	            cssOverrides = _splitProps.cssOverrides,
	            cssProp = _splitProps.cssProp;
	
	        // create className to apply
	
	
	        this.className = updateClassName ? getGlamorClassName({
	          styles: GlamorousComponent.styles,
	          props: props,
	          cssOverrides: cssOverrides,
	          cssProp: cssProp,
	          context: context,
	          displayName: GlamorousComponent.displayName
	        }) : this.className;
	
	        return React.createElement(GlamorousComponent.comp, _extends({
	          // if innerRef is forwarded we don't want to apply it here
	          ref: 'innerRef' in toForward ? undefined : props.innerRef
	        }, toForward, {
	          className: this.className
	        }));
	      }, { noWarn: true, createElement: false });
	
	      process.env.NODE_ENV !== "production" ? GlamorousComponent.propTypes = {
	        // className accepts an object due to glamor's css function
	        // returning an object with a toString method that gives the className
	        className: _PropTypes.oneOfType([_PropTypes.string, _PropTypes.object]),
	        cssOverrides: _PropTypes.object,
	        innerRef: _PropTypes.func,
	        glam: _PropTypes.object
	      } : void 0;
	
	      function shouldUpdate(props, context, previous) {
	        // exiting early so components which do not use this
	        // optimization are not penalized by hanging onto
	        // references to previous props and context
	        if (!shouldClassNameUpdate) {
	          return true;
	        }
	        var update = true;
	        if (previous) {
	          if (!shouldClassNameUpdate(previous.props, props, previous.context, context)) {
	            update = false;
	          }
	        }
	
	        return update;
	      }
	
	      Object.assign(GlamorousComponent, getGlamorousComponentMetadata({
	        comp: comp,
	        styles: styles,
	        rootEl: rootEl,
	        filterProps: filterProps,
	        forwardProps: forwardProps,
	        displayName: displayName,
	        propsToApply: basePropsToApply
	      }), {
	        isGlamorousComponent: true,
	        propsAreCssOverrides: propsAreCssOverrides,
	        withComponent: function (newComp) {
	          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	          var fwp = GlamorousComponent.forwardProps,
	              flp = GlamorousComponent.filterProps,
	              componentProperties = objectWithoutProperties(GlamorousComponent, ['forwardProps', 'filterProps']);
	
	          return glamorous(_extends({}, componentProperties, {
	            comp: newComp,
	            rootEl: getRootEl(newComp)
	          }), _extends({
	            // allows the forwardProps and filterProps to be overridden
	            forwardProps: fwp,
	            filterProps: flp
	          }, options))();
	        },
	        withProps: function () {
	          for (var _len2 = arguments.length, propsToApply = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            propsToApply[_key2] = arguments[_key2];
	          }
	
	          return glamorous(GlamorousComponent, { withProps: propsToApply })();
	        },
	        withConfig: withConfig
	      });
	      return GlamorousComponent;
	    }
	  }
	
	  function getGlamorousComponentMetadata(_ref) {
	    var comp = _ref.comp,
	        styles = _ref.styles,
	        rootEl = _ref.rootEl,
	        filterProps = _ref.filterProps,
	        forwardProps = _ref.forwardProps,
	        displayName = _ref.displayName,
	        basePropsToApply = _ref.propsToApply;
	
	    var componentsComp = comp.comp ? comp.comp : comp;
	    var propsToApply = comp.propsToApply ? [].concat(comp.propsToApply, arrayify(basePropsToApply)) : arrayify(basePropsToApply);
	    return {
	      // join styles together (for anyone doing: glamorous(glamorous.a({}), {}))
	      styles: when(comp.styles, styles),
	      // keep track of the ultimate rootEl to render (we never
	      // actually render anything but
	      // the base component, even when people wrap a glamorous
	      // component in glamorous
	      comp: componentsComp,
	      rootEl: rootEl || getRootEl(comp),
	      // join forwardProps and filterProps
	      // (for anyone doing: glamorous(glamorous.a({}), {}))
	      forwardProps: when(comp.forwardProps, forwardProps),
	      filterProps: when(comp.filterProps, filterProps),
	      // set the displayName to something that's slightly more
	      // helpful than `GlamorousComponent` :)
	      displayName: displayName || 'glamorous(' + getDisplayName(comp) + ')',
	      // these are props that should be applied to the component at render time
	      propsToApply: propsToApply
	    };
	  }
	}
	
	/**
	 * reduces the propsToApply given to a single props object
	 * @param {Array} propsToApply an array of propsToApply objects:
	 *   - object
	 *   - array of propsToApply items
	 *   - function that accepts the accumulated props and the context
	 * @param {Object} accumulator an object to apply props onto
	 * @param {Object} props the props that should ultimately take precedence
	 * @param {*} context the context object
	 * @return {Object} the reduced props
	 */
	function getPropsToApply(propsToApply, accumulator, props, context) {
	  // using forEach rather than reduce here because the reduce solution
	  // effectively did the same thing because we manipulate the `accumulator`
	  propsToApply.forEach(function (propsToApplyItem) {
	    if (typeof propsToApplyItem === 'function') {
	      return Object.assign(accumulator, propsToApplyItem(Object.assign({}, accumulator, props), context));
	    } else if (Array.isArray(propsToApplyItem)) {
	      return Object.assign(accumulator, getPropsToApply(propsToApplyItem, accumulator, props, context));
	    }
	    return Object.assign(accumulator, propsToApplyItem);
	  });
	  // props wins
	  return Object.assign(accumulator, props);
	}
	
	function arrayify() {
	  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	
	  return Array.isArray(x) ? x : [x];
	}
	
	function when(comp, prop) {
	  return comp ? comp.concat(prop) : prop;
	}
	
	function getRootEl(comp) {
	  return comp.rootEl ? comp.rootEl : comp.comp || comp;
	}
	
	function getDisplayName(comp) {
	  return typeof comp === 'string' ? comp : comp.displayName || comp.name || 'unknown';
	}
	
	//
	// Main
	//
	
	function memoize (fn, options) {
	  var cache = options && options.cache
	    ? options.cache
	    : cacheDefault;
	
	  var serializer = options && options.serializer
	    ? options.serializer
	    : serializerDefault;
	
	  var strategy = options && options.strategy
	    ? options.strategy
	    : strategyDefault;
	
	  return strategy(fn, {
	    cache: cache,
	    serializer: serializer
	  })
	}
	
	//
	// Strategy
	//
	
	function isPrimitive (value) {
	  return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
	}
	
	function monadic (fn, cache, serializer, arg) {
	  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
	
	  var computedValue = cache.get(cacheKey);
	  if (typeof computedValue === 'undefined') {
	    computedValue = fn.call(this, arg);
	    cache.set(cacheKey, computedValue);
	  }
	
	  return computedValue
	}
	
	function variadic (fn, cache, serializer) {
	  var args = Array.prototype.slice.call(arguments, 3);
	  var cacheKey = serializer(args);
	
	  var computedValue = cache.get(cacheKey);
	  if (typeof computedValue === 'undefined') {
	    computedValue = fn.apply(this, args);
	    cache.set(cacheKey, computedValue);
	  }
	
	  return computedValue
	}
	
	function assemble (fn, context, strategy, cache, serialize) {
	  return strategy.bind(
	    context,
	    fn,
	    cache,
	    serialize
	  )
	}
	
	function strategyDefault (fn, options) {
	  var strategy = fn.length === 1 ? monadic : variadic;
	
	  return assemble(
	    fn,
	    this,
	    strategy,
	    options.cache.create(),
	    options.serializer
	  )
	}
	
	function strategyVariadic (fn, options) {
	  var strategy = variadic;
	
	  return assemble(
	    fn,
	    this,
	    strategy,
	    options.cache.create(),
	    options.serializer
	  )
	}
	
	function strategyMonadic (fn, options) {
	  var strategy = monadic;
	
	  return assemble(
	    fn,
	    this,
	    strategy,
	    options.cache.create(),
	    options.serializer
	  )
	}
	
	//
	// Serializer
	//
	
	function serializerDefault () {
	  return JSON.stringify(arguments)
	}
	
	//
	// Cache
	//
	
	function ObjectWithoutPrototypeCache () {
	  this.cache = Object.create(null);
	}
	
	ObjectWithoutPrototypeCache.prototype.has = function (key) {
	  return (key in this.cache)
	};
	
	ObjectWithoutPrototypeCache.prototype.get = function (key) {
	  return this.cache[key]
	};
	
	ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
	  this.cache[key] = value;
	};
	
	var cacheDefault = {
	  create: function create () {
	    return new ObjectWithoutPrototypeCache()
	  }
	};
	
	//
	// API
	//
	
	var src = memoize;
	var strategies = {
	  variadic: strategyVariadic,
	  monadic: strategyMonadic
	};
	src.strategies = strategies;
	
	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}
	
	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}
	
	var a = ["coords","download","href","name","rel","shape","target","type"];
	var abbr = ["title"];
	var applet = ["alt","height","name","width"];
	var area = ["alt","coords","download","href","rel","shape","target","type"];
	var audio = ["controls","loop","muted","preload","src"];
	var base = ["href","target"];
	var basefont = ["size"];
	var bdo = ["dir"];
	var blockquote = ["cite"];
	var button = ["disabled","form","name","type","value"];
	var canvas = ["height","width"];
	var col = ["span","width"];
	var colgroup = ["span","width"];
	var data = ["value"];
	var del = ["cite"];
	var details = ["open"];
	var dfn = ["title"];
	var dialog = ["open"];
	var embed = ["height","src","type","width"];
	var fieldset = ["disabled","form","name"];
	var font = ["size"];
	var form = ["accept","action","method","name","target"];
	var frame = ["name","scrolling","src"];
	var frameset = ["cols","rows"];
	var head = ["profile"];
	var hr = ["size","width"];
	var html = ["manifest"];
	var iframe = ["height","name","sandbox","scrolling","src","width"];
	var img = ["alt","height","name","sizes","src","width"];
	var input = ["accept","alt","autoCapitalize","autoCorrect","autoSave","checked","defaultChecked","defaultValue","disabled","form","height","list","max","min","multiple","name","onChange","pattern","placeholder","required","results","size","src","step","title","type","value","width"];
	var ins = ["cite"];
	var keygen = ["challenge","disabled","form","name"];
	var label = ["form"];
	var li = ["type","value"];
	var link = ["color","href","integrity","media","nonce","rel","scope","sizes","target","title","type"];
	var map = ["name"];
	var meta = ["content","name"];
	var meter = ["high","low","max","min","optimum","value"];
	var object = ["data","form","height","name","type","width"];
	var ol = ["reversed","start","type"];
	var optgroup = ["disabled","label"];
	var option = ["disabled","label","selected","value"];
	var output = ["form","name"];
	var param = ["name","type","value"];
	var pre = ["width"];
	var progress = ["max","value"];
	var q = ["cite"];
	var script = ["async","defer","integrity","nonce","src","type"];
	var select = ["defaultValue","disabled","form","multiple","name","onChange","required","size","value"];
	var slot = ["name"];
	var source = ["media","sizes","src","type"];
	var style = ["media","nonce","title","type"];
	var table = ["summary","width"];
	var td = ["headers","height","scope","width"];
	var textarea = ["autoCapitalize","autoCorrect","cols","defaultValue","disabled","form","name","onChange","placeholder","required","rows","value","wrap"];
	var th = ["headers","height","scope","width"];
	var track = ["default","kind","label","src"];
	var ul = ["type"];
	var video = ["controls","height","loop","muted","poster","preload","src","width"];
	var svg = ["accentHeight","accumulate","additive","alignmentBaseline","allowReorder","alphabetic","amplitude","arabicForm","ascent","attributeName","attributeType","autoReverse","azimuth","baseFrequency","baseProfile","baselineShift","bbox","begin","bias","by","calcMode","capHeight","clip","clipPath","clipPathUnits","clipRule","color","colorInterpolation","colorInterpolationFilters","colorProfile","colorRendering","contentScriptType","contentStyleType","cursor","cx","cy","d","decelerate","descent","diffuseConstant","direction","display","divisor","dominantBaseline","dur","dx","dy","edgeMode","elevation","enableBackground","end","exponent","externalResourcesRequired","fill","fillOpacity","fillRule","filter","filterRes","filterUnits","floodColor","floodOpacity","focusable","fontFamily","fontSize","fontSizeAdjust","fontStretch","fontStyle","fontVariant","fontWeight","format","from","fx","fy","g1","g2","glyphName","glyphOrientationHorizontal","glyphOrientationVertical","glyphRef","gradientTransform","gradientUnits","hanging","height","horizAdvX","horizOriginX","ideographic","imageRendering","in","in2","intercept","k","k1","k2","k3","k4","kernelMatrix","kernelUnitLength","kerning","keyPoints","keySplines","keyTimes","lengthAdjust","letterSpacing","lightingColor","limitingConeAngle","local","markerEnd","markerHeight","markerMid","markerStart","markerUnits","markerWidth","mask","maskContentUnits","maskUnits","mathematical","mode","numOctaves","offset","opacity","operator","order","orient","orientation","origin","overflow","overlinePosition","overlineThickness","paintOrder","panose1","pathLength","patternContentUnits","patternTransform","patternUnits","pointerEvents","points","pointsAtX","pointsAtY","pointsAtZ","preserveAlpha","preserveAspectRatio","primitiveUnits","r","radius","refX","refY","renderingIntent","repeatCount","repeatDur","requiredExtensions","requiredFeatures","restart","result","rotate","rx","ry","scale","seed","shapeRendering","slope","spacing","specularConstant","specularExponent","speed","spreadMethod","startOffset","stdDeviation","stemh","stemv","stitchTiles","stopColor","stopOpacity","strikethroughPosition","strikethroughThickness","string","stroke","strokeDasharray","strokeDashoffset","strokeLinecap","strokeLinejoin","strokeMiterlimit","strokeOpacity","strokeWidth","surfaceScale","systemLanguage","tableValues","targetX","targetY","textAnchor","textDecoration","textLength","textRendering","to","transform","u1","u2","underlinePosition","underlineThickness","unicode","unicodeBidi","unicodeRange","unitsPerEm","vAlphabetic","vHanging","vIdeographic","vMathematical","values","vectorEffect","version","vertAdvY","vertOriginX","vertOriginY","viewBox","viewTarget","visibility","width","widths","wordSpacing","writingMode","x","x1","x2","xChannelSelector","xHeight","xlinkActuate","xlinkArcrole","xlinkHref","xlinkRole","xlinkShow","xlinkTitle","xlinkType","xmlBase","xmlLang","xmlSpace","xmlns","xmlnsXlink","y","y1","y2","yChannelSelector","z","zoomAndPan"];
	var elements = {"html":["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","math","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","slot","small","source","span","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"],"svg":["a","altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","color-profile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","script","set","stop","style","svg","switch","symbol","text","textPath","title","tref","tspan","use","view","vkern"]};
	var reactHtmlAttributes = {
		a: a,
		abbr: abbr,
		applet: applet,
		area: area,
		audio: audio,
		base: base,
		basefont: basefont,
		bdo: bdo,
		blockquote: blockquote,
		button: button,
		canvas: canvas,
		col: col,
		colgroup: colgroup,
		data: data,
		del: del,
		details: details,
		dfn: dfn,
		dialog: dialog,
		embed: embed,
		fieldset: fieldset,
		font: font,
		form: form,
		frame: frame,
		frameset: frameset,
		head: head,
		hr: hr,
		html: html,
		iframe: iframe,
		img: img,
		input: input,
		ins: ins,
		keygen: keygen,
		label: label,
		li: li,
		link: link,
		map: map,
		meta: meta,
		meter: meter,
		object: object,
		ol: ol,
		optgroup: optgroup,
		option: option,
		output: output,
		param: param,
		pre: pre,
		progress: progress,
		q: q,
		script: script,
		select: select,
		slot: slot,
		source: source,
		style: style,
		table: table,
		td: td,
		textarea: textarea,
		th: th,
		track: track,
		ul: ul,
		video: video,
		svg: svg,
		elements: elements,
		"*": ["about","acceptCharset","accessKey","allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","capture","cellPadding","cellSpacing","charSet","classID","className","colSpan","contentEditable","contextMenu","crossOrigin","dangerouslySetInnerHTML","datatype","dateTime","dir","draggable","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hidden","hrefLang","htmlFor","httpEquiv","icon","id","inlist","inputMode","is","itemID","itemProp","itemRef","itemScope","itemType","keyParams","keyType","lang","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","prefix","property","radioGroup","readOnly","resource","role","rowSpan","scoped","seamless","security","spellCheck","srcDoc","srcLang","srcSet","style","suppressContentEditableWarning","tabIndex","title","typeof","unselectable","useMap","vocab","wmode"]
	};
	
	var reactHtmlAttributes$1 = Object.freeze({
		a: a,
		abbr: abbr,
		applet: applet,
		area: area,
		audio: audio,
		base: base,
		basefont: basefont,
		bdo: bdo,
		blockquote: blockquote,
		button: button,
		canvas: canvas,
		col: col,
		colgroup: colgroup,
		data: data,
		del: del,
		details: details,
		dfn: dfn,
		dialog: dialog,
		embed: embed,
		fieldset: fieldset,
		font: font,
		form: form,
		frame: frame,
		frameset: frameset,
		head: head,
		hr: hr,
		html: html,
		iframe: iframe,
		img: img,
		input: input,
		ins: ins,
		keygen: keygen,
		label: label,
		li: li,
		link: link,
		map: map,
		meta: meta,
		meter: meter,
		object: object,
		ol: ol,
		optgroup: optgroup,
		option: option,
		output: output,
		param: param,
		pre: pre,
		progress: progress,
		q: q,
		script: script,
		select: select,
		slot: slot,
		source: source,
		style: style,
		table: table,
		td: td,
		textarea: textarea,
		th: th,
		track: track,
		ul: ul,
		video: video,
		svg: svg,
		elements: elements,
		default: reactHtmlAttributes
	});
	
	var reactHtmlAttributes$2 = ( reactHtmlAttributes$1 && reactHtmlAttributes ) || reactHtmlAttributes$1;
	
	var dist = createCommonjsModule(function (module, exports) {
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	
	exports.default = reactHtmlAttributes$2;
	
	module.exports = reactHtmlAttributes$2; // for CommonJS compatibility
	});
	
	var reactHTMLAttributes = unwrapExports(dist);
	
	/*
	 * This is used to check if a property name is one of the React-specific
	 * properties and determine if that property should be forwarded
	 * to the React component
	 */
	
	/* Logic copied from ReactDOMUnknownPropertyHook */
	var reactProps = ['children', 'dangerouslySetInnerHTML', 'key', 'ref', 'autoFocus', 'defaultValue', 'valueLink', 'defaultChecked', 'checkedLink', 'innerHTML', 'suppressContentEditableWarning', 'onFocusIn', 'onFocusOut', 'className',
	
	/* List copied from https://facebook.github.io/react/docs/events.html */
	'onCopy', 'onCut', 'onPaste', 'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onInvalid', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onSelect', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel', 'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'onWaiting', 'onLoad', 'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration', 'onTransitionEnd', 'onCopyCapture', 'onCutCapture', 'onPasteCapture', 'onCompositionEndCapture', 'onCompositionStartCapture', 'onCompositionUpdateCapture', 'onKeyDownCapture', 'onKeyPressCapture', 'onKeyUpCapture', 'onFocusCapture', 'onBlurCapture', 'onChangeCapture', 'onInputCapture', 'onSubmitCapture', 'onClickCapture', 'onContextMenuCapture', 'onDoubleClickCapture', 'onDragCapture', 'onDragEndCapture', 'onDragEnterCapture', 'onDragExitCapture', 'onDragLeaveCapture', 'onDragOverCapture', 'onDragStartCapture', 'onDropCapture', 'onMouseDownCapture', 'onMouseEnterCapture', 'onMouseLeaveCapture', 'onMouseMoveCapture', 'onMouseOutCapture', 'onMouseOverCapture', 'onMouseUpCapture', 'onSelectCapture', 'onTouchCancelCapture', 'onTouchEndCapture', 'onTouchMoveCapture', 'onTouchStartCapture', 'onScrollCapture', 'onWheelCapture', 'onAbortCapture', 'onCanPlayCapture', 'onCanPlayThroughCapture', 'onDurationChangeCapture', 'onEmptiedCapture', 'onEncryptedCapture', 'onEndedCapture', 'onErrorCapture', 'onLoadedDataCapture', 'onLoadedMetadataCapture', 'onLoadStartCapture', 'onPauseCapture', 'onPlayCapture', 'onPlayingCapture', 'onProgressCapture', 'onRateChangeCapture', 'onSeekedCapture', 'onSeekingCapture', 'onStalledCapture', 'onSuspendCapture', 'onTimeUpdateCapture', 'onVolumeChangeCapture', 'onWaitingCapture', 'onLoadCapture', 'onAnimationStartCapture', 'onAnimationEndCapture', 'onAnimationIterationCapture', 'onTransitionEndCapture'];
	
	if (isPreact) {
	  reactProps.push('autocomplete', 'autofocus', 'class', 'for', 'onDblClick', 'onSearch', 'slot', 'srcset');
	}
	
	/* eslint max-lines:0, func-style:0 */
	
	var globalReactHtmlProps = reactHTMLAttributes['*'];
	var supportedSVGTagNames = reactHTMLAttributes.elements.svg;
	var supportedHtmlTagNames = reactHTMLAttributes.elements.html;
	
	// these are valid attributes that have the
	// same name as CSS properties, and is used
	// for css overrides API
	var cssProps = ['color', 'height', 'width'];
	
	/* From DOMProperty */
	var ATTRIBUTE_NAME_START_CHAR =
	// eslint-disable-next-line max-len
	':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
	// eslint-disable-next-line max-len
	var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
	var isCustomAttribute = RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$'));
	
	var isSvgTag = function (tagName) {
	  return (
	    // in our context, we only say that SVG tags are SVG
	    // if they are not also HTML.
	    // See https://github.com/paypal/glamorous/issues/245
	    // the svg tag will always be treated as svg for
	    // er... obvious reasons
	    tagName === 'svg' || supportedHtmlTagNames.indexOf(tagName) === -1 && supportedSVGTagNames.indexOf(tagName) !== -1
	  );
	};
	var isHtmlProp = function (name, tagName) {
	  var elementAttributes = void 0;
	
	  if (isSvgTag(tagName)) {
	    // all SVG attributes supported by React are grouped under 'svg'
	    elementAttributes = reactHTMLAttributes.svg;
	  } else {
	    elementAttributes = reactHTMLAttributes[tagName] || [];
	  }
	
	  return globalReactHtmlProps.indexOf(name) !== -1 || elementAttributes.indexOf(name) !== -1;
	};
	var isCssProp = function (name) {
	  return cssProps.indexOf(name) !== -1;
	};
	var isReactProp = function (name) {
	  return reactProps.indexOf(name) !== -1;
	};
	
	// eslint-disable-next-line complexity
	var shouldForwardProperty = function (tagName, name) {
	  return typeof tagName !== 'string' || (isHtmlProp(name, tagName) || isReactProp(name) || isCustomAttribute(name.toLowerCase())) && (!isCssProp(name) || isSvgTag(tagName));
	};
	
	var shouldForwardProperty$1 = src(shouldForwardProperty);
	
	// eslint-disable-next-line complexity
	function splitProps(_ref, _ref2) {
	  var propsAreCssOverrides = _ref2.propsAreCssOverrides,
	      rootEl = _ref2.rootEl,
	      filterProps = _ref2.filterProps,
	      forwardProps = _ref2.forwardProps;
	  var cssProp = _ref.css,
	      innerRef = _ref.innerRef,
	      theme = _ref.theme,
	      className = _ref.className,
	      glam = _ref.glam,
	      rest = objectWithoutProperties(_ref, ['css', 'innerRef', 'theme', 'className', 'glam']);
	
	  // forward innerRef if user wishes to do so
	  if (innerRef !== undefined && forwardProps.indexOf('innerRef') !== -1) {
	    rest.innerRef = innerRef;
	  }
	  var returnValue = { toForward: {}, cssProp: cssProp, cssOverrides: {} };
	  if (!propsAreCssOverrides) {
	    if (typeof rootEl !== 'string' && filterProps.length === 0) {
	      // if it's not a string and filterProps is empty,
	      // then we can forward everything (because it's a component)
	      returnValue.toForward = rest;
	      return returnValue;
	    }
	  }
	  return Object.keys(rest).reduce(function (split, propName) {
	    if (filterProps.indexOf(propName) !== -1) {
	      return split;
	    } else if (forwardProps.indexOf(propName) !== -1 || shouldForwardProperty$1(rootEl, propName)) {
	      split.toForward[propName] = rest[propName];
	    } else if (propsAreCssOverrides) {
	      split.cssOverrides[propName] = rest[propName];
	    }
	    return split;
	  }, returnValue);
	}
	
	var glamorous = createGlamorous(splitProps);
	
	/*
	 * This creates a glamorousComponentFactory for every DOM element so you can
	 * simply do:
	 * const GreenButton = glamorous.button({
	 *   backgroundColor: 'green',
	 *   padding: 20,
	 * })
	 * <GreenButton>Click Me!</GreenButton>
	 */
	Object.assign(glamorous, domElements.reduce(function (getters, tag) {
	  // TODO: next breaking change, let's make
	  // the `displayName` be: `glamorous.${tag}`
	  getters[tag] = glamorous(tag);
	  return getters;
	}, {}));
	
	/*
	 * This creates a glamorous component for each DOM element so you can
	 * simply do:
	 * <glamorous.Div
	 *   color="green"
	 *   marginLeft={20}
	 * >
	 *   I'm green!
	 * </glamorous.Div>
	 */
	Object.assign(glamorous, domElements.reduce(function (comps, tag) {
	  var capitalTag = capitalize(tag);
	  comps[capitalTag] = glamorous[tag]();
	  comps[capitalTag].displayName = 'glamorous.' + capitalTag;
	  comps[capitalTag].propsAreCssOverrides = true;
	  return comps;
	}, {}));
	
	function capitalize(s) {
	  return s.slice(0, 1).toUpperCase() + s.slice(1);
	}
	
	/*
	 * Fix importing in typescript after rollup compilation
	 * https://github.com/rollup/rollup/issues/1156
	 * https://github.com/Microsoft/TypeScript/issues/13017#issuecomment-268657860
	 */
	glamorous.default = glamorous;
	
	
	var glamorousStar = Object.freeze({
		default: glamorous,
		ThemeProvider: ThemeProvider,
		withTheme: withTheme
	});
	
	/* istanbul ignore next */
	
	var glamorous$1 = glamorous;
	
	Object.assign(glamorous$1, Object.keys(glamorousStar).reduce(function (e, prop) {
	  if (prop !== 'default') {
	    // eslint-disable-next-line import/namespace
	    e[prop] = glamorousStar[prop];
	  }
	  return e;
	}, {}));
	
	module.exports = glamorous$1;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.compose = exports.merge = exports.$ = exports.style = exports.presets = exports.keyframes = exports.fontFace = exports.insertGlobal = exports.insertRule = exports.plugins = exports.styleSheet = undefined;
	exports.speedy = speedy;
	exports.simulations = simulations;
	exports.simulate = simulate;
	exports.cssLabels = cssLabels;
	exports.isLikeRule = isLikeRule;
	exports.idFor = idFor;
	exports.css = css;
	exports.rehydrate = rehydrate;
	exports.flush = flush;
	exports.select = select;
	exports.parent = parent;
	exports.media = media;
	exports.pseudo = pseudo;
	exports.active = active;
	exports.any = any;
	exports.checked = checked;
	exports.disabled = disabled;
	exports.empty = empty;
	exports.enabled = enabled;
	exports._default = _default;
	exports.first = first;
	exports.firstChild = firstChild;
	exports.firstOfType = firstOfType;
	exports.fullscreen = fullscreen;
	exports.focus = focus;
	exports.hover = hover;
	exports.indeterminate = indeterminate;
	exports.inRange = inRange;
	exports.invalid = invalid;
	exports.lastChild = lastChild;
	exports.lastOfType = lastOfType;
	exports.left = left;
	exports.link = link;
	exports.onlyChild = onlyChild;
	exports.onlyOfType = onlyOfType;
	exports.optional = optional;
	exports.outOfRange = outOfRange;
	exports.readOnly = readOnly;
	exports.readWrite = readWrite;
	exports.required = required;
	exports.right = right;
	exports.root = root;
	exports.scope = scope;
	exports.target = target;
	exports.valid = valid;
	exports.visited = visited;
	exports.dir = dir;
	exports.lang = lang;
	exports.not = not;
	exports.nthChild = nthChild;
	exports.nthLastChild = nthLastChild;
	exports.nthLastOfType = nthLastOfType;
	exports.nthOfType = nthOfType;
	exports.after = after;
	exports.before = before;
	exports.firstLetter = firstLetter;
	exports.firstLine = firstLine;
	exports.selection = selection;
	exports.backdrop = backdrop;
	exports.placeholder = placeholder;
	exports.cssFor = cssFor;
	exports.attribsFor = attribsFor;
	
	var _objectAssign = __webpack_require__(13);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _sheet = __webpack_require__(52);
	
	var _CSSPropertyOperations = __webpack_require__(53);
	
	var _clean = __webpack_require__(61);
	
	var _clean2 = _interopRequireDefault(_clean);
	
	var _plugins = __webpack_require__(62);
	
	var _hash = __webpack_require__(81);
	
	var _hash2 = _interopRequireDefault(_hash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	/* stylesheet */
	
	
	var styleSheet = exports.styleSheet = new _sheet.StyleSheet();
	// an isomorphic StyleSheet shim. hides all the nitty gritty.
	
	// /**************** LIFTOFF IN 3... 2... 1... ****************/
	styleSheet.inject(); //eslint-disable-line indent
	// /****************      TO THE MOOOOOOON     ****************/
	
	// convenience function to toggle speedy
	function speedy(bool) {
	  return styleSheet.speedy(bool);
	}
	
	// plugins
	// we include these by default
	var plugins = exports.plugins = styleSheet.plugins = new _plugins.PluginSet([_plugins.prefixes, _plugins.contentWrap, _plugins.fallbacks]);
	plugins.media = new _plugins.PluginSet(); // neat! media, font-face, keyframes
	plugins.fontFace = new _plugins.PluginSet();
	plugins.keyframes = new _plugins.PluginSet([_plugins.prefixes, _plugins.fallbacks]);
	
	// define some constants
	
	var isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
	var isTest = process.env.NODE_ENV === 'test';
	var isBrowser = typeof window !== 'undefined';
	
	/**** simulations  ****/
	
	// a flag to enable simulation meta tags on dom nodes
	// defaults to true in dev mode. recommend *not* to
	// toggle often.
	var canSimulate = isDev;
	
	// we use these flags for issuing warnings when simulate is called
	// in prod / in incorrect order
	var warned1 = false,
	    warned2 = false;
	
	// toggles simulation activity. shouldn't be needed in most cases
	function simulations() {
	  var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	  canSimulate = !!bool;
	}
	
	// use this on dom nodes to 'simulate' pseudoclasses
	// <div {...hover({ color: 'red' })} {...simulate('hover', 'visited')}>...</div>
	// you can even send in some weird ones, as long as it's in simple format
	// and matches an existing rule on the element
	// eg simulate('nthChild2', ':hover:active') etc
	function simulate() {
	  for (var _len = arguments.length, pseudos = Array(_len), _key = 0; _key < _len; _key++) {
	    pseudos[_key] = arguments[_key];
	  }
	
	  pseudos = (0, _clean2.default)(pseudos);
	  if (!pseudos) return {};
	  if (!canSimulate) {
	    if (!warned1) {
	      console.warn('can\'t simulate without once calling simulations(true)'); //eslint-disable-line no-console
	      warned1 = true;
	    }
	    if (!isDev && !isTest && !warned2) {
	      console.warn('don\'t use simulation outside dev'); //eslint-disable-line no-console
	      warned2 = true;
	    }
	    return {};
	  }
	  return pseudos.reduce(function (o, p) {
	    return o['data-simulate-' + simple(p)] = '', o;
	  }, {});
	}
	
	/**** labels ****/
	// toggle for debug labels.
	// *shouldn't* have to mess with this manually
	var hasLabels = isDev;
	
	function cssLabels(bool) {
	  hasLabels = !!bool;
	}
	
	// takes a string, converts to lowercase, strips out nonalphanumeric.
	function simple(str) {
	  var char = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	
	  return str.toLowerCase().replace(/[^a-z0-9]/g, char);
	}
	
	// hashes a string to something 'unique'
	// we use this to generate ids for styles
	
	
	function hashify(obj) {
	  var str = JSON.stringify(obj);
	  var toRet = (0, _hash2.default)(str).toString(36);
	  if (obj.label && obj.label.length > 0 && isDev) {
	    return simple(obj.label.join('.'), '-') + '-' + toRet;
	  }
	  return toRet;
	}
	
	// of shape { 'data-css-<id>': '' }
	function isLikeRule(rule) {
	  var keys = Object.keys(rule).filter(function (x) {
	    return x !== 'toString';
	  });
	  if (keys.length !== 1) {
	    return false;
	  }
	  return !!/data\-css\-([a-zA-Z0-9\-_]+)/.exec(keys[0]);
	}
	
	// extracts id from a { 'data-css-<id>': ''} like object
	function idFor(rule) {
	  var keys = Object.keys(rule).filter(function (x) {
	    return x !== 'toString';
	  });
	  if (keys.length !== 1) throw new Error('not a rule');
	  var regex = /data\-css\-([a-zA-Z0-9\-_]+)/;
	  var match = regex.exec(keys[0]);
	  if (!match) throw new Error('not a rule');
	  return match[1];
	}
	
	// from https://github.com/j2css/j2c/blob/5d381c2d721d04b54fabe6a165d587247c3087cb/src/helpers.js#L28-L61
	
	// "Tokenizes" the selectors into parts relevant for the next function.
	// Strings and comments are matched, but ignored afterwards.
	// This is not a full tokenizers. It only recognizes comas, parentheses,
	// strings and comments.
	// regexp generated by scripts/regexps.js then trimmed by hand
	var selectorTokenizer = /[(),]|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\/\*[\s\S]*?\*\//g;
	
	/**
	 * This will split a coma-separated selector list into individual selectors,
	 * ignoring comas in strings, comments and in :pseudo-selectors(parameter, lists).
	 *
	 * @param {string} selector
	 * @return {string[]}
	 */
	
	function splitSelector(selector) {
	  if (selector.indexOf(',') === -1) {
	    return [selector];
	  }
	
	  var indices = [],
	      res = [],
	      inParen = 0,
	      o;
	  /*eslint-disable no-cond-assign*/
	  while (o = selectorTokenizer.exec(selector)) {
	    /*eslint-enable no-cond-assign*/
	    switch (o[0]) {
	      case '(':
	        inParen++;break;
	      case ')':
	        inParen--;break;
	      case ',':
	        if (inParen) break;indices.push(o.index);
	    }
	  }
	  for (o = indices.length; o--;) {
	    res.unshift(selector.slice(indices[o] + 1));
	    selector = selector.slice(0, indices[o]);
	  }
	  res.unshift(selector);
	  return res;
	}
	
	function selector(id, path) {
	  if (!id) {
	    return path.replace(/\&/g, '');
	  }
	  if (!path) return '.css-' + id + ',[data-css-' + id + ']';
	
	  var x = splitSelector(path).map(function (x) {
	    return x.indexOf('&') >= 0 ? [x.replace(/\&/mg, '.css-' + id), x.replace(/\&/mg, '[data-css-' + id + ']')].join(',') // todo - make sure each sub selector has an &
	    : '.css-' + id + x + ',[data-css-' + id + ']' + x;
	  }).join(',');
	
	  if (canSimulate && /^\&\:/.exec(path) && !/\s/.exec(path)) {
	    x += ',.css-' + id + '[data-simulate-' + simple(path) + '],[data-css-' + id + '][data-simulate-' + simple(path) + ']';
	  }
	  return x;
	}
	
	// end https://github.com/j2css/j2c/blob/5d381c2d721d04b54fabe6a165d587247c3087cb/src/helpers.js#L28-L61
	
	
	function toCSS(_ref) {
	  var selector = _ref.selector,
	      style = _ref.style;
	
	  var result = plugins.transform({ selector: selector, style: style });
	  return result.selector + '{' + (0, _CSSPropertyOperations.createMarkupForStyles)(result.style) + '}';
	}
	
	function deconstruct(style) {
	  // we can be sure it's not infinitely nested here
	  var plain = void 0,
	      selects = void 0,
	      medias = void 0,
	      supports = void 0;
	  Object.keys(style).forEach(function (key) {
	    if (key.indexOf('&') >= 0) {
	      selects = selects || {};
	      selects[key] = style[key];
	    } else if (key.indexOf('@media') === 0) {
	      medias = medias || {};
	      medias[key] = deconstruct(style[key]);
	    } else if (key.indexOf('@supports') === 0) {
	      supports = supports || {};
	      supports[key] = deconstruct(style[key]);
	    } else if (key === 'label') {
	      if (style.label.length > 0) {
	        plain = plain || {};
	        plain.label = hasLabels ? style.label.join('.') : '';
	      }
	    } else {
	      plain = plain || {};
	      plain[key] = style[key];
	    }
	  });
	  return { plain: plain, selects: selects, medias: medias, supports: supports };
	}
	
	function deconstructedStyleToCSS(id, style) {
	  var css = [];
	
	  // plugins here
	  var plain = style.plain,
	      selects = style.selects,
	      medias = style.medias,
	      supports = style.supports;
	
	  if (plain) {
	    css.push(toCSS({ style: plain, selector: selector(id) }));
	  }
	  if (selects) {
	    Object.keys(selects).forEach(function (key) {
	      return css.push(toCSS({ style: selects[key], selector: selector(id, key) }));
	    });
	  }
	  if (medias) {
	    Object.keys(medias).forEach(function (key) {
	      return css.push(key + '{' + deconstructedStyleToCSS(id, medias[key]).join('') + '}');
	    });
	  }
	  if (supports) {
	    Object.keys(supports).forEach(function (key) {
	      return css.push(key + '{' + deconstructedStyleToCSS(id, supports[key]).join('') + '}');
	    });
	  }
	  return css;
	}
	
	// this cache to track which rules have
	// been inserted into the stylesheet
	var inserted = styleSheet.inserted = {};
	
	// and helpers to insert rules into said styleSheet
	function insert(spec) {
	  if (!inserted[spec.id]) {
	    inserted[spec.id] = true;
	    var deconstructed = deconstruct(spec.style);
	    var rules = deconstructedStyleToCSS(spec.id, deconstructed);
	    inserted[spec.id] = isBrowser ? true : rules;
	    rules.forEach(function (cssRule) {
	      return styleSheet.insert(cssRule);
	    });
	  }
	}
	
	// a simple cache to store generated rules
	var registered = styleSheet.registered = {};
	function register(spec) {
	  if (!registered[spec.id]) {
	    registered[spec.id] = spec;
	  }
	}
	
	function _getRegistered(rule) {
	  if (isLikeRule(rule)) {
	    var ret = registered[idFor(rule)];
	    if (ret == null) {
	      throw new Error('[glamor] an unexpected rule cache miss occurred. This is probably a sign of multiple glamor instances in your app. See https://github.com/threepointone/glamor/issues/79');
	    }
	    return ret;
	  }
	  return rule;
	}
	
	// todo - perf
	var ruleCache = {};
	function toRule(spec) {
	  register(spec);
	  insert(spec);
	
	  if (ruleCache[spec.id]) {
	    return ruleCache[spec.id];
	  }
	
	  var ret = _defineProperty({}, 'data-css-' + spec.id, hasLabels ? spec.label || '' : '');
	  Object.defineProperty(ret, 'toString', {
	    enumerable: false, value: function value() {
	      return 'css-' + spec.id;
	    }
	  });
	  ruleCache[spec.id] = ret;
	  return ret;
	}
	
	function log() {
	  //eslint-disable-line no-unused-vars
	  console.log(this); //eslint-disable-line no-console
	  return this;
	}
	
	function isSelector(key) {
	  var possibles = [':', '.', '[', '>', ' '],
	      found = false,
	      ch = key.charAt(0);
	  for (var i = 0; i < possibles.length; i++) {
	    if (ch === possibles[i]) {
	      found = true;
	      break;
	    }
	  }
	  return found || key.indexOf('&') >= 0;
	}
	
	function joinSelectors(a, b) {
	  var as = splitSelector(a).map(function (a) {
	    return !(a.indexOf('&') >= 0) ? '&' + a : a;
	  });
	  var bs = splitSelector(b).map(function (b) {
	    return !(b.indexOf('&') >= 0) ? '&' + b : b;
	  });
	
	  return bs.reduce(function (arr, b) {
	    return arr.concat(as.map(function (a) {
	      return b.replace(/\&/g, a);
	    }));
	  }, []).join(',');
	}
	
	function joinMediaQueries(a, b) {
	  return a ? '@media ' + a.substring(6) + ' and ' + b.substring(6) : b;
	}
	
	function isMediaQuery(key) {
	  return key.indexOf('@media') === 0;
	}
	
	function isSupports(key) {
	  return key.indexOf('@supports') === 0;
	}
	
	function joinSupports(a, b) {
	  return a ? '@supports ' + a.substring(9) + ' and ' + b.substring(9) : b;
	}
	
	// flatten a nested array
	function flatten(inArr) {
	  var arr = [];
	  for (var i = 0; i < inArr.length; i++) {
	    if (Array.isArray(inArr[i])) arr = arr.concat(flatten(inArr[i]));else arr = arr.concat(inArr[i]);
	  }
	  return arr;
	}
	
	var prefixedPseudoSelectors = {
	  '::placeholder': ['::-webkit-input-placeholder', '::-moz-placeholder', '::-ms-input-placeholder'],
	  ':fullscreen': [':-webkit-full-screen', ':-moz-full-screen', ':-ms-fullscreen']
	
	  // mutable! modifies dest.
	};function build(dest, _ref2) {
	  var _ref2$selector = _ref2.selector,
	      selector = _ref2$selector === undefined ? '' : _ref2$selector,
	      _ref2$mq = _ref2.mq,
	      mq = _ref2$mq === undefined ? '' : _ref2$mq,
	      _ref2$supp = _ref2.supp,
	      supp = _ref2$supp === undefined ? '' : _ref2$supp,
	      _ref2$src = _ref2.src,
	      src = _ref2$src === undefined ? {} : _ref2$src;
	
	
	  if (!Array.isArray(src)) {
	    src = [src];
	  }
	  src = flatten(src);
	
	  src.forEach(function (_src) {
	    if (isLikeRule(_src)) {
	      var reg = _getRegistered(_src);
	      if (reg.type !== 'css') {
	        throw new Error('cannot merge this rule');
	      }
	      _src = reg.style;
	    }
	    _src = (0, _clean2.default)(_src);
	    if (_src && _src.composes) {
	      build(dest, { selector: selector, mq: mq, supp: supp, src: _src.composes });
	    }
	    Object.keys(_src || {}).forEach(function (key) {
	      if (isSelector(key)) {
	
	        if (prefixedPseudoSelectors[key]) {
	          prefixedPseudoSelectors[key].forEach(function (p) {
	            return build(dest, { selector: joinSelectors(selector, p), mq: mq, supp: supp, src: _src[key] });
	          });
	        }
	
	        build(dest, { selector: joinSelectors(selector, key), mq: mq, supp: supp, src: _src[key] });
	      } else if (isMediaQuery(key)) {
	        build(dest, { selector: selector, mq: joinMediaQueries(mq, key), supp: supp, src: _src[key] });
	      } else if (isSupports(key)) {
	        build(dest, { selector: selector, mq: mq, supp: joinSupports(supp, key), src: _src[key] });
	      } else if (key === 'composes') {
	        // ignore, we already dealth with it
	      } else {
	        var _dest = dest;
	        if (supp) {
	          _dest[supp] = _dest[supp] || {};
	          _dest = _dest[supp];
	        }
	        if (mq) {
	          _dest[mq] = _dest[mq] || {};
	          _dest = _dest[mq];
	        }
	        if (selector) {
	          _dest[selector] = _dest[selector] || {};
	          _dest = _dest[selector];
	        }
	
	        if (key === 'label') {
	          if (hasLabels) {
	            dest.label = dest.label.concat(_src.label);
	          }
	        } else {
	          _dest[key] = _src[key];
	        }
	      }
	    });
	  });
	}
	
	function _css(rules) {
	  var style = { label: [] };
	  build(style, { src: rules }); // mutative! but worth it.
	
	  var spec = {
	    id: hashify(style),
	    style: style, label: hasLabels ? style.label.join('.') : '',
	    type: 'css'
	  };
	  return toRule(spec);
	}
	
	var nullrule = {
	  // 'data-css-nil': ''
	};
	Object.defineProperty(nullrule, 'toString', {
	  enumerable: false, value: function value() {
	    return 'css-nil';
	  }
	});
	
	var inputCaches = typeof WeakMap !== 'undefined' ? [nullrule, new WeakMap(), new WeakMap(), new WeakMap()] : [nullrule];
	
	var warnedWeakMapError = false;
	function multiIndexCache(fn) {
	  return function (args) {
	    if (inputCaches[args.length]) {
	      var coi = inputCaches[args.length];
	      var ctr = 0;
	      while (ctr < args.length - 1) {
	        if (!coi.has(args[ctr])) {
	          coi.set(args[ctr], new WeakMap());
	        }
	        coi = coi.get(args[ctr]);
	        ctr++;
	      }
	      if (coi.has(args[args.length - 1])) {
	        var ret = coi.get(args[ctr]);
	
	        if (registered[ret.toString().substring(4)]) {
	          // make sure it hasn't been flushed
	          return ret;
	        }
	      }
	    }
	    var value = fn(args);
	    if (inputCaches[args.length]) {
	      var _ctr = 0,
	          _coi = inputCaches[args.length];
	      while (_ctr < args.length - 1) {
	        _coi = _coi.get(args[_ctr]);
	        _ctr++;
	      }
	      try {
	        _coi.set(args[_ctr], value);
	      } catch (err) {
	        if (isDev && !warnedWeakMapError) {
	          var _console;
	
	          warnedWeakMapError = true;
	          (_console = console).warn.apply(_console, ['failed setting the WeakMap cache for args:'].concat(_toConsumableArray(args))); // eslint-disable-line no-console
	          console.warn('this should NOT happen, please file a bug on the github repo.'); // eslint-disable-line no-console
	        }
	      }
	    }
	    return value;
	  };
	}
	
	var cachedCss = typeof WeakMap !== 'undefined' ? multiIndexCache(_css) : _css;
	
	function css() {
	  for (var _len2 = arguments.length, rules = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    rules[_key2] = arguments[_key2];
	  }
	
	  if (rules[0] && rules[0].length && rules[0].raw) {
	    throw new Error('you forgot to include glamor/babel in your babel plugins.');
	  }
	
	  rules = (0, _clean2.default)(rules);
	  if (!rules) {
	    return nullrule;
	  }
	
	  return cachedCss(rules);
	}
	
	css.insert = function (css) {
	  var spec = {
	    id: hashify(css),
	    css: css,
	    type: 'raw'
	  };
	  register(spec);
	  if (!inserted[spec.id]) {
	    styleSheet.insert(spec.css);
	    inserted[spec.id] = isBrowser ? true : [spec.css];
	  }
	};
	
	var insertRule = exports.insertRule = css.insert;
	
	css.global = function (selector, style) {
	  style = (0, _clean2.default)(style);
	  if (style) {
	    return css.insert(toCSS({ selector: selector, style: style }));
	  }
	};
	
	var insertGlobal = exports.insertGlobal = css.global;
	
	function insertKeyframe(spec) {
	  if (!inserted[spec.id]) {
	    var inner = Object.keys(spec.keyframes).map(function (kf) {
	      var result = plugins.keyframes.transform({ id: spec.id, name: kf, style: spec.keyframes[kf] });
	      return result.name + '{' + (0, _CSSPropertyOperations.createMarkupForStyles)(result.style) + '}';
	    }).join('');
	
	    var rules = ['-webkit-', '-moz-', '-o-', ''].map(function (prefix) {
	      return '@' + prefix + 'keyframes ' + (spec.name + '_' + spec.id) + '{' + inner + '}';
	    });
	    rules.forEach(function (rule) {
	      return styleSheet.insert(rule);
	    });
	
	    inserted[spec.id] = isBrowser ? true : rules;
	  }
	}
	css.keyframes = function (name, kfs) {
	  if (!kfs) {
	    kfs = name, name = 'animation';
	  }
	
	  // do not ignore empty keyframe definitions for now.
	  kfs = (0, _clean2.default)(kfs) || {};
	  var spec = {
	    id: hashify({ name: name, kfs: kfs }),
	    type: 'keyframes',
	    name: name,
	    keyframes: kfs
	  };
	  register(spec);
	  insertKeyframe(spec);
	  return name + '_' + spec.id;
	};
	
	// we don't go all out for fonts as much, giving a simple font loading strategy
	// use a fancier lib if you need moar power
	css.fontFace = function (font) {
	  font = (0, _clean2.default)(font);
	  var spec = {
	    id: hashify(font),
	    type: 'font-face',
	    font: font
	  };
	  register(spec);
	  insertFontFace(spec);
	
	  return font.fontFamily;
	};
	
	var fontFace = exports.fontFace = css.fontFace;
	var keyframes = exports.keyframes = css.keyframes;
	
	function insertFontFace(spec) {
	  if (!inserted[spec.id]) {
	    var rule = '@font-face{' + (0, _CSSPropertyOperations.createMarkupForStyles)(spec.font) + '}';
	    styleSheet.insert(rule);
	    inserted[spec.id] = isBrowser ? true : [rule];
	  }
	}
	
	// rehydrate the insertion cache with ids sent from
	// renderStatic / renderStaticOptimized
	function rehydrate(ids) {
	  // load up ids
	  (0, _objectAssign2.default)(inserted, ids.reduce(function (o, i) {
	    return o[i] = true, o;
	  }, {}));
	  // assume css loaded separately
	}
	
	// clears out the cache and empties the stylesheet
	// best for tests, though there might be some value for SSR.
	
	function flush() {
	  inserted = styleSheet.inserted = {};
	  registered = styleSheet.registered = {};
	  ruleCache = {};
	  styleSheet.flush();
	  styleSheet.inject();
	}
	
	var presets = exports.presets = {
	  mobile: '(min-width: 400px)',
	  Mobile: '@media (min-width: 400px)',
	  phablet: '(min-width: 550px)',
	  Phablet: '@media (min-width: 550px)',
	  tablet: '(min-width: 750px)',
	  Tablet: '@media (min-width: 750px)',
	  desktop: '(min-width: 1000px)',
	  Desktop: '@media (min-width: 1000px)',
	  hd: '(min-width: 1200px)',
	  Hd: '@media (min-width: 1200px)'
	};
	
	var style = exports.style = css;
	
	function select(selector) {
	  for (var _len3 = arguments.length, styles = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    styles[_key3 - 1] = arguments[_key3];
	  }
	
	  if (!selector) {
	    return style(styles);
	  }
	  return css(_defineProperty({}, selector, styles));
	}
	var $ = exports.$ = select;
	
	function parent(selector) {
	  for (var _len4 = arguments.length, styles = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	    styles[_key4 - 1] = arguments[_key4];
	  }
	
	  return css(_defineProperty({}, selector + ' &', styles));
	}
	
	var merge = exports.merge = css;
	var compose = exports.compose = css;
	
	function media(query) {
	  for (var _len5 = arguments.length, rules = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
	    rules[_key5 - 1] = arguments[_key5];
	  }
	
	  return css(_defineProperty({}, '@media ' + query, rules));
	}
	
	function pseudo(selector) {
	  for (var _len6 = arguments.length, styles = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
	    styles[_key6 - 1] = arguments[_key6];
	  }
	
	  return css(_defineProperty({}, selector, styles));
	}
	
	// allllll the pseudoclasses
	
	function active(x) {
	  return pseudo(':active', x);
	}
	
	function any(x) {
	  return pseudo(':any', x);
	}
	
	function checked(x) {
	  return pseudo(':checked', x);
	}
	
	function disabled(x) {
	  return pseudo(':disabled', x);
	}
	
	function empty(x) {
	  return pseudo(':empty', x);
	}
	
	function enabled(x) {
	  return pseudo(':enabled', x);
	}
	
	function _default(x) {
	  return pseudo(':default', x); // note '_default' name
	}
	
	function first(x) {
	  return pseudo(':first', x);
	}
	
	function firstChild(x) {
	  return pseudo(':first-child', x);
	}
	
	function firstOfType(x) {
	  return pseudo(':first-of-type', x);
	}
	
	function fullscreen(x) {
	  return pseudo(':fullscreen', x);
	}
	
	function focus(x) {
	  return pseudo(':focus', x);
	}
	
	function hover(x) {
	  return pseudo(':hover', x);
	}
	
	function indeterminate(x) {
	  return pseudo(':indeterminate', x);
	}
	
	function inRange(x) {
	  return pseudo(':in-range', x);
	}
	
	function invalid(x) {
	  return pseudo(':invalid', x);
	}
	
	function lastChild(x) {
	  return pseudo(':last-child', x);
	}
	
	function lastOfType(x) {
	  return pseudo(':last-of-type', x);
	}
	
	function left(x) {
	  return pseudo(':left', x);
	}
	
	function link(x) {
	  return pseudo(':link', x);
	}
	
	function onlyChild(x) {
	  return pseudo(':only-child', x);
	}
	
	function onlyOfType(x) {
	  return pseudo(':only-of-type', x);
	}
	
	function optional(x) {
	  return pseudo(':optional', x);
	}
	
	function outOfRange(x) {
	  return pseudo(':out-of-range', x);
	}
	
	function readOnly(x) {
	  return pseudo(':read-only', x);
	}
	
	function readWrite(x) {
	  return pseudo(':read-write', x);
	}
	
	function required(x) {
	  return pseudo(':required', x);
	}
	
	function right(x) {
	  return pseudo(':right', x);
	}
	
	function root(x) {
	  return pseudo(':root', x);
	}
	
	function scope(x) {
	  return pseudo(':scope', x);
	}
	
	function target(x) {
	  return pseudo(':target', x);
	}
	
	function valid(x) {
	  return pseudo(':valid', x);
	}
	
	function visited(x) {
	  return pseudo(':visited', x);
	}
	
	// parameterized pseudoclasses
	function dir(p, x) {
	  return pseudo(':dir(' + p + ')', x);
	}
	function lang(p, x) {
	  return pseudo(':lang(' + p + ')', x);
	}
	function not(p, x) {
	  // should this be a plugin?
	  var selector = p.split(',').map(function (x) {
	    return x.trim();
	  }).map(function (x) {
	    return ':not(' + x + ')';
	  });
	  if (selector.length === 1) {
	    return pseudo(':not(' + p + ')', x);
	  }
	  return select(selector.join(''), x);
	}
	function nthChild(p, x) {
	  return pseudo(':nth-child(' + p + ')', x);
	}
	function nthLastChild(p, x) {
	  return pseudo(':nth-last-child(' + p + ')', x);
	}
	function nthLastOfType(p, x) {
	  return pseudo(':nth-last-of-type(' + p + ')', x);
	}
	function nthOfType(p, x) {
	  return pseudo(':nth-of-type(' + p + ')', x);
	}
	
	// pseudoelements
	function after(x) {
	  return pseudo('::after', x);
	}
	function before(x) {
	  return pseudo('::before', x);
	}
	function firstLetter(x) {
	  return pseudo('::first-letter', x);
	}
	function firstLine(x) {
	  return pseudo('::first-line', x);
	}
	function selection(x) {
	  return pseudo('::selection', x);
	}
	function backdrop(x) {
	  return pseudo('::backdrop', x);
	}
	function placeholder(x) {
	  // https://github.com/threepointone/glamor/issues/14
	  return css({ '::placeholder': x });
	}
	
	/*** helpers for web components ***/
	// https://github.com/threepointone/glamor/issues/16
	
	function cssFor() {
	  for (var _len7 = arguments.length, rules = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	    rules[_key7] = arguments[_key7];
	  }
	
	  rules = (0, _clean2.default)(rules);
	  return rules ? rules.map(function (r) {
	    var style = { label: [] };
	    build(style, { src: r }); // mutative! but worth it.
	    return deconstructedStyleToCSS(hashify(style), deconstruct(style)).join('');
	  }).join('') : '';
	}
	
	function attribsFor() {
	  for (var _len8 = arguments.length, rules = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
	    rules[_key8] = arguments[_key8];
	  }
	
	  rules = (0, _clean2.default)(rules);
	  var htmlAttributes = rules ? rules.map(function (rule) {
	    idFor(rule); // throwaway check for rule
	    var key = Object.keys(rule)[0],
	        value = rule[key];
	    return key + '="' + (value || '') + '"';
	  }).join(' ') : '';
	
	  return htmlAttributes;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.StyleSheet = StyleSheet;
	
	var _objectAssign = __webpack_require__(13);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	/* 
	
	high performance StyleSheet for css-in-js systems 
	
	- uses multiple style tags behind the scenes for millions of rules 
	- uses `insertRule` for appending in production for *much* faster performance
	- 'polyfills' on server side 
	
	
	// usage
	
	import StyleSheet from 'glamor/lib/sheet'
	let styleSheet = new StyleSheet()
	
	styleSheet.inject() 
	- 'injects' the stylesheet into the page (or into memory if on server)
	
	styleSheet.insert('#box { border: 1px solid red; }') 
	- appends a css rule into the stylesheet 
	
	styleSheet.flush() 
	- empties the stylesheet of all its contents
	
	
	*/
	
	function last(arr) {
	  return arr[arr.length - 1];
	}
	
	function sheetForTag(tag) {
	  if (tag.sheet) {
	    return tag.sheet;
	  }
	
	  // this weirdness brought to you by firefox 
	  for (var i = 0; i < document.styleSheets.length; i++) {
	    if (document.styleSheets[i].ownerNode === tag) {
	      return document.styleSheets[i];
	    }
	  }
	}
	
	var isBrowser = typeof window !== 'undefined';
	var isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV; //(x => (x === 'development') || !x)(process.env.NODE_ENV)
	var isTest = process.env.NODE_ENV === 'test';
	
	var oldIE = function () {
	  if (isBrowser) {
	    var div = document.createElement('div');
	    div.innerHTML = '<!--[if lt IE 10]><i></i><![endif]-->';
	    return div.getElementsByTagName('i').length === 1;
	  }
	}();
	
	function makeStyleTag() {
	  var tag = document.createElement('style');
	  tag.type = 'text/css';
	  tag.setAttribute('data-glamor', '');
	  tag.appendChild(document.createTextNode(''));
	  (document.head || document.getElementsByTagName('head')[0]).appendChild(tag);
	  return tag;
	}
	
	function StyleSheet() {
	  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      _ref$speedy = _ref.speedy,
	      speedy = _ref$speedy === undefined ? !isDev && !isTest : _ref$speedy,
	      _ref$maxLength = _ref.maxLength,
	      maxLength = _ref$maxLength === undefined ? isBrowser && oldIE ? 4000 : 65000 : _ref$maxLength;
	
	  this.isSpeedy = speedy; // the big drawback here is that the css won't be editable in devtools
	  this.sheet = undefined;
	  this.tags = [];
	  this.maxLength = maxLength;
	  this.ctr = 0;
	}
	
	(0, _objectAssign2.default)(StyleSheet.prototype, {
	  getSheet: function getSheet() {
	    return sheetForTag(last(this.tags));
	  },
	  inject: function inject() {
	    var _this = this;
	
	    if (this.injected) {
	      throw new Error('already injected stylesheet!');
	    }
	    if (isBrowser) {
	      this.tags[0] = makeStyleTag();
	    } else {
	      // server side 'polyfill'. just enough behavior to be useful.
	      this.sheet = {
	        cssRules: [],
	        insertRule: function insertRule(rule) {
	          // enough 'spec compliance' to be able to extract the rules later  
	          // in other words, just the cssText field 
	          _this.sheet.cssRules.push({ cssText: rule });
	        }
	      };
	    }
	    this.injected = true;
	  },
	  speedy: function speedy(bool) {
	    if (this.ctr !== 0) {
	      throw new Error('cannot change speedy mode after inserting any rule to sheet. Either call speedy(' + bool + ') earlier in your app, or call flush() before speedy(' + bool + ')');
	    }
	    this.isSpeedy = !!bool;
	  },
	  _insert: function _insert(rule) {
	    // this weirdness for perf, and chrome's weird bug 
	    // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
	    try {
	      var sheet = this.getSheet();
	      sheet.insertRule(rule, rule.indexOf('@import') !== -1 ? 0 : sheet.cssRules.length);
	    } catch (e) {
	      if (isDev) {
	        // might need beter dx for this 
	        console.warn('whoops, illegal rule inserted', rule); //eslint-disable-line no-console
	      }
	    }
	  },
	  insert: function insert(rule) {
	
	    if (isBrowser) {
	      // this is the ultrafast version, works across browsers 
	      if (this.isSpeedy && this.getSheet().insertRule) {
	        this._insert(rule);
	      }
	      // more browser weirdness. I don't even know    
	      // else if(this.tags.length > 0 && this.tags::last().styleSheet) {      
	      //   this.tags::last().styleSheet.cssText+= rule
	      // }
	      else {
	          if (rule.indexOf('@import') !== -1) {
	            var tag = last(this.tags);
	            tag.insertBefore(document.createTextNode(rule), tag.firstChild);
	          } else {
	            last(this.tags).appendChild(document.createTextNode(rule));
	          }
	        }
	    } else {
	      // server side is pretty simple         
	      this.sheet.insertRule(rule, rule.indexOf('@import') !== -1 ? 0 : this.sheet.cssRules.length);
	    }
	
	    this.ctr++;
	    if (isBrowser && this.ctr % this.maxLength === 0) {
	      this.tags.push(makeStyleTag());
	    }
	    return this.ctr - 1;
	  },
	
	  // commenting this out till we decide on v3's decision 
	  // _replace(index, rule) {
	  //   // this weirdness for perf, and chrome's weird bug 
	  //   // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
	  //   try {  
	  //     let sheet = this.getSheet()        
	  //     sheet.deleteRule(index) // todo - correct index here     
	  //     sheet.insertRule(rule, index)
	  //   }
	  //   catch(e) {
	  //     if(isDev) {
	  //       // might need beter dx for this 
	  //       console.warn('whoops, problem replacing rule', rule) //eslint-disable-line no-console
	  //     }          
	  //   }          
	
	  // }
	  // replace(index, rule) {
	  //   if(isBrowser) {
	  //     if(this.isSpeedy && this.getSheet().insertRule) {
	  //       this._replace(index, rule)
	  //     }
	  //     else {
	  //       let _slot = Math.floor((index  + this.maxLength) / this.maxLength) - 1        
	  //       let _index = (index % this.maxLength) + 1
	  //       let tag = this.tags[_slot]
	  //       tag.replaceChild(document.createTextNode(rule), tag.childNodes[_index])
	  //     }
	  //   }
	  //   else {
	  //     let rules = this.sheet.cssRules
	  //     this.sheet.cssRules = [ ...rules.slice(0, index), { cssText: rule }, ...rules.slice(index + 1) ]
	  //   }
	  // }
	  delete: function _delete(index) {
	    // we insert a blank rule when 'deleting' so previously returned indexes remain stable
	    return this.replace(index, '');
	  },
	  flush: function flush() {
	    if (isBrowser) {
	      this.tags.forEach(function (tag) {
	        return tag.parentNode.removeChild(tag);
	      });
	      this.tags = [];
	      this.sheet = null;
	      this.ctr = 0;
	      // todo - look for remnants in document.styleSheets
	    } else {
	      // simpler on server 
	      this.sheet.cssRules = [];
	    }
	    this.injected = false;
	  },
	  rules: function rules() {
	    if (!isBrowser) {
	      return this.sheet.cssRules;
	    }
	    var arr = [];
	    this.tags.forEach(function (tag) {
	      return arr.splice.apply(arr, [arr.length, 0].concat(_toConsumableArray(Array.from(sheetForTag(tag).cssRules))));
	    });
	    return arr;
	  }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.processStyleName = undefined;
	exports.createMarkupForStyles = createMarkupForStyles;
	
	var _camelizeStyleName = __webpack_require__(54);
	
	var _camelizeStyleName2 = _interopRequireDefault(_camelizeStyleName);
	
	var _dangerousStyleValue = __webpack_require__(56);
	
	var _dangerousStyleValue2 = _interopRequireDefault(_dangerousStyleValue);
	
	var _hyphenateStyleName = __webpack_require__(58);
	
	var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);
	
	var _memoizeStringOnly = __webpack_require__(60);
	
	var _memoizeStringOnly2 = _interopRequireDefault(_memoizeStringOnly);
	
	var _warning = __webpack_require__(17);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var processStyleName = exports.processStyleName = (0, _memoizeStringOnly2.default)(_hyphenateStyleName2.default); /**
	                                                                                                                   * Copyright 2013-present, Facebook, Inc.
	                                                                                                                   * All rights reserved.
	                                                                                                                   *
	                                                                                                                   * This source code is licensed under the BSD-style license found in the
	                                                                                                                   * LICENSE file in the root directory of this source tree. An additional grant
	                                                                                                                   * of patent rights can be found in the PATENTS file in the same directory.
	                                                                                                                   *
	                                                                                                                   * @providesModule CSSPropertyOperations
	                                                                                                                   */
	
	if (process.env.NODE_ENV !== 'production') {
	  // 'msTransform' is correct, but the other prefixes should be capitalized
	  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
	
	  // style values shouldn't contain a semicolon
	  var badStyleValueWithSemicolonPattern = /;\s*$/;
	
	  var warnedStyleNames = {};
	  var warnedStyleValues = {};
	  var warnedForNaNValue = false;
	
	  var warnHyphenatedStyleName = function warnHyphenatedStyleName(name, owner) {
	    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
	      return;
	    }
	
	    warnedStyleNames[name] = true;
	    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Unsupported style property %s. Did you mean %s?%s', name, (0, _camelizeStyleName2.default)(name), checkRenderMessage(owner)) : void 0;
	  };
	
	  var warnBadVendoredStyleName = function warnBadVendoredStyleName(name, owner) {
	    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
	      return;
	    }
	
	    warnedStyleNames[name] = true;
	    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), checkRenderMessage(owner)) : void 0;
	  };
	
	  var warnStyleValueWithSemicolon = function warnStyleValueWithSemicolon(name, value, owner) {
	    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
	      return;
	    }
	
	    warnedStyleValues[value] = true;
	    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'Style property values shouldn\'t contain a semicolon.%s ' + 'Try "%s: %s" instead.', checkRenderMessage(owner), name, value.replace(badStyleValueWithSemicolonPattern, '')) : void 0;
	  };
	
	  var warnStyleValueIsNaN = function warnStyleValueIsNaN(name, value, owner) {
	    if (warnedForNaNValue) {
	      return;
	    }
	
	    warnedForNaNValue = true;
	    process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, '`NaN` is an invalid value for the `%s` css style property.%s', name, checkRenderMessage(owner)) : void 0;
	  };
	
	  var checkRenderMessage = function checkRenderMessage(owner) {
	    if (owner) {
	      var name = owner.getName();
	      if (name) {
	        return ' Check the render method of `' + name + '`.';
	      }
	    }
	    return '';
	  };
	
	  /**
	   * @param {string} name
	   * @param {*} value
	   * @param {ReactDOMComponent} component
	   */
	  var warnValidStyle = function warnValidStyle(name, value, component) {
	    //eslint-disable-line no-var
	    var owner = void 0;
	    if (component) {
	      owner = component._currentElement._owner;
	    }
	    if (name.indexOf('-') > -1) {
	      warnHyphenatedStyleName(name, owner);
	    } else if (badVendoredStyleNamePattern.test(name)) {
	      warnBadVendoredStyleName(name, owner);
	    } else if (badStyleValueWithSemicolonPattern.test(value)) {
	      warnStyleValueWithSemicolon(name, value, owner);
	    }
	
	    if (typeof value === 'number' && isNaN(value)) {
	      warnStyleValueIsNaN(name, value, owner);
	    }
	  };
	}
	
	/**
	   * Serializes a mapping of style properties for use as inline styles:
	   *
	   *   > createMarkupForStyles({width: '200px', height: 0})
	   *   "width:200px;height:0;"
	   *
	   * Undefined values are ignored so that declarative programming is easier.
	   * The result should be HTML-escaped before insertion into the DOM.
	   *
	   * @param {object} styles
	   * @param {ReactDOMComponent} component
	   * @return {?string}
	   */
	
	function createMarkupForStyles(styles, component) {
	  var serialized = '';
	  for (var styleName in styles) {
	    var isCustomProp = styleName.indexOf('--') === 0;
	    if (!styles.hasOwnProperty(styleName)) {
	      continue;
	    }
	    if (styleName === 'label') {
	      continue;
	    }
	    var styleValue = styles[styleName];
	    if (process.env.NODE_ENV !== 'production' && !isCustomProp) {
	      warnValidStyle(styleName, styleValue, component);
	    }
	    if (styleValue != null) {
	      if (isCustomProp) {
	        serialized += styleName + ':' + styleValue + ';';
	      } else {
	        serialized += processStyleName(styleName) + ':';
	        serialized += (0, _dangerousStyleValue2.default)(styleName, styleValue, component) + ';';
	      }
	    }
	  }
	  return serialized || null;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 54 */,
/* 55 */,
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _CSSProperty = __webpack_require__(57);
	
	var _CSSProperty2 = _interopRequireDefault(_CSSProperty);
	
	var _warning = __webpack_require__(17);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule dangerousStyleValue
	 */
	
	var isUnitlessNumber = _CSSProperty2.default.isUnitlessNumber;
	var styleWarnings = {};
	
	/**
	 * Convert a value into the proper css writable value. The style name `name`
	 * should be logical (no hyphens), as specified
	 * in `CSSProperty.isUnitlessNumber`.
	 *
	 * @param {string} name CSS property name such as `topMargin`.
	 * @param {*} value CSS property value such as `10px`.
	 * @param {ReactDOMComponent} component
	 * @return {string} Normalized style value with dimensions applied.
	 */
	function dangerousStyleValue(name, value, component) {
	  // Note that we've removed escapeTextForBrowser() calls here since the
	  // whole string will be escaped when the attribute is injected into
	  // the markup. If you provide unsafe user data here they can inject
	  // arbitrary CSS which may be problematic (I couldn't repro this):
	  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
	  // This is not an XSS hole but instead a potential CSS injection issue
	  // which has lead to a greater discussion about how we're going to
	  // trust URLs moving forward. See #2115901
	
	  var isEmpty = value == null || typeof value === 'boolean' || value === '';
	  if (isEmpty) {
	    return '';
	  }
	
	  var isNonNumeric = isNaN(value);
	  if (isNonNumeric || value === 0 || isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
	    return '' + value; // cast to string
	  }
	
	  if (typeof value === 'string') {
	    if (process.env.NODE_ENV !== 'production') {
	      // Allow '0' to pass through without warning. 0 is already special and
	      // doesn't require units, so we don't need to warn about it.
	      if (component && value !== '0') {
	        var owner = component._currentElement._owner;
	        var ownerName = owner ? owner.getName() : null;
	        if (ownerName && !styleWarnings[ownerName]) {
	          styleWarnings[ownerName] = {};
	        }
	        var warned = false;
	        if (ownerName) {
	          var warnings = styleWarnings[ownerName];
	          warned = warnings[name];
	          if (!warned) {
	            warnings[name] = true;
	          }
	        }
	        if (!warned) {
	          process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(false, 'a `%s` tag (owner: `%s`) was passed a numeric string value ' + 'for CSS property `%s` (value: `%s`) which will be treated ' + 'as a unitless number in a future version of React.', component._currentElement.type, ownerName || 'unknown', name, value) : void 0;
	        }
	      }
	    }
	    value = value.trim();
	  }
	  return value + 'px';
	}
	
	exports.default = dangerousStyleValue;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 57 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CSSProperty
	 */
	
	/**
	 * CSS properties which accept numbers but are not in units of "px".
	 */
	
	var isUnitlessNumber = {
	  animationIterationCount: true,
	  borderImageOutset: true,
	  borderImageSlice: true,
	  borderImageWidth: true,
	  boxFlex: true,
	  boxFlexGroup: true,
	  boxOrdinalGroup: true,
	  columnCount: true,
	  flex: true,
	  flexGrow: true,
	  flexPositive: true,
	  flexShrink: true,
	  flexNegative: true,
	  flexOrder: true,
	  gridRow: true,
	  gridRowStart: true,
	  gridRowEnd: true,
	  gridColumn: true,
	  gridColumnStart: true,
	  gridColumnEnd: true,
	  fontWeight: true,
	  lineClamp: true,
	  lineHeight: true,
	  opacity: true,
	  order: true,
	  orphans: true,
	  tabSize: true,
	  widows: true,
	  zIndex: true,
	  zoom: true,
	
	  // SVG-related properties
	  fillOpacity: true,
	  floodOpacity: true,
	  stopOpacity: true,
	  strokeDasharray: true,
	  strokeDashoffset: true,
	  strokeMiterlimit: true,
	  strokeOpacity: true,
	  strokeWidth: true
	
	  /**
	   * @param {string} prefix vendor-specific prefix, eg: Webkit
	   * @param {string} key style name, eg: transitionDuration
	   * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
	   * WebkitTransitionDuration
	   */
	};function prefixKey(prefix, key) {
	  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
	}
	
	/**
	 * Support style names that may come passed in prefixed by adding permutations
	 * of vendor prefixes.
	 */
	var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
	
	// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
	// infinite loop, because it iterates over the newly added props too.
	Object.keys(isUnitlessNumber).forEach(function (prop) {
	  prefixes.forEach(function (prefix) {
	    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
	  });
	});
	
	/**
	 * Most style properties can be unset by doing .style[prop] = '' but IE8
	 * doesn't like doing that with shorthand properties so for the properties that
	 * IE8 breaks on, which are listed here, we instead unset each of the
	 * individual properties. See http://bugs.jquery.com/ticket/12385.
	 * The 4-value 'clock' properties like margin, padding, border-width seem to
	 * behave without any problems. Curiously, list-style works too without any
	 * special prodding.
	 */
	var shorthandPropertyExpansions = {
	  background: {
	    backgroundAttachment: true,
	    backgroundColor: true,
	    backgroundImage: true,
	    backgroundPositionX: true,
	    backgroundPositionY: true,
	    backgroundRepeat: true
	  },
	  backgroundPosition: {
	    backgroundPositionX: true,
	    backgroundPositionY: true
	  },
	  border: {
	    borderWidth: true,
	    borderStyle: true,
	    borderColor: true
	  },
	  borderBottom: {
	    borderBottomWidth: true,
	    borderBottomStyle: true,
	    borderBottomColor: true
	  },
	  borderLeft: {
	    borderLeftWidth: true,
	    borderLeftStyle: true,
	    borderLeftColor: true
	  },
	  borderRight: {
	    borderRightWidth: true,
	    borderRightStyle: true,
	    borderRightColor: true
	  },
	  borderTop: {
	    borderTopWidth: true,
	    borderTopStyle: true,
	    borderTopColor: true
	  },
	  font: {
	    fontStyle: true,
	    fontVariant: true,
	    fontWeight: true,
	    fontSize: true,
	    lineHeight: true,
	    fontFamily: true
	  },
	  outline: {
	    outlineWidth: true,
	    outlineStyle: true,
	    outlineColor: true
	  }
	};
	
	var CSSProperty = {
	  isUnitlessNumber: isUnitlessNumber,
	  shorthandPropertyExpansions: shorthandPropertyExpansions
	};
	
	exports.default = CSSProperty;

/***/ }),
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.default = clean;
	// Returns true for null, false, undefined and {}
	function isFalsy(value) {
	  return value === null || value === undefined || value === false || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && Object.keys(value).length === 0;
	}
	
	function cleanObject(object) {
	  if (isFalsy(object)) return null;
	  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') return object;
	
	  var acc = {},
	      keys = Object.keys(object),
	      hasFalsy = false;
	  for (var i = 0; i < keys.length; i++) {
	    var value = object[keys[i]];
	    var filteredValue = clean(value);
	    if (filteredValue === null || filteredValue !== value) {
	      hasFalsy = true;
	    }
	    if (filteredValue !== null) {
	      acc[keys[i]] = filteredValue;
	    }
	  }
	  return Object.keys(acc).length === 0 ? null : hasFalsy ? acc : object;
	}
	
	function cleanArray(rules) {
	  var hasFalsy = false;
	  var filtered = [];
	  rules.forEach(function (rule) {
	    var filteredRule = clean(rule);
	    if (filteredRule === null || filteredRule !== rule) {
	      hasFalsy = true;
	    }
	    if (filteredRule !== null) {
	      filtered.push(filteredRule);
	    }
	  });
	  return filtered.length == 0 ? null : hasFalsy ? filtered : rules;
	}
	
	// Takes style array or object provided by user and clears all the falsy data 
	// If there is no styles left after filtration returns null
	function clean(input) {
	  return Array.isArray(input) ? cleanArray(input) : cleanObject(input);
	}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.PluginSet = PluginSet;
	exports.fallbacks = fallbacks;
	exports.contentWrap = contentWrap;
	exports.prefixes = prefixes;
	
	var _objectAssign = __webpack_require__(13);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _CSSPropertyOperations = __webpack_require__(53);
	
	var _prefixer = __webpack_require__(63);
	
	var _prefixer2 = _interopRequireDefault(_prefixer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var isDev = function (x) {
	  return x === 'development' || !x;
	}(process.env.NODE_ENV);
	
	function PluginSet(initial) {
	  this.fns = initial || [];
	}
	
	(0, _objectAssign2.default)(PluginSet.prototype, {
	  add: function add() {
	    var _this = this;
	
	    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
	      fns[_key] = arguments[_key];
	    }
	
	    fns.forEach(function (fn) {
	      if (_this.fns.indexOf(fn) >= 0) {
	        if (isDev) {
	          console.warn('adding the same plugin again, ignoring'); //eslint-disable-line no-console
	        }
	      } else {
	        _this.fns = [fn].concat(_this.fns);
	      }
	    });
	  },
	  remove: function remove(fn) {
	    this.fns = this.fns.filter(function (x) {
	      return x !== fn;
	    });
	  },
	  clear: function clear() {
	    this.fns = [];
	  },
	  transform: function transform(o) {
	    return this.fns.reduce(function (o, fn) {
	      return fn(o);
	    }, o);
	  }
	});
	
	function fallbacks(node) {
	  var hasArray = Object.keys(node.style).map(function (x) {
	    return Array.isArray(node.style[x]);
	  }).indexOf(true) >= 0;
	  if (hasArray) {
	    var style = node.style;
	
	    var flattened = Object.keys(style).reduce(function (o, key) {
	      o[key] = Array.isArray(style[key]) ? style[key].join('; ' + (0, _CSSPropertyOperations.processStyleName)(key) + ': ') : style[key];
	      return o;
	    }, {});
	    // todo - 
	    // flatten arrays which haven't been flattened yet 
	    return (0, _objectAssign2.default)({}, node, { style: flattened });
	  }
	  return node;
	}
	
	var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit'];
	
	function contentWrap(node) {
	  if (node.style.content) {
	    var cont = node.style.content;
	    if (contentValues.indexOf(cont) >= 0) {
	      return node;
	    }
	    if (/^(attr|calc|counters?|url)\(/.test(cont)) {
	      return node;
	    }
	    if (cont.charAt(0) === cont.charAt(cont.length - 1) && (cont.charAt(0) === '"' || cont.charAt(0) === "'")) {
	      return node;
	    }
	    return _extends({}, node, { style: _extends({}, node.style, { content: '"' + cont + '"' }) });
	  }
	  return node;
	}
	
	function prefixes(node) {
	  return (0, _objectAssign2.default)({}, node, { style: (0, _prefixer2.default)(_extends({}, node.style)) });
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = prefixer;
	
	var _staticData = __webpack_require__(64);
	
	var _staticData2 = _interopRequireDefault(_staticData);
	
	var _prefixProperty = __webpack_require__(65);
	
	var _prefixProperty2 = _interopRequireDefault(_prefixProperty);
	
	var _prefixValue = __webpack_require__(67);
	
	var _prefixValue2 = _interopRequireDefault(_prefixValue);
	
	var _cursor = __webpack_require__(68);
	
	var _cursor2 = _interopRequireDefault(_cursor);
	
	var _crossFade = __webpack_require__(69);
	
	var _crossFade2 = _interopRequireDefault(_crossFade);
	
	var _filter = __webpack_require__(71);
	
	var _filter2 = _interopRequireDefault(_filter);
	
	var _flex = __webpack_require__(72);
	
	var _flex2 = _interopRequireDefault(_flex);
	
	var _flexboxOld = __webpack_require__(73);
	
	var _flexboxOld2 = _interopRequireDefault(_flexboxOld);
	
	var _gradient = __webpack_require__(74);
	
	var _gradient2 = _interopRequireDefault(_gradient);
	
	var _imageSet = __webpack_require__(75);
	
	var _imageSet2 = _interopRequireDefault(_imageSet);
	
	var _position = __webpack_require__(76);
	
	var _position2 = _interopRequireDefault(_position);
	
	var _sizing = __webpack_require__(77);
	
	var _sizing2 = _interopRequireDefault(_sizing);
	
	var _transition = __webpack_require__(78);
	
	var _transition2 = _interopRequireDefault(_transition);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var plugins = [_crossFade2.default, _cursor2.default, _filter2.default, _flexboxOld2.default, _gradient2.default, _imageSet2.default, _position2.default, _sizing2.default, _transition2.default, _flex2.default]; // custom facade for inline-style-prefixer
	
	var prefixMap = _staticData2.default.prefixMap;
	
	function prefixer(style) {
	  for (var property in style) {
	    var value = style[property];
	
	    var processedValue = (0, _prefixValue2.default)(plugins, property, value, style, prefixMap);
	
	    // only modify the value if it was touched
	    // by any plugin to prevent unnecessary mutations
	    if (processedValue) {
	      style[property] = processedValue;
	    }
	
	    (0, _prefixProperty2.default)(prefixMap, property, style);
	  }
	  return style;
	}

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var w = ["Webkit"];
	var m = ["Moz"];
	var ms = ["ms"];
	var wm = ["Webkit", "Moz"];
	var wms = ["Webkit", "ms"];
	var wmms = ["Webkit", "Moz", "ms"];
	
	exports.default = {
	  plugins: [],
	  prefixMap: { "appearance": wm, "userSelect": wmms, "textEmphasisPosition": w, "textEmphasis": w, "textEmphasisStyle": w, "textEmphasisColor": w, "boxDecorationBreak": w, "clipPath": w, "maskImage": w, "maskMode": w, "maskRepeat": w, "maskPosition": w, "maskClip": w, "maskOrigin": w, "maskSize": w, "maskComposite": w, "mask": w, "maskBorderSource": w, "maskBorderMode": w, "maskBorderSlice": w, "maskBorderWidth": w, "maskBorderOutset": w, "maskBorderRepeat": w, "maskBorder": w, "maskType": w, "textDecorationStyle": w, "textDecorationSkip": w, "textDecorationLine": w, "textDecorationColor": w, "filter": w, "fontFeatureSettings": w, "breakAfter": wmms, "breakBefore": wmms, "breakInside": wmms, "columnCount": wm, "columnFill": wm, "columnGap": wm, "columnRule": wm, "columnRuleColor": wm, "columnRuleStyle": wm, "columnRuleWidth": wm, "columns": wm, "columnSpan": wm, "columnWidth": wm, "writingMode": wms, "flex": w, "flexBasis": w, "flexDirection": w, "flexGrow": w, "flexFlow": w, "flexShrink": w, "flexWrap": w, "alignContent": w, "alignItems": w, "alignSelf": w, "justifyContent": w, "order": w, "transform": w, "transformOrigin": w, "transformOriginX": w, "transformOriginY": w, "backfaceVisibility": w, "perspective": w, "perspectiveOrigin": w, "transformStyle": w, "transformOriginZ": w, "animation": w, "animationDelay": w, "animationDirection": w, "animationFillMode": w, "animationDuration": w, "animationIterationCount": w, "animationName": w, "animationPlayState": w, "animationTimingFunction": w, "backdropFilter": w, "fontKerning": w, "scrollSnapType": wms, "scrollSnapPointsX": wms, "scrollSnapPointsY": wms, "scrollSnapDestination": wms, "scrollSnapCoordinate": wms, "shapeImageThreshold": w, "shapeImageMargin": w, "shapeImageOutside": w, "hyphens": wmms, "flowInto": wms, "flowFrom": wms, "regionFragment": wms, "textAlignLast": m, "tabSize": m, "wrapFlow": ms, "wrapThrough": ms, "wrapMargin": ms, "gridTemplateColumns": ms, "gridTemplateRows": ms, "gridTemplateAreas": ms, "gridTemplate": ms, "gridAutoColumns": ms, "gridAutoRows": ms, "gridAutoFlow": ms, "grid": ms, "gridRowStart": ms, "gridColumnStart": ms, "gridRowEnd": ms, "gridRow": ms, "gridColumn": ms, "gridColumnEnd": ms, "gridColumnGap": ms, "gridRowGap": ms, "gridArea": ms, "gridGap": ms, "textSizeAdjust": wms, "borderImage": w, "borderImageOutset": w, "borderImageRepeat": w, "borderImageSlice": w, "borderImageSource": w, "borderImageWidth": w, "transitionDelay": w, "transitionDuration": w, "transitionProperty": w, "transitionTimingFunction": w }
	};
	module.exports = exports["default"];

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = prefixProperty;
	
	var _capitalizeString = __webpack_require__(66);
	
	var _capitalizeString2 = _interopRequireDefault(_capitalizeString);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function prefixProperty(prefixProperties, property, style) {
	  if (prefixProperties.hasOwnProperty(property)) {
	    var requiredPrefixes = prefixProperties[property];
	    for (var i = 0, len = requiredPrefixes.length; i < len; ++i) {
	      style[requiredPrefixes[i] + (0, _capitalizeString2.default)(property)] = style[property];
	    }
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 66 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = capitalizeString;
	function capitalizeString(str) {
	  return str.charAt(0).toUpperCase() + str.slice(1);
	}
	module.exports = exports["default"];

/***/ }),
/* 67 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = prefixValue;
	function prefixValue(plugins, property, value, style, metaData) {
	  for (var i = 0, len = plugins.length; i < len; ++i) {
	    var processedValue = plugins[i](property, value, style, metaData);
	
	    // we can stop processing if a value is returned
	    // as all plugin criteria are unique
	    if (processedValue) {
	      return processedValue;
	    }
	  }
	}
	module.exports = exports["default"];

/***/ }),
/* 68 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = cursor;
	var prefixes = ['-webkit-', '-moz-', ''];
	
	var values = {
	  'zoom-in': true,
	  'zoom-out': true,
	  grab: true,
	  grabbing: true
	};
	
	function cursor(property, value) {
	  if (property === 'cursor' && values.hasOwnProperty(value)) {
	    return prefixes.map(function (prefix) {
	      return prefix + value;
	    });
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = crossFade;
	
	var _isPrefixedValue = __webpack_require__(70);
	
	var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// http://caniuse.com/#search=cross-fade
	var prefixes = ['-webkit-', ''];
	function crossFade(property, value) {
	  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('cross-fade(') > -1) {
	    return prefixes.map(function (prefix) {
	      return value.replace(/cross-fade\(/g, prefix + 'cross-fade(');
	    });
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 70 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isPrefixedValue;
	var regex = /-webkit-|-moz-|-ms-/;
	
	function isPrefixedValue(value) {
	  return typeof value === 'string' && regex.test(value);
	}
	module.exports = exports['default'];

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = filter;
	
	var _isPrefixedValue = __webpack_require__(70);
	
	var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// http://caniuse.com/#feat=css-filter-function
	var prefixes = ['-webkit-', ''];
	function filter(property, value) {
	  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('filter(') > -1) {
	    return prefixes.map(function (prefix) {
	      return value.replace(/filter\(/g, prefix + 'filter(');
	    });
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 72 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = flex;
	var values = {
	  flex: ['-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex'],
	  'inline-flex': ['-webkit-inline-box', '-moz-inline-box', '-ms-inline-flexbox', '-webkit-inline-flex', 'inline-flex']
	};
	
	function flex(property, value) {
	  if (property === 'display' && values.hasOwnProperty(value)) {
	    return values[value];
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 73 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = flexboxOld;
	var alternativeValues = {
	  'space-around': 'justify',
	  'space-between': 'justify',
	  'flex-start': 'start',
	  'flex-end': 'end',
	  'wrap-reverse': 'multiple',
	  wrap: 'multiple'
	};
	
	var alternativeProps = {
	  alignItems: 'WebkitBoxAlign',
	  justifyContent: 'WebkitBoxPack',
	  flexWrap: 'WebkitBoxLines'
	};
	
	function flexboxOld(property, value, style) {
	  if (property === 'flexDirection' && typeof value === 'string') {
	    if (value.indexOf('column') > -1) {
	      style.WebkitBoxOrient = 'vertical';
	    } else {
	      style.WebkitBoxOrient = 'horizontal';
	    }
	    if (value.indexOf('reverse') > -1) {
	      style.WebkitBoxDirection = 'reverse';
	    } else {
	      style.WebkitBoxDirection = 'normal';
	    }
	  }
	  if (alternativeProps.hasOwnProperty(property)) {
	    style[alternativeProps[property]] = alternativeValues[value] || value;
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = gradient;
	
	var _isPrefixedValue = __webpack_require__(70);
	
	var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prefixes = ['-webkit-', '-moz-', ''];
	
	var values = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/;
	
	function gradient(property, value) {
	  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && values.test(value)) {
	    return prefixes.map(function (prefix) {
	      return prefix + value;
	    });
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = imageSet;
	
	var _isPrefixedValue = __webpack_require__(70);
	
	var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// http://caniuse.com/#feat=css-image-set
	var prefixes = ['-webkit-', ''];
	function imageSet(property, value) {
	  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('image-set(') > -1) {
	    return prefixes.map(function (prefix) {
	      return value.replace(/image-set\(/g, prefix + 'image-set(');
	    });
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 76 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = position;
	function position(property, value) {
	  if (property === 'position' && value === 'sticky') {
	    return ['-webkit-sticky', 'sticky'];
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 77 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = sizing;
	var prefixes = ['-webkit-', '-moz-', ''];
	
	var properties = {
	  maxHeight: true,
	  maxWidth: true,
	  width: true,
	  height: true,
	  columnWidth: true,
	  minWidth: true,
	  minHeight: true
	};
	var values = {
	  'min-content': true,
	  'max-content': true,
	  'fill-available': true,
	  'fit-content': true,
	  'contain-floats': true
	};
	
	function sizing(property, value) {
	  if (properties.hasOwnProperty(property) && values.hasOwnProperty(value)) {
	    return prefixes.map(function (prefix) {
	      return prefix + value;
	    });
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = transition;
	
	var _hyphenateProperty = __webpack_require__(79);
	
	var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);
	
	var _isPrefixedValue = __webpack_require__(70);
	
	var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);
	
	var _capitalizeString = __webpack_require__(66);
	
	var _capitalizeString2 = _interopRequireDefault(_capitalizeString);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var properties = {
	  transition: true,
	  transitionProperty: true,
	  WebkitTransition: true,
	  WebkitTransitionProperty: true,
	  MozTransition: true,
	  MozTransitionProperty: true
	};
	
	
	var prefixMapping = {
	  Webkit: '-webkit-',
	  Moz: '-moz-',
	  ms: '-ms-'
	};
	
	function prefixValue(value, propertyPrefixMap) {
	  if ((0, _isPrefixedValue2.default)(value)) {
	    return value;
	  }
	
	  // only split multi values, not cubic beziers
	  var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);
	
	  for (var i = 0, len = multipleValues.length; i < len; ++i) {
	    var singleValue = multipleValues[i];
	    var values = [singleValue];
	    for (var property in propertyPrefixMap) {
	      var dashCaseProperty = (0, _hyphenateProperty2.default)(property);
	
	      if (singleValue.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== 'order') {
	        var prefixes = propertyPrefixMap[property];
	        for (var j = 0, pLen = prefixes.length; j < pLen; ++j) {
	          // join all prefixes and create a new value
	          values.unshift(singleValue.replace(dashCaseProperty, prefixMapping[prefixes[j]] + dashCaseProperty));
	        }
	      }
	    }
	
	    multipleValues[i] = values.join(',');
	  }
	
	  return multipleValues.join(',');
	}
	
	function transition(property, value, style, propertyPrefixMap) {
	  // also check for already prefixed transitions
	  if (typeof value === 'string' && properties.hasOwnProperty(property)) {
	    var outputValue = prefixValue(value, propertyPrefixMap);
	    // if the property is already prefixed
	    var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
	      return !/-moz-|-ms-/.test(val);
	    }).join(',');
	
	    if (property.indexOf('Webkit') > -1) {
	      return webkitOutput;
	    }
	
	    var mozOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
	      return !/-webkit-|-ms-/.test(val);
	    }).join(',');
	
	    if (property.indexOf('Moz') > -1) {
	      return mozOutput;
	    }
	
	    style['Webkit' + (0, _capitalizeString2.default)(property)] = webkitOutput;
	    style['Moz' + (0, _capitalizeString2.default)(property)] = mozOutput;
	    return outputValue;
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = hyphenateProperty;
	
	var _hyphenateStyleName = __webpack_require__(80);
	
	var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function hyphenateProperty(property) {
	  return (0, _hyphenateStyleName2.default)(property);
	}
	module.exports = exports['default'];

/***/ }),
/* 80 */
/***/ (function(module, exports) {

	'use strict';
	
	var uppercasePattern = /[A-Z]/g;
	var msPattern = /^ms-/;
	var cache = {};
	
	function hyphenateStyleName(string) {
	    return string in cache
	    ? cache[string]
	    : cache[string] = string
	      .replace(uppercasePattern, '-$&')
	      .toLowerCase()
	      .replace(msPattern, '-ms-');
	}
	
	module.exports = hyphenateStyleName;


/***/ }),
/* 81 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = doHash;
	// murmurhash2 via https://gist.github.com/raycmorgan/588423
	
	function doHash(str, seed) {
	  var m = 0x5bd1e995;
	  var r = 24;
	  var h = seed ^ str.length;
	  var length = str.length;
	  var currentIndex = 0;
	
	  while (length >= 4) {
	    var k = UInt32(str, currentIndex);
	
	    k = Umul32(k, m);
	    k ^= k >>> r;
	    k = Umul32(k, m);
	
	    h = Umul32(h, m);
	    h ^= k;
	
	    currentIndex += 4;
	    length -= 4;
	  }
	
	  switch (length) {
	    case 3:
	      h ^= UInt16(str, currentIndex);
	      h ^= str.charCodeAt(currentIndex + 2) << 16;
	      h = Umul32(h, m);
	      break;
	
	    case 2:
	      h ^= UInt16(str, currentIndex);
	      h = Umul32(h, m);
	      break;
	
	    case 1:
	      h ^= str.charCodeAt(currentIndex);
	      h = Umul32(h, m);
	      break;
	  }
	
	  h ^= h >>> 13;
	  h = Umul32(h, m);
	  h ^= h >>> 15;
	
	  return h >>> 0;
	}
	
	function UInt32(str, pos) {
	  return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8) + (str.charCodeAt(pos++) << 16) + (str.charCodeAt(pos) << 24);
	}
	
	function UInt16(str, pos) {
	  return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8);
	}
	
	function Umul32(n, m) {
	  n = n | 0;
	  m = m | 0;
	  var nlo = n & 0xffff;
	  var nhi = n >>> 16;
	  var res = nlo * m + ((nhi * m & 0xffff) << 16) | 0;
	  return res;
	}

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;
	
	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };
	
	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(39)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(83)();
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var emptyFunction = __webpack_require__(18);
	var invariant = __webpack_require__(21);
	var ReactPropTypesSecret = __webpack_require__(40);
	
	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    invariant(
	      false,
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,
	
	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };
	
	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	
	  return ReactPropTypes;
	};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (_ref) {
	  var theme = _ref.theme;
	
	  return {
	    boxSizing: 'border-box',
	    color: theme.color_text,
	    fontFamily: theme.fontFamily ? theme.fontFamily + ', ' + theme.fontFamily_system : '' + theme.fontFamily_system,
	    fontSize: theme.fontSize_base + 'px',
	    lineHeight: theme.lineHeight,
	    outline: 0,
	    '& *,& *::before,& *::after': {
	      boxSizing: 'inherit'
	    },
	    MozOsxFontSmoothing: 'auto',
	    WebkitFontSmoothing: 'antialiased'
	  };
	};

/***/ }),
/* 85 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getNormalizedValue;
	
	/**
	  * Helper to normalize a theme variable (defined in ems) against the applied
	  * fontSize (also defined in ems), so that the resulting value renders correctly
	  */
	function getNormalizedValue(value, base) {
	  return parseFloat(value) / parseFloat(base) + "em";
	}

/***/ }),
/* 86 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = getResponsiveStyles;
	
	
	/*
	 * Converts an array of breakpoints (numbers and theme variable keys) to an
	 * array of CSS media query strings.
	 *
	 * Input: [100, 200]
	 *
	 * Ouput: [
	 *   '@media (min-width: 100px) and (max-width: 199px)',
	 *   '@media (min-width: 200px)'
	 * ]
	 */
	var getMediaQueries = function getMediaQueries(breakpoints, theme) {
	  var queries = [];
	
	  var getQueryWidth = function getQueryWidth(value) {
	    return typeof value === 'number' ? value : theme['breakpoint_' + value];
	  };
	
	  for (var i = 0; i <= breakpoints.length; i++) {
	    if (i === breakpoints.length) {
	      queries.push('@media (min-width: ' + getQueryWidth(breakpoints[i - 1]) + 'px)');
	    } else if (i > 0) {
	      queries.push('@media (min-width: ' + getQueryWidth(breakpoints[i - 1]) + 'px) and (max-width: ' + (getQueryWidth(breakpoints[i]) - 1) + 'px)');
	    }
	  }
	
	  return queries;
	};
	
	/*
	 * Given array that can contain null values and an index, checks if array[index]
	 * is null. If it is, then it returns the next-most-previous non-null value in
	 * the array until it gets to array[0], which it returns regardless.
	 */
	
	var getPrevNonNull = function getPrevNonNull(values, index) {
	  var value = Array.isArray(values) && values[index];
	  if (index > 0) {
	    return value === null ? getPrevNonNull(values, index - 1) : value;
	  } else {
	    return value;
	  }
	};
	
	/*
	 * Returns an object of style properties and their values (as interpreted
	 * through mapValueToProperty, if provided). If an index is provided, then each
	 * style property is an array, and this will use array[index] as the value.
	 */
	var getStyles = function getStyles(styleKeys, styles, mapValueToProperty, index) {
	  return styleKeys.reduce(function (acc, property) {
	    var indexInUse = index || 0;
	    var styleValue = styles[property];
	    var actualValue = Array.isArray(styleValue) ? getPrevNonNull(styleValue, indexInUse) : styleValue;
	    acc[property] = mapValueToProperty ? mapValueToProperty(property, actualValue) : actualValue;
	
	    return acc;
	  }, {});
	};
	
	/*
	 * Helper to potentially disperse an object of style properties (whole values
	 * can be an array) across a provided (optional) array of breakpoints, which is
	 * converted to an object with CSS media query string keys.
	 *
	 * See tests for input/output.
	 */
	function getResponsiveStyles(_ref) {
	  var breakpoints = _ref.breakpoints,
	      mapValueToProperty = _ref.mapValueToProperty,
	      styles = _ref.styles,
	      theme = _ref.theme;
	
	  var styleKeys = Object.keys(styles);
	
	  if (breakpoints) {
	    var breakpointsLength = breakpoints.length;
	    var mediaQueries = getMediaQueries(breakpoints, theme);
	    var responsiveStyleKeys = styleKeys.filter(function (key) {
	      var value = styles[key];
	      if (value && Array.isArray(value)) {
	        /*
	         * If a style property is an array, that array must be one longer than
	         * the breakpoints array. The first value is the no-breakpoint case, the
	         * second value corresponds to the first breakpoint, etc...
	         */
	        if (value.length === breakpointsLength + 1) {
	          return true;
	        } else {
	          // prettier-ignore
	          throw new Error(key + '.length (' + value.length + ') must equal breakpoints.length + 1 (' + (breakpointsLength + 1) + ')');
	        }
	      }
	    });
	    var nonResponsiveStyleKeys = styleKeys.filter(function (key) {
	      return !Array.isArray(styles[key]);
	    });
	
	    // Start with the non-responsive style properties and the first value of the
	    // responsive properties.
	    var result = _extends({}, getStyles(nonResponsiveStyleKeys, styles, mapValueToProperty), getStyles(responsiveStyleKeys, styles, mapValueToProperty, 0));
	
	    return mediaQueries.reduce(function (acc, query, index) {
	      acc[query] = _extends({}, getStyles(responsiveStyleKeys, styles, mapValueToProperty, index + 1));
	      return acc;
	    }, result);
	  } else {
	    return getStyles(styleKeys, styles, mapValueToProperty);
	  }
	}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = pxToEm;
	
	var _fontSizeBase = __webpack_require__(88);
	
	var _fontSizeBase2 = _interopRequireDefault(_fontSizeBase);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function pxToEm(value) {
	  return value / _fontSizeBase2.default + 'em';
	}
	/**
	  * Helper to convert a px value to ems, relative to the base font size
	  */

/***/ }),
/* 88 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// Components are built on an 8px grid
	exports.default = 16;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconChevronRight;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Icon = __webpack_require__(90);
	
	var _Icon2 = _interopRequireDefault(_Icon);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconChevronRight(props) {
	  var iconProps = _extends({
	    rtl: true
	  }, props);
	
	  return _react2.default.createElement(
	    _Icon2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconChevronRight.propTypes = {
	  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf(['small']), _propTypes2.default.oneOf(['medium']), _propTypes2.default.oneOf(['large'])]),
	  color: _propTypes2.default.string,
	  rtl: _propTypes2.default.bool,
	  title: _propTypes2.default.string
	};
	IconChevronRight.displayName = 'IconChevronRight';
	IconChevronRight.category = 'navigation';

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Icon = __webpack_require__(91);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Icon).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _utils = __webpack_require__(92);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    Icon_fill: baseTheme.color_gray_60,
	    Icon_size_small: (0, _styles.pxToEm)(12),
	    Icon_size_medium: (0, _styles.pxToEm)(16),
	    Icon_size_large: (0, _styles.pxToEm)(20)
	  }, baseTheme);
	};
	
	var iconStyles = function iconStyles(_ref) {
	  var color = _ref.color,
	      rtl = _ref.rtl,
	      size = _ref.size,
	      baseTheme = _ref.theme;
	
	  var theme = componentTheme(baseTheme);
	
	  return {
	    fill: color || theme.Icon_fill,
	    fontSize: theme.fontSize_base,
	    height: theme['Icon_size_' + size] || size,
	    transform: theme.direction === 'rtl' && rtl && 'scaleX(-1)',
	    width: theme['Icon_size_' + size] || size
	  };
	};
	
	var Root = (0, _styles.createStyledComponent)('svg', iconStyles, { rootEl: 'svg' });
	
	/**
	 * Icons use graphical symbols to represent an object or concept in your UI.
	 * They can be used to aid comprehension of core actions in your app, and to provide feedback for user input.
	 *
	 * The Icon component allows you to use your own SVG to easily create an icon.
	 *
	 * In addition to the generic Icon component, Mineral UI provides a large number of
	 * pre-built Icon components, available separately in the [mineral-ui-icons](https://www.npmjs.com/package/mineral-ui-icons) package.
	 */
	
	var Icon = function (_Component) {
	  _inherits(Icon, _Component);
	
	  function Icon() {
	    var _ref2;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Icon);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Icon.__proto__ || Object.getPrototypeOf(Icon)).call.apply(_ref2, [this].concat(args))), _this), _this.id = 'icon-' + (0, _utils.generateId)(), _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Icon, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          title = _props.title,
	          children = _props.children,
	          restProps = _objectWithoutProperties(_props, ['title', 'children']);
	
	      var titleElementId = 'icon-title-' + this.id;
	      var rootProps = _extends({
	        'aria-hidden': title ? null : true,
	        'aria-labelledby': title && titleElementId,
	        role: 'img',
	        viewBox: '0 0 24 24'
	      }, restProps);
	
	      var titleProps = {
	        id: titleElementId
	      };
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        title && _react2.default.createElement(
	          'title',
	          titleProps,
	          title
	        ),
	        children
	      );
	    }
	  }]);
	
	  return Icon;
	}(_react.Component);
	
	Icon.propTypes = {
	  /** Available sizes, including custom - e.g. '5em' or '20px' */
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large']), __webpack_require__(82).string]),
	
	  /** SVG content, required for the generic Icon component */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Fill color, defaults to theme.color_gray_60 */
	  color: __webpack_require__(82).string,
	
	  /** Flip the Icon horizontally when used with RTL languages */
	  rtl: __webpack_require__(82).bool,
	
	  /** Alternative text */
	  title: __webpack_require__(82).string
	};
	Icon.displayName = 'Icon';
	Icon.defaultProps = {
	  size: 'medium'
	};
	exports.default = Icon;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _generateId = __webpack_require__(93);
	
	Object.defineProperty(exports, 'generateId', {
	  enumerable: true,
	  get: function get() {
	    return _generateId.generateId;
	  }
	});
	Object.defineProperty(exports, 'resetId', {
	  enumerable: true,
	  get: function get() {
	    return _generateId.resetId;
	  }
	});
	
	var _composeEventHandlers = __webpack_require__(94);
	
	Object.defineProperty(exports, 'composeEventHandlers', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_composeEventHandlers).default;
	  }
	});
	
	var _composePropsWithGetter = __webpack_require__(95);
	
	Object.defineProperty(exports, 'composePropsWithGetter', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_composePropsWithGetter).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.generateId = generateId;
	exports.resetId = resetId;
	var currentId = 0;
	
	function generateId() {
	  currentId += 1;
	  return currentId.toString();
	}
	
	function resetId() {
	  currentId = 0;
	}

/***/ }),
/* 94 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = composeEventHandlers;
	function composeEventHandlers() {
	  for (var _len = arguments.length, handlers = Array(_len), _key = 0; _key < _len; _key++) {
	    handlers[_key] = arguments[_key];
	  }
	
	  var fns = handlers.filter(function (fn) {
	    return Boolean(fn);
	  });
	
	  if (fns.length === 0) {
	    return undefined;
	  } else if (fns.length === 1) {
	    return fns[0];
	  } else {
	    return function (event) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }
	
	      return fns.some(function (fn) {
	        fn.apply(undefined, [event].concat(args));
	        return event.defaultPrevented;
	      });
	    };
	  }
	}

/***/ }),
/* 95 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = composePropsWithGetter;
	function composePropsWithGetter(props, getter, scope) {
	  return _extends({}, props, getter && getter(props, scope));
	}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconChevronLeft;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Icon = __webpack_require__(90);
	
	var _Icon2 = _interopRequireDefault(_Icon);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconChevronLeft(props) {
	  var iconProps = _extends({
	    rtl: true
	  }, props);
	
	  return _react2.default.createElement(
	    _Icon2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconChevronLeft.propTypes = {
	  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf(['small']), _propTypes2.default.oneOf(['medium']), _propTypes2.default.oneOf(['large'])]),
	  color: _propTypes2.default.string,
	  rtl: _propTypes2.default.bool,
	  title: _propTypes2.default.string
	};
	IconChevronLeft.displayName = 'IconChevronLeft';
	IconChevronLeft.category = 'navigation';

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(98);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!./calendar-control.css", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!./calendar-control.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, "\n.calendar-control {\n  margin-left: 3rem;\n}\n\n.cal-control-text {\n  margin: 0 2rem 0 1rem;\n  font-size: large;\n}\n\n/*.cal-back-arrow {*/\n/*  background: url('/kuba_arrow_back.png') no-repeat;*/\n/*  background-size: contain;*/\n/*}\n*/\n\n.cal-arrows {\n  max-width: 3rem;\n  height: auto;\n}\n\n.cal-arrows:hover {\n  box-shadow: 0 5px #666;\n}\n\n.cal-arrows:active {\n  transform: translateY(4px);\n}\n\n.calendar-control > span.picker {\n  margin-left: 1rem;\n}", ""]);
	
	// exports


/***/ }),
/* 99 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function(useSourceMap) {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if(item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};
	
	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}
	
		if (useSourceMap && typeof btoa === 'function') {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
			});
	
			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}
	
		return [content].join('\n');
	}
	
	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
		// eslint-disable-next-line no-undef
		var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
		var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
	
		return '/*# ' + data + ' */';
	}


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			// Test for IE <= 9 as proposed by Browserhacks
			// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
			// Tests for existence of standard globals is to allow style-loader 
			// to operate correctly into non-standard environments
			// @see https://github.com/webpack-contrib/style-loader/issues/177
			return window && document && document.all && !window.atob;
		}),
		getElement = (function(fn) {
			var memo = {};
			return function(selector) {
				if (typeof memo[selector] === "undefined") {
					memo[selector] = fn.call(this, selector);
				}
				return memo[selector]
			};
		})(function (styleTarget) {
			return document.querySelector(styleTarget)
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [],
		fixUrls = __webpack_require__(101);
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		options.attrs = typeof options.attrs === "object" ? options.attrs : {};
	
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the <head> element
		if (typeof options.insertInto === "undefined") options.insertInto = "head";
	
		// By default, add <style> tags to the bottom of the target
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	};
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var styleTarget = getElement(options.insertInto)
		if (!styleTarget) {
			throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
		}
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				styleTarget.insertBefore(styleElement, styleTarget.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				styleTarget.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			styleTarget.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		options.attrs.type = "text/css";
	
		attachTagAttrs(styleElement, options.attrs);
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		options.attrs.type = "text/css";
		options.attrs.rel = "stylesheet";
	
		attachTagAttrs(linkElement, options.attrs);
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function attachTagAttrs(element, attrs) {
		Object.keys(attrs).forEach(function (key) {
			element.setAttribute(key, attrs[key]);
		});
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement, options);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, options, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
		*/
		var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;
	
		if (options.convertToAbsoluteUrls || autoFixUrls){
			css = fixUrls(css);
		}
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 101 */
/***/ (function(module, exports) {

	
	/**
	 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
	 * embed the css on the page. This breaks all relative urls because now they are relative to a
	 * bundle instead of the current page.
	 *
	 * One solution is to only use full urls, but that may be impossible.
	 *
	 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
	 *
	 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
	 *
	 */
	
	module.exports = function (css) {
	  // get current location
	  var location = typeof window !== "undefined" && window.location;
	
	  if (!location) {
	    throw new Error("fixUrls requires window.location");
	  }
	
		// blank or null?
		if (!css || typeof css !== "string") {
		  return css;
	  }
	
	  var baseUrl = location.protocol + "//" + location.host;
	  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");
	
		// convert each url(...)
		/*
		This regular expression is just a way to recursively match brackets within
		a string.
	
		 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
		   (  = Start a capturing group
		     (?:  = Start a non-capturing group
		         [^)(]  = Match anything that isn't a parentheses
		         |  = OR
		         \(  = Match a start parentheses
		             (?:  = Start another non-capturing groups
		                 [^)(]+  = Match anything that isn't a parentheses
		                 |  = OR
		                 \(  = Match a start parentheses
		                     [^)(]*  = Match anything that isn't a parentheses
		                 \)  = Match a end parentheses
		             )  = End Group
	              *\) = Match anything and then a close parens
	          )  = Close non-capturing group
	          *  = Match anything
	       )  = Close capturing group
		 \)  = Match a close parens
	
		 /gi  = Get all matches, not the first.  Be case insensitive.
		 */
		var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
			// strip quotes (if they exist)
			var unquotedOrigUrl = origUrl
				.trim()
				.replace(/^"(.*)"$/, function(o, $1){ return $1; })
				.replace(/^'(.*)'$/, function(o, $1){ return $1; });
	
			// already a full url? no change
			if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			  return fullMatch;
			}
	
			// convert the url to a full url
			var newUrl;
	
			if (unquotedOrigUrl.indexOf("//") === 0) {
			  	//TODO: should we add protocol?
				newUrl = unquotedOrigUrl;
			} else if (unquotedOrigUrl.indexOf("/") === 0) {
				// path should be relative to the base url
				newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
			} else {
				// path should be relative to current directory
				newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
			}
	
			// send back the fixed url(...)
			return "url(" + JSON.stringify(newUrl) + ")";
		});
	
		// send back the fixed css
		return fixedCss;
	};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactCalendar = __webpack_require__(103);
	
	var _reactCalendar2 = _interopRequireDefault(_reactCalendar);
	
	var _Popover = __webpack_require__(133);
	
	var _Popover2 = _interopRequireDefault(_Popover);
	
	var _Button = __webpack_require__(46);
	
	var _Button2 = _interopRequireDefault(_Button);
	
	var _IconDateRange = __webpack_require__(534);
	
	var _IconDateRange2 = _interopRequireDefault(_IconDateRange);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CalendarPicker = function (_React$Component) {
	    _inherits(CalendarPicker, _React$Component);
	
	    function CalendarPicker() {
	        _classCallCheck(this, CalendarPicker);
	
	        return _possibleConstructorReturn(this, (CalendarPicker.__proto__ || Object.getPrototypeOf(CalendarPicker)).apply(this, arguments));
	    }
	
	    _createClass(CalendarPicker, [{
	        key: 'render',
	        value: function render() {
	            var calIcon = _react2.default.createElement(_IconDateRange2.default, null);
	            return _react2.default.createElement(
	                _Popover2.default,
	                { content: _react2.default.createElement(_reactCalendar2.default, null) },
	                _react2.default.createElement(_Button2.default, { iconStart: calIcon })
	            );
	        }
	    }]);
	
	    return CalendarPicker;
	}(_react2.default.Component);
	
	exports.default = CalendarPicker;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.MonthView = exports.YearView = exports.DecadeView = exports.CenturyView = exports.Calendar = undefined;
	
	var _Calendar = __webpack_require__(104);
	
	var _Calendar2 = _interopRequireDefault(_Calendar);
	
	var _CenturyView = __webpack_require__(112);
	
	var _CenturyView2 = _interopRequireDefault(_CenturyView);
	
	var _DecadeView = __webpack_require__(119);
	
	var _DecadeView2 = _interopRequireDefault(_DecadeView);
	
	var _YearView = __webpack_require__(122);
	
	var _YearView2 = _interopRequireDefault(_YearView);
	
	var _MonthView = __webpack_require__(125);
	
	var _MonthView2 = _interopRequireDefault(_MonthView);
	
	__webpack_require__(131);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _Calendar2.default;
	exports.Calendar = _Calendar2.default;
	exports.CenturyView = _CenturyView2.default;
	exports.DecadeView = _DecadeView2.default;
	exports.YearView = _YearView2.default;
	exports.MonthView = _MonthView2.default;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _mergeClassNames = __webpack_require__(105);
	
	var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);
	
	var _Navigation = __webpack_require__(106);
	
	var _Navigation2 = _interopRequireDefault(_Navigation);
	
	var _CenturyView = __webpack_require__(112);
	
	var _CenturyView2 = _interopRequireDefault(_CenturyView);
	
	var _DecadeView = __webpack_require__(119);
	
	var _DecadeView2 = _interopRequireDefault(_DecadeView);
	
	var _YearView = __webpack_require__(122);
	
	var _YearView2 = _interopRequireDefault(_YearView);
	
	var _MonthView = __webpack_require__(125);
	
	var _MonthView2 = _interopRequireDefault(_MonthView);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	var _utils = __webpack_require__(116);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var allViews = ['century', 'decade', 'year', 'month'];
	var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ['day']);
	
	var datesAreDifferent = function datesAreDifferent(date1, date2) {
	  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1.getTime() !== date2.getTime();
	};
	
	var Calendar = function (_Component) {
	  _inherits(Calendar, _Component);
	
	  function Calendar() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Calendar);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call.apply(_ref, [this].concat(args))), _this), _this.getValueFrom = function (value) {
	      if (!value) {
	        return null;
	      }
	
	      var _this$props = _this.props,
	          maxDate = _this$props.maxDate,
	          minDate = _this$props.minDate;
	
	      var rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;
	      var valueFromDate = new Date(rawValueFrom);
	
	      if (isNaN(valueFromDate.getTime())) {
	        throw new Error('Invalid date: ' + value);
	      }
	
	      var valueFrom = (0, _dates.getBegin)(_this.valueType, valueFromDate);
	
	      return (0, _utils.between)(valueFrom, minDate, maxDate);
	    }, _this.getValueTo = function (value) {
	      if (!value) {
	        return null;
	      }
	
	      var _this$props2 = _this.props,
	          maxDate = _this$props2.maxDate,
	          minDate = _this$props2.minDate;
	
	      var rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;
	      var valueToDate = new Date(rawValueTo);
	
	      if (isNaN(valueToDate.getTime())) {
	        throw new Error('Invalid date: ' + value);
	      }
	
	      var valueTo = (0, _dates.getEnd)(_this.valueType, valueToDate);
	
	      return (0, _utils.between)(valueTo, minDate, maxDate);
	    }, _this.state = {
	      activeStartDate: _this.getActiveStartDate(),
	      hover: null,
	      view: _this.getView(),
	      value: _this.props.value
	    }, _this.setActiveStartDate = function (activeStartDate) {
	      _this.setState({ activeStartDate: activeStartDate }, function () {
	        (0, _utils.callIfDefined)(_this.props.onActiveDateChange, {
	          activeStartDate: activeStartDate,
	          view: _this.state.view
	        });
	      });
	    }, _this.drillDown = function (activeStartDate) {
	      if (!_this.drillDownAvailable) {
	        return;
	      }
	
	      var views = _this.getLimitedViews();
	
	      _this.setState(function (prevState) {
	        var nextView = views[views.indexOf(prevState.view) + 1];
	        return {
	          activeStartDate: activeStartDate,
	          view: nextView
	        };
	      }, function () {
	        (0, _utils.callIfDefined)(_this.props.onDrillDown, {
	          activeStartDate: activeStartDate,
	          view: _this.state.view
	        });
	      });
	    }, _this.drillUp = function () {
	      if (!_this.drillUpAvailable) {
	        return;
	      }
	
	      var views = _this.getLimitedViews();
	
	      _this.setState(function (prevState) {
	        var nextView = views[views.indexOf(prevState.view) - 1];
	        var activeStartDate = (0, _dates.getBegin)(nextView, prevState.activeStartDate);
	
	        return {
	          activeStartDate: activeStartDate,
	          view: nextView
	        };
	      }, function () {
	        (0, _utils.callIfDefined)(_this.props.onDrillUp, {
	          activeStartDate: _this.state.activeStartDate,
	          view: _this.state.view
	        });
	      });
	    }, _this.onChange = function (value) {
	      var _this$props3 = _this.props,
	          onChange = _this$props3.onChange,
	          selectRange = _this$props3.selectRange;
	
	
	      var nextValue = void 0;
	      var callback = void 0;
	      if (selectRange) {
	        var previousValue = _this.state.value;
	        // Range selection turned on
	
	        if (!previousValue || [].concat(previousValue).length !== 1 // 0 or 2 - either way we're starting a new array
	        ) {
	            // First value
	            nextValue = (0, _dates.getBegin)(_this.valueType, value);
	          } else {
	          // Second value
	          nextValue = (0, _dates.getValueRange)(_this.valueType, previousValue, value);
	          callback = function callback() {
	            return (0, _utils.callIfDefined)(onChange, nextValue);
	          };
	        }
	      } else {
	        // Range selection turned off
	        nextValue = _this.getProcessedValue(value);
	        callback = function callback() {
	          return (0, _utils.callIfDefined)(onChange, nextValue);
	        };
	      }
	
	      _this.setState({ value: nextValue }, callback);
	    }, _this.onMouseOver = function (value) {
	      _this.setState({ hover: value });
	    }, _this.onMouseOut = function () {
	      _this.setState({ hover: null });
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Calendar, [{
	    key: 'getValueArray',
	    value: function getValueArray(value) {
	      if (value instanceof Array) {
	        return value;
	      }
	
	      return [this.getValueFrom(value), this.getValueTo(value)];
	    }
	  }, {
	    key: 'getLimitedViews',
	
	
	    /**
	     * Returns views array with disallowed values cut off.
	     */
	    value: function getLimitedViews() {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
	      var minDetail = props.minDetail,
	          maxDetail = props.maxDetail;
	
	
	      return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
	    }
	
	    /**
	     * Determines whether a given view is allowed with currently applied settings.
	     */
	
	  }, {
	    key: 'isViewAllowed',
	    value: function isViewAllowed() {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
	      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.view;
	
	      var views = this.getLimitedViews(props);
	
	      return views.indexOf(view) !== -1;
	    }
	
	    /**
	     * Gets current value in a desired format.
	     */
	
	  }, {
	    key: 'getProcessedValue',
	    value: function getProcessedValue(value) {
	      var returnValue = this.props.returnValue;
	
	
	      switch (returnValue) {
	        case 'start':
	          return this.getValueFrom(value);
	        case 'end':
	          return this.getValueTo(value);
	        case 'range':
	          return this.getValueArray(value);
	        default:
	          throw new Error('Invalid returnValue.');
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var nextValue = nextProps.value;
	      var value = this.state.value;
	
	
	      var nextState = {};
	
	      var allowedViewChanged = nextProps.minDetail !== this.props.minDetail || nextProps.maxDetail !== this.props.maxDetail;
	
	      if (allowedViewChanged && !this.isViewAllowed(nextProps)) {
	        nextState.view = this.getView(nextProps);
	      }
	
	      if (allowedViewChanged || datesAreDifferent.apply(undefined, _toConsumableArray([nextValue, value].map(this.getValueFrom))) || datesAreDifferent.apply(undefined, _toConsumableArray([nextValue, value].map(this.getValueTo)))) {
	        nextState.value = nextValue;
	      }
	
	      nextState.activeStartDate = this.getActiveStartDate(nextProps);
	
	      if (!nextProps.selectRange && this.props.selectRange) {
	        nextState.hover = null;
	      }
	
	      this.setState(nextState);
	    }
	  }, {
	    key: 'getActiveStartDate',
	    value: function getActiveStartDate() {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
	
	      var rangeType = this.getView(props);
	      var valueFrom = this.getValueFrom(props.value) || props.activeStartDate || new Date();
	      return (0, _dates.getBegin)(rangeType, valueFrom);
	    }
	  }, {
	    key: 'getView',
	    value: function getView() {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
	      var view = props.view;
	
	
	      if (view && this.getLimitedViews(props).indexOf(view) !== -1) {
	        return view;
	      }
	
	      return this.getLimitedViews(props).pop();
	    }
	
	    /**
	     * Called when the user uses navigation buttons.
	     */
	
	  }, {
	    key: 'renderContent',
	    value: function renderContent() {
	      var _props = this.props,
	          calendarType = _props.calendarType,
	          locale = _props.locale,
	          maxDate = _props.maxDate,
	          minDate = _props.minDate,
	          renderChildren = _props.renderChildren,
	          tileClassName = _props.tileClassName,
	          tileContent = _props.tileContent,
	          tileDisabled = _props.tileDisabled;
	      var _state = this.state,
	          activeStartDate = _state.activeStartDate,
	          hover = _state.hover,
	          value = _state.value,
	          view = _state.view;
	      var onMouseOver = this.onMouseOver,
	          valueType = this.valueType;
	
	
	      var commonProps = {
	        activeStartDate: activeStartDate,
	        hover: hover,
	        locale: locale,
	        maxDate: maxDate,
	        minDate: minDate,
	        onMouseOver: this.props.selectRange ? onMouseOver : null,
	        tileClassName: tileClassName,
	        tileContent: tileContent || renderChildren, // For backwards compatibility
	        tileDisabled: tileDisabled,
	        value: value,
	        valueType: valueType
	      };
	
	      var clickAction = this.drillDownAvailable ? this.drillDown : this.onChange;
	
	      switch (view) {
	        case 'century':
	          return _react2.default.createElement(_CenturyView2.default, _extends({
	            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickDecade)
	          }, commonProps));
	        case 'decade':
	          return _react2.default.createElement(_DecadeView2.default, _extends({
	            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickYear)
	          }, commonProps));
	        case 'year':
	          return _react2.default.createElement(_YearView2.default, _extends({
	            formatMonth: this.props.formatMonth,
	            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickMonth)
	          }, commonProps));
	        case 'month':
	          return _react2.default.createElement(_MonthView2.default, _extends({
	            calendarType: calendarType,
	            formatShortWeekday: this.props.formatShortWeekday,
	            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickDay),
	            onClickWeekNumber: this.props.onClickWeekNumber,
	            showNeighboringMonth: this.props.showNeighboringMonth,
	            showWeekNumbers: this.props.showWeekNumbers
	          }, commonProps));
	        default:
	          throw new Error('Invalid view: ' + view + '.');
	      }
	    }
	  }, {
	    key: 'renderNavigation',
	    value: function renderNavigation() {
	      var showNavigation = this.props.showNavigation;
	
	
	      if (!showNavigation) {
	        return null;
	      }
	
	      return _react2.default.createElement(_Navigation2.default, {
	        activeRange: this.state.activeRange,
	        activeStartDate: this.state.activeStartDate,
	        drillUp: this.drillUp,
	        formatMonthYear: this.props.formatMonthYear,
	        locale: this.props.locale,
	        maxDate: this.props.maxDate,
	        minDate: this.props.minDate,
	        next2Label: this.props.next2Label,
	        nextLabel: this.props.nextLabel,
	        prev2Label: this.props.prev2Label,
	        prevLabel: this.props.prevLabel,
	        setActiveStartDate: this.setActiveStartDate,
	        view: this.state.view,
	        views: this.getLimitedViews()
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props,
	          className = _props2.className,
	          selectRange = _props2.selectRange;
	      var value = this.state.value;
	      var onMouseOut = this.onMouseOut;
	
	      var valueArray = [].concat(value);
	
	      return _react2.default.createElement(
	        'div',
	        {
	          className: (0, _mergeClassNames2.default)('react-calendar', selectRange && valueArray.length === 1 && 'react-calendar--selectRange', className),
	          onMouseOut: selectRange ? onMouseOut : null,
	          onBlur: selectRange ? onMouseOut : null
	        },
	        this.renderNavigation(),
	        this.renderContent()
	      );
	    }
	  }, {
	    key: 'drillDownAvailable',
	    get: function get() {
	      var views = this.getLimitedViews();
	      var view = this.state.view;
	
	
	      return views.indexOf(view) < views.length - 1;
	    }
	  }, {
	    key: 'drillUpAvailable',
	    get: function get() {
	      var views = this.getLimitedViews();
	      var view = this.state.view;
	
	
	      return views.indexOf(view) > 0;
	    }
	
	    /**
	     * Returns value type that can be returned with currently applied settings.
	     */
	
	  }, {
	    key: 'valueType',
	    get: function get() {
	      var maxDetail = this.props.maxDetail;
	
	      return allValueTypes[allViews.indexOf(maxDetail)];
	    }
	  }]);
	
	  return Calendar;
	}(_react.Component);
	
	exports.default = Calendar;
	
	
	Calendar.defaultProps = {
	  maxDetail: 'month',
	  minDetail: 'century',
	  returnValue: 'start',
	  showNavigation: true,
	  showNeighboringMonth: true,
	  view: 'month'
	};
	
	Calendar.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date),
	  calendarType: _propTypes3.isCalendarType,
	  className: _propTypes3.isClassName,
	  formatMonth: _propTypes2.default.func,
	  formatMonthYear: _propTypes2.default.func,
	  formatShortWeekday: _propTypes2.default.func,
	  locale: _propTypes2.default.string,
	  maxDate: _propTypes3.isMaxDate,
	  maxDetail: _propTypes2.default.oneOf(allViews),
	  minDate: _propTypes3.isMinDate,
	  minDetail: _propTypes2.default.oneOf(allViews),
	  next2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  nextLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  onActiveDateChange: _propTypes2.default.func,
	  onChange: _propTypes2.default.func,
	  onClickDay: _propTypes2.default.func,
	  onClickDecade: _propTypes2.default.func,
	  onClickMonth: _propTypes2.default.func,
	  onClickWeekNumber: _propTypes2.default.func,
	  onClickYear: _propTypes2.default.func,
	  onDrillDown: _propTypes2.default.func,
	  onDrillUp: _propTypes2.default.func,
	  prev2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  prevLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  renderChildren: _propTypes2.default.func, // For backwards compatibility
	  returnValue: _propTypes2.default.oneOf(['start', 'end', 'range']),
	  selectRange: _propTypes2.default.bool,
	  showNavigation: _propTypes2.default.bool,
	  showNeighboringMonth: _propTypes2.default.bool,
	  showWeekNumbers: _propTypes2.default.bool,
	  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes3.isClassName]),
	  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
	  tileDisabled: _propTypes2.default.func,
	  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes3.isValue]),
	  view: _propTypes2.default.oneOf(allViews)
	};

/***/ }),
/* 105 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var mergeClassNames = function mergeClassNames() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  return args.reduce(function (classList, arg) {
	    return typeof arg === 'string' || arg instanceof Array ? classList.concat(arg) : classList;
	  }, []).filter(function (className) {
	    return className;
	  }).join(' ');
	};
	
	exports.default = mergeClassNames;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _dates = __webpack_require__(107);
	
	var _dateFormatter = __webpack_require__(108);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Navigation = function (_Component) {
	  _inherits(Navigation, _Component);
	
	  function Navigation() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Navigation);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Navigation.__proto__ || Object.getPrototypeOf(Navigation)).call.apply(_ref, [this].concat(args))), _this), _this.onClickPrevious = function () {
	      var _this$props = _this.props,
	          date = _this$props.activeStartDate,
	          view = _this$props.view,
	          setActiveStartDate = _this$props.setActiveStartDate;
	
	      setActiveStartDate((0, _dates.getBeginPrevious)(view, date));
	    }, _this.onClickNext = function () {
	      var _this$props2 = _this.props,
	          date = _this$props2.activeStartDate,
	          view = _this$props2.view,
	          setActiveStartDate = _this$props2.setActiveStartDate;
	
	      setActiveStartDate((0, _dates.getBeginNext)(view, date));
	    }, _this.onClickPrevious2 = function () {
	      var _this$props3 = _this.props,
	          date = _this$props3.activeStartDate,
	          view = _this$props3.view,
	          setActiveStartDate = _this$props3.setActiveStartDate;
	
	      setActiveStartDate((0, _dates.getBeginPrevious2)(view, date));
	    }, _this.onClickNext2 = function () {
	      var _this$props4 = _this.props,
	          date = _this$props4.activeStartDate,
	          view = _this$props4.view,
	          setActiveStartDate = _this$props4.setActiveStartDate;
	
	      setActiveStartDate((0, _dates.getBeginNext2)(view, date));
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Navigation, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      return nextProps.activeStartDate !== this.props.activeStartDate || nextProps.view !== this.props.view;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var label = this.label;
	      var _props = this.props,
	          drillUp = _props.drillUp,
	          view = _props.view;
	
	
	      var className = 'react-calendar__navigation';
	
	      return _react2.default.createElement(
	        'div',
	        {
	          className: className,
	          style: { display: 'flex' }
	        },
	        view !== 'century' && _react2.default.createElement(
	          'button',
	          {
	            className: className + '__arrow ' + className + '__prev2-button',
	            disabled: this.prev2ButtonDisabled,
	            onClick: this.onClickPrevious2,
	            type: 'button'
	          },
	          this.props.prev2Label
	        ),
	        _react2.default.createElement(
	          'button',
	          {
	            className: className + '__arrow ' + className + '__prev-button',
	            disabled: this.prevButtonDisabled,
	            onClick: this.onClickPrevious,
	            type: 'button'
	          },
	          this.props.prevLabel
	        ),
	        _react2.default.createElement(
	          'button',
	          {
	            className: 'react-calendar__navigation__label',
	            onClick: drillUp,
	            disabled: !this.drillUpAvailable,
	            style: { flexGrow: 1 },
	            type: 'button'
	          },
	          label
	        ),
	        _react2.default.createElement(
	          'button',
	          {
	            className: className + '__arrow ' + className + '__next-button',
	            disabled: this.nextButtonDisabled,
	            onClick: this.onClickNext,
	            type: 'button'
	          },
	          this.props.nextLabel
	        ),
	        view !== 'century' && _react2.default.createElement(
	          'button',
	          {
	            className: className + '__arrow ' + className + '__next2-button',
	            disabled: this.next2ButtonDisabled,
	            onClick: this.onClickNext2,
	            type: 'button'
	          },
	          this.props.next2Label
	        )
	      );
	    }
	  }, {
	    key: 'drillUpAvailable',
	    get: function get() {
	      var _props2 = this.props,
	          view = _props2.view,
	          views = _props2.views;
	
	      return views.indexOf(view) > 0;
	    }
	  }, {
	    key: 'prevButtonDisabled',
	    get: function get() {
	      var _props3 = this.props,
	          date = _props3.activeStartDate,
	          minDate = _props3.minDate,
	          view = _props3.view;
	
	      var previousActiveStartDate = (0, _dates.getBeginPrevious)(view, date);
	      if (previousActiveStartDate.getFullYear() < 1000) {
	        return true;
	      }
	      var previousActiveEndDate = (0, _dates.getEndPrevious)(view, date);
	      return minDate && minDate >= previousActiveEndDate;
	    }
	  }, {
	    key: 'prev2ButtonDisabled',
	    get: function get() {
	      var _props4 = this.props,
	          date = _props4.activeStartDate,
	          minDate = _props4.minDate,
	          view = _props4.view;
	
	      var previousActiveStartDate = (0, _dates.getBeginPrevious2)(view, date);
	      if (previousActiveStartDate.getFullYear() < 1000) {
	        return true;
	      }
	      var previousActiveEndDate = (0, _dates.getEndPrevious2)(view, date);
	      return minDate && minDate >= previousActiveEndDate;
	    }
	  }, {
	    key: 'nextButtonDisabled',
	    get: function get() {
	      var _props5 = this.props,
	          date = _props5.activeStartDate,
	          maxDate = _props5.maxDate,
	          view = _props5.view;
	
	      var nextActiveStartDate = (0, _dates.getBeginNext)(view, date);
	      return maxDate && maxDate <= nextActiveStartDate;
	    }
	  }, {
	    key: 'next2ButtonDisabled',
	    get: function get() {
	      var _props6 = this.props,
	          date = _props6.activeStartDate,
	          maxDate = _props6.maxDate,
	          view = _props6.view;
	
	      var nextActiveStartDate = (0, _dates.getBeginNext2)(view, date);
	      return maxDate && maxDate <= nextActiveStartDate;
	    }
	  }, {
	    key: 'label',
	    get: function get() {
	      var _props7 = this.props,
	          date = _props7.activeStartDate,
	          formatMonthYear = _props7.formatMonthYear,
	          locale = _props7.locale,
	          view = _props7.view;
	
	
	      switch (view) {
	        case 'century':
	          return (0, _dates.getCenturyLabel)(date);
	        case 'decade':
	          return (0, _dates.getDecadeLabel)(date);
	        case 'year':
	          return (0, _dates.getYear)(date);
	        case 'month':
	          return formatMonthYear(date, locale);
	        default:
	          throw new Error('Invalid view: ' + view + '.');
	      }
	    }
	  }]);
	
	  return Navigation;
	}(_react.Component);
	
	exports.default = Navigation;
	
	
	Navigation.defaultProps = {
	  formatMonthYear: _dateFormatter.formatMonthYear,
	  next2Label: '»',
	  nextLabel: '›',
	  prev2Label: '«',
	  prevLabel: '‹'
	};
	
	Navigation.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  drillUp: _propTypes2.default.func.isRequired,
	  formatMonthYear: _propTypes2.default.func,
	  locale: _propTypes2.default.string,
	  maxDate: _propTypes2.default.instanceOf(Date),
	  minDate: _propTypes2.default.instanceOf(Date),
	  next2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  nextLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  prev2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  prevLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
	  setActiveStartDate: _propTypes2.default.func.isRequired,
	  view: _propTypes3.isView.isRequired,
	  views: _propTypes3.isViews.isRequired
	};

/***/ }),
/* 107 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	/* Simple getters - getting a property of a given point in time */
	
	var getYear = exports.getYear = function getYear(date) {
	  if (date instanceof Date) {
	    return date.getFullYear();
	  }
	
	  if (typeof date === 'number') {
	    return date;
	  }
	
	  var year = parseInt(date, 10);
	
	  if (typeof date === 'string' && !isNaN(year)) {
	    return year;
	  }
	
	  throw new Error('Failed to get year from date: ' + date + '.');
	};
	
	var getMonth = exports.getMonth = function getMonth(date) {
	  return date.getMonth() + 1;
	};
	
	var getMonthIndex = exports.getMonthIndex = function getMonthIndex(date) {
	  return date.getMonth();
	};
	
	var getDay = exports.getDay = function getDay(date) {
	  return date.getDate();
	};
	
	var getDayOfWeek = exports.getDayOfWeek = function getDayOfWeek(date) {
	  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
	
	  var weekday = date.getDay();
	
	  switch (calendarType) {
	    case 'ISO 8601':
	      // Shifts days of the week so that Monday is 0, Sunday is 6
	      return (weekday + 6) % 7;
	    case 'US':
	      return weekday;
	    default:
	      throw new Error('Unsupported calendar type.');
	  }
	};
	
	/* Complex getters - getting a property somehow related to a given point in time */
	
	var getBeginOfCenturyYear = exports.getBeginOfCenturyYear = function getBeginOfCenturyYear(date) {
	  var year = getYear(date) - 1;
	  return year + -year % 100 + 1;
	};
	
	var getBeginOfCentury = exports.getBeginOfCentury = function getBeginOfCentury(date) {
	  var beginOfCenturyYear = getBeginOfCenturyYear(date);
	  return new Date(beginOfCenturyYear, 0, 1);
	};
	
	var getEndOfCentury = exports.getEndOfCentury = function getEndOfCentury(date) {
	  var beginOfCenturyYear = getBeginOfCenturyYear(date);
	  return new Date(beginOfCenturyYear + 100, 0, 1, 0, 0, 0, -1);
	};
	
	var getCenturyRange = exports.getCenturyRange = function getCenturyRange(date) {
	  return [getBeginOfCentury(date), getEndOfCentury(date)];
	};
	
	var getBeginOfPreviousCentury = exports.getBeginOfPreviousCentury = function getBeginOfPreviousCentury(date) {
	  var previousCenturyYear = getYear(date) - 100;
	  return getBeginOfCentury(previousCenturyYear);
	};
	
	var getEndOfPreviousCentury = exports.getEndOfPreviousCentury = function getEndOfPreviousCentury(date) {
	  var previousCenturyYear = getYear(date) - 100;
	  return getEndOfCentury(previousCenturyYear);
	};
	
	var getBeginOfNextCentury = exports.getBeginOfNextCentury = function getBeginOfNextCentury(date) {
	  var nextCenturyYear = getYear(date) + 100;
	  return getBeginOfCentury(nextCenturyYear);
	};
	
	var getBeginOfDecadeYear = exports.getBeginOfDecadeYear = function getBeginOfDecadeYear(date) {
	  var year = getYear(date) - 1;
	  return year + -year % 10 + 1;
	};
	
	var getBeginOfDecade = exports.getBeginOfDecade = function getBeginOfDecade(date) {
	  var beginOfDecadeYear = getBeginOfDecadeYear(date);
	  return new Date(beginOfDecadeYear, 0, 1);
	};
	
	var getEndOfDecade = exports.getEndOfDecade = function getEndOfDecade(date) {
	  var beginOfDecadeYear = getBeginOfDecadeYear(date);
	  return new Date(beginOfDecadeYear + 10, 0, 1, 0, 0, 0, -1);
	};
	
	var getDecadeRange = exports.getDecadeRange = function getDecadeRange(date) {
	  return [getBeginOfDecade(date), getEndOfDecade(date)];
	};
	
	var getBeginOfPreviousDecade = exports.getBeginOfPreviousDecade = function getBeginOfPreviousDecade(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
	
	  var previousDecadeYear = getBeginOfDecadeYear(date) - offset;
	  return getBeginOfDecade(previousDecadeYear);
	};
	
	var getEndOfPreviousDecade = exports.getEndOfPreviousDecade = function getEndOfPreviousDecade(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
	
	  var previousDecadeYear = getBeginOfDecadeYear(date) - offset;
	  return getEndOfDecade(previousDecadeYear);
	};
	
	var getBeginOfNextDecade = exports.getBeginOfNextDecade = function getBeginOfNextDecade(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
	
	  var nextDecadeYear = getBeginOfDecadeYear(date) + offset;
	  return getBeginOfDecade(nextDecadeYear);
	};
	
	/**
	 * Returns the beginning of a given year.
	 *
	 * @param {Date} date Date.
	 */
	var getBeginOfYear = exports.getBeginOfYear = function getBeginOfYear(date) {
	  var year = getYear(date);
	  return new Date(year, 0, 1);
	};
	
	/**
	 * Returns the end of a given year.
	 *
	 * @param {Date} date Date.
	 */
	var getEndOfYear = exports.getEndOfYear = function getEndOfYear(date) {
	  var year = getYear(date);
	  return new Date(year + 1, 0, 1, 0, 0, 0, -1);
	};
	
	/**
	 * Returns an array with the beginning and the end of a given year.
	 *
	 * @param {Date} date Date.
	 */
	var getYearRange = exports.getYearRange = function getYearRange(date) {
	  return [getBeginOfYear(date), getEndOfYear(date)];
	};
	
	var getBeginOfPreviousYear = exports.getBeginOfPreviousYear = function getBeginOfPreviousYear(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var previousYear = getYear(date) - offset;
	  return getBeginOfYear(previousYear);
	};
	
	var getEndOfPreviousYear = exports.getEndOfPreviousYear = function getEndOfPreviousYear(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var previousYear = getYear(date) - offset;
	  return getEndOfYear(previousYear);
	};
	
	var getBeginOfNextYear = exports.getBeginOfNextYear = function getBeginOfNextYear(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var nextYear = getYear(date) + offset;
	  return getBeginOfYear(nextYear);
	};
	
	/**
	 * Returns the beginning of a given month.
	 *
	 * @param {Date} date Date.
	 */
	var getBeginOfMonth = exports.getBeginOfMonth = function getBeginOfMonth(date) {
	  var year = getYear(date);
	  var monthIndex = getMonthIndex(date);
	  return new Date(year, monthIndex, 1);
	};
	
	/**
	 * Returns the end of a given month.
	 *
	 * @param {Date} date Date.
	 */
	var getEndOfMonth = exports.getEndOfMonth = function getEndOfMonth(date) {
	  var year = getYear(date);
	  var monthIndex = getMonthIndex(date);
	  return new Date(year, monthIndex + 1, 1, 0, 0, 0, -1);
	};
	
	/**
	 * Returns the beginning of a given week.
	 *
	 * @param {Date} date Date.
	 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
	 */
	var getBeginOfWeek = exports.getBeginOfWeek = function getBeginOfWeek(date) {
	  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
	
	  var year = getYear(date);
	  var monthIndex = getMonthIndex(date);
	  var day = date.getDate() - getDayOfWeek(date, calendarType);
	  return new Date(year, monthIndex, day);
	};
	
	/**
	 * Returns an array with the beginning and the end of a given month.
	 *
	 * @param {Date} date Date.
	 */
	var getMonthRange = exports.getMonthRange = function getMonthRange(date) {
	  return [getBeginOfMonth(date), getEndOfMonth(date)];
	};
	
	var getDifferentMonth = function getDifferentMonth(date, offset) {
	  var year = getYear(date);
	  var previousMonthIndex = getMonthIndex(date) + offset;
	  return new Date(year, previousMonthIndex, 1);
	};
	
	var getBeginOfPreviousMonth = exports.getBeginOfPreviousMonth = function getBeginOfPreviousMonth(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var previousMonth = getDifferentMonth(date, -offset);
	  return getBeginOfMonth(previousMonth);
	};
	
	var getEndOfPreviousMonth = exports.getEndOfPreviousMonth = function getEndOfPreviousMonth(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var previousMonth = getDifferentMonth(date, -offset);
	  return getEndOfMonth(previousMonth);
	};
	
	var getBeginOfNextMonth = exports.getBeginOfNextMonth = function getBeginOfNextMonth(date) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	
	  var nextMonth = getDifferentMonth(date, offset);
	  return getBeginOfMonth(nextMonth);
	};
	
	var getBeginOfDay = exports.getBeginOfDay = function getBeginOfDay(date) {
	  var year = getYear(date);
	  var monthIndex = getMonthIndex(date);
	  var day = getDay(date);
	  return new Date(year, monthIndex, day);
	};
	
	var getEndOfDay = exports.getEndOfDay = function getEndOfDay(date) {
	  var year = getYear(date);
	  var monthIndex = getMonthIndex(date);
	  var day = getDay(date);
	  return new Date(year, monthIndex, day + 1, 0, 0, 0, -1);
	};
	
	/**
	 * Returns an array with the beginning and the end of a given day.
	 *
	 * @param {Date} date Date.
	 */
	var getDayRange = exports.getDayRange = function getDayRange(date) {
	  return [getBeginOfDay(date), getEndOfDay(date)];
	};
	
	/**
	 * Gets week number according to ISO 8601 or US standard.
	 * In ISO 8601 week 1 is the one with January 4.
	 * In US calendar week 1 is the one with January 1.
	 *
	 * @param {Date} date Date.
	 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
	 */
	var getWeekNumber = exports.getWeekNumber = function getWeekNumber(date) {
	  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
	
	  var beginOfWeek = getBeginOfWeek(date, calendarType);
	  var year = getYear(date) + 1;
	  var dayInWeekOne = void 0;
	  var beginOfFirstWeek = void 0;
	
	  // Look for the first week one that does not come after a given date
	  do {
	    dayInWeekOne = new Date(year, 0, calendarType === 'ISO 8601' ? 4 : 1);
	    beginOfFirstWeek = getBeginOfWeek(dayInWeekOne, calendarType);
	    year -= 1;
	  } while (date - beginOfFirstWeek < 0);
	
	  return Math.round((beginOfWeek - beginOfFirstWeek) / (8.64e7 * 7)) + 1;
	};
	
	/**
	 * Returns the beginning of a given range.
	 *
	 * @param {String} rangeType Range type (e.g. 'day')
	 * @param {Date} date Date.
	 */
	var getBegin = exports.getBegin = function getBegin(rangeType, date) {
	  switch (rangeType) {
	    case 'century':
	      return getBeginOfCentury(date);
	    case 'decade':
	      return getBeginOfDecade(date);
	    case 'year':
	      return getBeginOfYear(date);
	    case 'month':
	      return getBeginOfMonth(date);
	    case 'day':
	      return getBeginOfDay(date);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	var getBeginPrevious = exports.getBeginPrevious = function getBeginPrevious(rangeType, date) {
	  switch (rangeType) {
	    case 'century':
	      return getBeginOfPreviousCentury(date);
	    case 'decade':
	      return getBeginOfPreviousDecade(date);
	    case 'year':
	      return getBeginOfPreviousYear(date);
	    case 'month':
	      return getBeginOfPreviousMonth(date);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	var getBeginNext = exports.getBeginNext = function getBeginNext(rangeType, date) {
	  switch (rangeType) {
	    case 'century':
	      return getBeginOfNextCentury(date);
	    case 'decade':
	      return getBeginOfNextDecade(date);
	    case 'year':
	      return getBeginOfNextYear(date);
	    case 'month':
	      return getBeginOfNextMonth(date);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	var getBeginPrevious2 = exports.getBeginPrevious2 = function getBeginPrevious2(rangeType, date) {
	  switch (rangeType) {
	    case 'decade':
	      return getBeginOfPreviousDecade(date, 100);
	    case 'year':
	      return getBeginOfPreviousYear(date, 10);
	    case 'month':
	      return getBeginOfPreviousMonth(date, 12);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	var getBeginNext2 = exports.getBeginNext2 = function getBeginNext2(rangeType, date) {
	  switch (rangeType) {
	    case 'decade':
	      return getBeginOfNextDecade(date, 100);
	    case 'year':
	      return getBeginOfNextYear(date, 10);
	    case 'month':
	      return getBeginOfNextMonth(date, 12);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	/**
	 * Returns the end of a given range.
	 *
	 * @param {String} rangeType Range type (e.g. 'day')
	 * @param {Date} date Date.
	 */
	var getEnd = exports.getEnd = function getEnd(rangeType, date) {
	  switch (rangeType) {
	    case 'century':
	      return getEndOfCentury(date);
	    case 'decade':
	      return getEndOfDecade(date);
	    case 'year':
	      return getEndOfYear(date);
	    case 'month':
	      return getEndOfMonth(date);
	    case 'day':
	      return getEndOfDay(date);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	var getEndPrevious = exports.getEndPrevious = function getEndPrevious(rangeType, date) {
	  switch (rangeType) {
	    case 'century':
	      return getEndOfPreviousCentury(date);
	    case 'decade':
	      return getEndOfPreviousDecade(date);
	    case 'year':
	      return getEndOfPreviousYear(date);
	    case 'month':
	      return getEndOfPreviousMonth(date);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	var getEndPrevious2 = exports.getEndPrevious2 = function getEndPrevious2(rangeType, date) {
	  switch (rangeType) {
	    case 'decade':
	      return getEndOfPreviousDecade(date, 100);
	    case 'year':
	      return getEndOfPreviousYear(date, 10);
	    case 'month':
	      return getEndOfPreviousMonth(date, 12);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	/**
	 * Returns an array with the beginning and the end of a given range.
	 *
	 * @param {String} rangeType Range type (e.g. 'day')
	 * @param {Date} date Date.
	 */
	var getRange = exports.getRange = function getRange(rangeType, date) {
	  switch (rangeType) {
	    case 'century':
	      return getCenturyRange(date);
	    case 'decade':
	      return getDecadeRange(date);
	    case 'year':
	      return getYearRange(date);
	    case 'month':
	      return getMonthRange(date);
	    case 'day':
	      return getDayRange(date);
	    default:
	      throw new Error('Invalid rangeType: ' + rangeType);
	  }
	};
	
	/**
	 * Creates a range out of two values, ensuring they are in order and covering entire period ranges.
	 *
	 * @param {String} rangeType Range type (e.g. 'day')
	 * @param {Date} date1 First date.
	 * @param {Date} date2 Second date.
	 */
	var getValueRange = exports.getValueRange = function getValueRange(rangeType, date1, date2) {
	  var rawNextValue = [date1, date2].sort(function (a, b) {
	    return a.getTime() > b.getTime();
	  });
	  return [getBegin(rangeType, rawNextValue[0]), getEnd(rangeType, rawNextValue[1])];
	};
	
	/**
	 * Returns a number of days in a month of a given date.
	 *
	 * @param {Date} date Date.
	 */
	var getDaysInMonth = exports.getDaysInMonth = function getDaysInMonth(date) {
	  var year = getYear(date);
	  var monthIndex = getMonthIndex(date);
	  return new Date(year, monthIndex + 1, 0).getDate();
	};
	
	var toYearLabel = function toYearLabel(_ref) {
	  var _ref2 = _slicedToArray(_ref, 2),
	      start = _ref2[0],
	      end = _ref2[1];
	
	  return getYear(start) + ' \u2013 ' + getYear(end);
	};
	
	/**
	 * Returns a string labelling a century of a given date.
	 * For example, for 2017 it will return 2001-2100.
	 *
	 * @param {Date|String|Number} date Date or a year as a string or as a number.
	 */
	var getCenturyLabel = exports.getCenturyLabel = function getCenturyLabel(date) {
	  return toYearLabel(getCenturyRange(date));
	};
	
	/**
	 * Returns a string labelling a century of a given date.
	 * For example, for 2017 it will return 2011-2020.
	 *
	 * @param {Date|String|Number} date Date or a year as a string or as a number.
	 */
	var getDecadeLabel = exports.getDecadeLabel = function getDecadeLabel(date) {
	  return toYearLabel(getDecadeRange(date));
	};
	
	/**
	 * Returns a boolean determining whether a given date is on Saturday or Sunday.
	 *
	 * @param {Date} date Date.
	 */
	var isWeekend = exports.isWeekend = function isWeekend(date) {
	  var weekday = getDayOfWeek(date);
	  return weekday >= 5;
	};
	
	/**
	 * Returns local month in ISO-like format (YYYY-MM).
	 */
	var getISOLocalMonth = exports.getISOLocalMonth = function getISOLocalMonth(value) {
	  if (!value) {
	    return value;
	  }
	
	  var date = new Date(value);
	
	  if (isNaN(date.getTime())) {
	    throw new Error('Invalid date: ' + value);
	  }
	
	  var year = getYear(date);
	  var month = ('0' + getMonth(date)).slice(-2);
	
	  return year + '-' + month;
	};
	
	/**
	 * Returns local date in ISO-like format (YYYY-MM-DD).
	 */
	var getISOLocalDate = exports.getISOLocalDate = function getISOLocalDate(value) {
	  if (!value) {
	    return value;
	  }
	
	  var date = new Date(value);
	
	  if (isNaN(date.getTime())) {
	    throw new Error('Invalid date: ' + value);
	  }
	
	  var year = getYear(date);
	  var month = ('0' + getMonth(date)).slice(-2);
	  var day = ('0' + getDay(date)).slice(-2);
	
	  return year + '-' + month + '-' + day;
	};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.formatShortWeekday = exports.formatMonth = exports.formatMonthYear = exports.formatDate = undefined;
	
	var _locales = __webpack_require__(109);
	
	var formatterCache = {};
	
	/**
	 * Gets Intl-based date formatter from formatter cache. If it doesn't exist in cache
	 * just yet, it will be created on the fly.
	 */
	var getFormatter = function getFormatter(options, locale) {
	  if (!locale) {
	    // Default parameter is not enough as it does not protect us from null values
	    // eslint-disable-next-line no-param-reassign
	    locale = (0, _locales.getDefaultLocale)();
	  }
	
	  var stringifiedOptions = JSON.stringify(options);
	
	  if (!formatterCache[locale]) {
	    formatterCache[locale] = {};
	  }
	
	  if (!formatterCache[locale][stringifiedOptions]) {
	    formatterCache[locale][stringifiedOptions] = new Intl.DateTimeFormat(locale, options).format;
	  }
	
	  return formatterCache[locale][stringifiedOptions];
	};
	
	/**
	 * Changes the hour in a Date to ensure right date formatting even if DST is messed up.
	 * Workaround for bug in WebKit and Firefox with historical dates.
	 * For more details, see:
	 * https://bugs.chromium.org/p/chromium/issues/detail?id=750465
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=1385643
	 *
	 * @param {Date} date Date.
	 */
	var toSafeHour = function toSafeHour(date) {
	  var safeDate = new Date(date);
	  return new Date(safeDate.setHours(12));
	};
	
	var formatDate = exports.formatDate = function formatDate(date, locale) {
	  return getFormatter({ day: 'numeric', month: 'numeric', year: 'numeric' }, locale)(toSafeHour(date));
	};
	
	var formatMonthYear = exports.formatMonthYear = function formatMonthYear(date, locale) {
	  return getFormatter({ month: 'long', year: 'numeric' }, locale)(toSafeHour(date));
	};
	
	var formatMonth = exports.formatMonth = function formatMonth(date, locale) {
	  return getFormatter({ month: 'long' }, locale)(toSafeHour(date));
	};
	
	var formatShortWeekday = exports.formatShortWeekday = function formatShortWeekday(date, locale) {
	  return getFormatter({ weekday: 'short' }, locale)(toSafeHour(date));
	};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getDefaultLocale = exports.getDefaultLocales = undefined;
	
	var _lodash = __webpack_require__(110);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var getDefaultLocales = exports.getDefaultLocales = (0, _lodash2.default)(function () {
	  var languageList = [];
	
	  if (typeof window !== 'undefined') {
	    if (window.navigator.languages) {
	      languageList.push.apply(languageList, _toConsumableArray(window.navigator.languages));
	    } else if (window.navigator.userLanguage) {
	      languageList.push(window.navigator.userLanguage);
	    }
	  }
	
	  languageList.push('en-GB'); // Fallback
	
	  return languageList;
	});
	
	var getDefaultLocale = exports.getDefaultLocale = (0, _lodash2.default)(function () {
	  return getDefaultLocales()[0];
	});

/***/ }),
/* 110 */
/***/ (function(module, exports) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308,
	    NAN = 0 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;
	
	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;
	
	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;
	
	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Creates a function that invokes `func`, with the `this` binding and arguments
	 * of the created function, while it's called less than `n` times. Subsequent
	 * calls to the created function return the result of the last `func` invocation.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Function
	 * @param {number} n The number of calls at which `func` is no longer invoked.
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new restricted function.
	 * @example
	 *
	 * jQuery(element).on('click', _.before(5, addContactToList));
	 * // => Allows adding up to 4 contacts to the list.
	 */
	function before(n, func) {
	  var result;
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  n = toInteger(n);
	  return function() {
	    if (--n > 0) {
	      result = func.apply(this, arguments);
	    }
	    if (n <= 1) {
	      func = undefined;
	    }
	    return result;
	  };
	}
	
	/**
	 * Creates a function that is restricted to invoking `func` once. Repeat calls
	 * to the function return the value of the first invocation. The `func` is
	 * invoked with the `this` binding and arguments of the created function.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new restricted function.
	 * @example
	 *
	 * var initialize = _.once(createApplication);
	 * initialize();
	 * initialize();
	 * // => `createApplication` is invoked once
	 */
	function once(func) {
	  return before(2, func);
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}
	
	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;
	
	  return result === result ? (remainder ? result - remainder : result) : 0;
	}
	
	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}
	
	module.exports = once;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tileProps = exports.tileGroupProps = exports.isView = exports.isClassName = exports.isViews = exports.isValue = exports.isMaxDate = exports.isMinDate = exports.isCalendarType = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var calendarTypes = ['ISO 8601', 'US'];
	var allViews = ['century', 'decade', 'year', 'month'];
	
	var isCalendarType = exports.isCalendarType = _propTypes2.default.oneOf(calendarTypes);
	
	var isMinDate = exports.isMinDate = function isMinDate(props, propName, componentName) {
	  var minDate = props[propName];
	
	  if (minDate) {
	    if (!(minDate instanceof Date)) {
	      return new Error('Invalid prop `' + propName + '` of type `' + (typeof minDate === 'undefined' ? 'undefined' : _typeof(minDate)) + '` supplied to `' + componentName + '`, expected instance of `Date`.');
	    }
	
	    var maxDate = props.maxDate;
	
	
	    if (maxDate && minDate > maxDate) {
	      return new Error('Invalid prop `' + propName + '` of type `' + (typeof minDate === 'undefined' ? 'undefined' : _typeof(minDate)) + '` supplied to `' + componentName + '`, minDate cannot be larger than maxDate.');
	    }
	  }
	
	  // Everything is fine
	  return null;
	};
	
	var isMaxDate = exports.isMaxDate = function isMaxDate(props, propName, componentName) {
	  var maxDate = props[propName];
	
	  if (maxDate) {
	    if (!(maxDate instanceof Date)) {
	      return new Error('Invalid prop `' + propName + '` of type `' + (typeof maxDate === 'undefined' ? 'undefined' : _typeof(maxDate)) + '` supplied to `' + componentName + '`, expected instance of `Date`.');
	    }
	
	    var minDate = props.minDate;
	
	
	    if (minDate && maxDate < minDate) {
	      return new Error('Invalid prop `' + propName + '` of type `' + (typeof maxDate === 'undefined' ? 'undefined' : _typeof(maxDate)) + '` supplied to `' + componentName + '`, maxDate cannot be smaller than minDate.');
	    }
	  }
	
	  // Everything is fine
	  return null;
	};
	
	var isValue = exports.isValue = _propTypes2.default.oneOfType([_propTypes2.default.instanceOf(Date), _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date))]);
	
	var isViews = exports.isViews = _propTypes2.default.arrayOf(_propTypes2.default.oneOf(allViews));
	
	var isClassName = exports.isClassName = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]);
	
	var isView = exports.isView = function isView(props, propName, componentName) {
	  var view = props[propName];
	  var views = props.views;
	
	
	  var allowedViews = views || allViews;
	
	  if (allowedViews.indexOf(view) === -1) {
	    return new Error('Invalid prop `' + propName + '` of value `' + view + '` supplied to `' + componentName + '`, expected one of [' + ['a', 'b', 'c', 'd', 'e'].map(function (a) {
	      return '"' + a + '"';
	    }).join(', ') + '].');
	  }
	
	  // Everything is fine
	  return null;
	};
	
	isView.isRequired = function (props, propName, componentName) {
	  var view = props[propName];
	  if (!view) {
	    return new Error('The prop `' + propName + '` is marked as required in `' + componentName + '`, but its value is `' + view + '`.');
	  }
	  return isView(props, propName, componentName);
	};
	
	var tileGroupProps = exports.tileGroupProps = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  hover: _propTypes2.default.instanceOf(Date),
	  maxDate: isMaxDate,
	  minDate: isMinDate,
	  onClick: _propTypes2.default.func,
	  onMouseOver: _propTypes2.default.func,
	  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, isClassName]),
	  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
	  value: isValue,
	  valueType: _propTypes2.default.string
	};
	
	var tileProps = exports.tileProps = {
	  classes: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
	  date: _propTypes2.default.instanceOf(Date).isRequired,
	  maxDate: isMaxDate,
	  minDate: isMinDate,
	  onClick: _propTypes2.default.func,
	  onMouseOver: _propTypes2.default.func,
	  style: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
	  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, isClassName]),
	  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
	  tileDisabled: _propTypes2.default.func
	};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Decades = __webpack_require__(113);
	
	var _Decades2 = _interopRequireDefault(_Decades);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CenturyView = function (_PureComponent) {
	  _inherits(CenturyView, _PureComponent);
	
	  function CenturyView() {
	    _classCallCheck(this, CenturyView);
	
	    return _possibleConstructorReturn(this, (CenturyView.__proto__ || Object.getPrototypeOf(CenturyView)).apply(this, arguments));
	  }
	
	  _createClass(CenturyView, [{
	    key: 'renderDecades',
	    value: function renderDecades() {
	      return _react2.default.createElement(_Decades2.default, this.props);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'react-calendar__century-view' },
	        this.renderDecades()
	      );
	    }
	  }]);
	
	  return CenturyView;
	}(_react.PureComponent);
	
	exports.default = CenturyView;
	
	
	CenturyView.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  maxDate: _propTypes3.isMaxDate,
	  minDate: _propTypes3.isMinDate,
	  onChange: _propTypes2.default.func,
	  setActiveRange: _propTypes2.default.func,
	  value: _propTypes3.isValue,
	  valueType: _propTypes2.default.string
	};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _TileGroup = __webpack_require__(114);
	
	var _TileGroup2 = _interopRequireDefault(_TileGroup);
	
	var _Decade = __webpack_require__(117);
	
	var _Decade2 = _interopRequireDefault(_Decade);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Decades = function (_PureComponent) {
	  _inherits(Decades, _PureComponent);
	
	  function Decades() {
	    _classCallCheck(this, Decades);
	
	    return _possibleConstructorReturn(this, (Decades.__proto__ || Object.getPrototypeOf(Decades)).apply(this, arguments));
	  }
	
	  _createClass(Decades, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          activeStartDate = _props.activeStartDate,
	          otherProps = _objectWithoutProperties(_props, ['activeStartDate']);
	
	      return _react2.default.createElement(_TileGroup2.default, _extends({}, otherProps, {
	        className: 'react-calendar__century-view__decades',
	        dateTransform: _dates.getBeginOfDecade,
	        dateType: 'decade',
	        end: this.end,
	        start: this.start,
	        step: 10,
	        tile: _Decade2.default
	      }));
	    }
	  }, {
	    key: 'start',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getBeginOfCenturyYear)(activeStartDate);
	    }
	  }, {
	    key: 'end',
	    get: function get() {
	      return this.start + 99;
	    }
	  }]);
	
	  return Decades;
	}(_react.PureComponent);
	
	exports.default = Decades;
	
	
	Decades.propTypes = _extends({}, _propTypes.tileGroupProps);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Flex = __webpack_require__(115);
	
	var _Flex2 = _interopRequireDefault(_Flex);
	
	var _utils = __webpack_require__(116);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var TileGroup = function TileGroup(_ref) {
	  var className = _ref.className,
	      count = _ref.count,
	      dateTransform = _ref.dateTransform,
	      dateType = _ref.dateType,
	      end = _ref.end,
	      hover = _ref.hover,
	      offset = _ref.offset,
	      start = _ref.start,
	      step = _ref.step,
	      Tile = _ref.tile,
	      value = _ref.value,
	      valueType = _ref.valueType,
	      tileProps = _objectWithoutProperties(_ref, ['className', 'count', 'dateTransform', 'dateType', 'end', 'hover', 'offset', 'start', 'step', 'tile', 'value', 'valueType']);
	
	  var tiles = [];
	  for (var point = start; point <= end; point += step) {
	    var date = dateTransform(point);
	
	    tiles.push(_react2.default.createElement(Tile, _extends({
	      classes: (0, _utils.getTileClasses)({
	        value: value, valueType: valueType, date: date, dateType: dateType, hover: hover
	      }),
	      date: date,
	      point: point,
	      key: date.getTime()
	    }, tileProps)));
	  }
	
	  return _react2.default.createElement(
	    _Flex2.default,
	    {
	      className: className,
	      count: count,
	      offset: offset,
	      wrap: true
	    },
	    tiles
	  );
	};
	
	TileGroup.propTypes = _extends({}, _propTypes3.tileGroupProps, {
	  activeStartDate: _propTypes2.default.instanceOf(Date),
	  count: _propTypes2.default.number,
	  dateTransform: _propTypes2.default.func.isRequired,
	  offset: _propTypes2.default.number,
	  tile: _propTypes2.default.func.isRequired,
	  step: _propTypes2.default.number
	});
	
	TileGroup.defaultProps = {
	  count: 3,
	  step: 1
	};
	
	exports.default = TileGroup;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var toPercent = function toPercent(num) {
	  return num + '%';
	};
	
	var Flex = function Flex(_ref) {
	  var children = _ref.children,
	      className = _ref.className,
	      direction = _ref.direction,
	      count = _ref.count,
	      offset = _ref.offset,
	      style = _ref.style,
	      wrap = _ref.wrap,
	      otherProps = _objectWithoutProperties(_ref, ['children', 'className', 'direction', 'count', 'offset', 'style', 'wrap']);
	
	  return _react2.default.createElement(
	    'div',
	    _extends({
	      className: className,
	      style: _extends({
	        display: 'flex',
	        flexDirection: direction,
	        flexWrap: wrap ? 'wrap' : 'no-wrap'
	      }, style)
	    }, otherProps),
	    _react2.default.Children.map(children, function (child, index) {
	      return _react2.default.cloneElement(child, _extends({}, child.props, {
	        style: {
	          flexBasis: toPercent(100 / count),
	          maxWidth: toPercent(100 / count),
	          overflow: 'hidden',
	          marginLeft: offset && index === 0 ? toPercent(100 * offset / count) : null
	        }
	      }));
	    })
	  );
	};
	
	Flex.propTypes = {
	  children: _propTypes2.default.node,
	  className: _propTypes2.default.string,
	  count: _propTypes2.default.number.isRequired,
	  direction: _propTypes2.default.string,
	  offset: _propTypes2.default.number,
	  style: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
	  wrap: _propTypes2.default.bool
	};
	
	exports.default = Flex;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getTileClasses = exports.between = exports.doRangesOverlap = exports.isRangeWithinRange = exports.isValueWithinRange = exports.callIfDefined = exports.mergeFunctions = undefined;
	
	var _dates = __webpack_require__(107);
	
	/**
	 * Returns a function that, when called, calls all the functions
	 * passed to it, applying its arguments to them.
	 *
	 * @param {Function[]} functions
	 */
	var mergeFunctions = exports.mergeFunctions = function mergeFunctions() {
	  for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
	    functions[_key] = arguments[_key];
	  }
	
	  return function () {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }
	
	    return functions.filter(Boolean).forEach(function (f) {
	      return f.apply(undefined, args);
	    });
	  };
	};
	
	/**
	 * Calls a function, if it's defined, with specified arguments
	 * @param {Function} fn
	 * @param {Object} args
	 */
	var callIfDefined = exports.callIfDefined = function callIfDefined(fn) {
	  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    args[_key3 - 1] = arguments[_key3];
	  }
	
	  if (fn && typeof fn === 'function') {
	    fn.apply(undefined, args);
	  }
	};
	
	var isValueWithinRange = exports.isValueWithinRange = function isValueWithinRange(value, range) {
	  return range[0] <= value && range[1] >= value;
	};
	
	var isRangeWithinRange = exports.isRangeWithinRange = function isRangeWithinRange(greaterRange, smallerRange) {
	  return greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1];
	};
	
	var doRangesOverlap = exports.doRangesOverlap = function doRangesOverlap(range1, range2) {
	  return isValueWithinRange(range1[0], range2) || isValueWithinRange(range1[1], range2);
	};
	
	/**
	 * Returns a value no smaller than min and no larger than max.
	 *
	 * @param {*} value Value to return.
	 * @param {*} min Minimum return value.
	 * @param {*} max Maximum return value.
	 */
	var between = exports.between = function between(value, min, max) {
	  if (min && min > value) {
	    return min;
	  }
	  if (max && max < value) {
	    return max;
	  }
	  return value;
	};
	
	var getTileClasses = exports.getTileClasses = function getTileClasses() {
	  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      value = _ref.value,
	      valueType = _ref.valueType,
	      date = _ref.date,
	      dateType = _ref.dateType,
	      hover = _ref.hover;
	
	  var classes = ['react-calendar__tile'];
	  if (!value) {
	    return classes;
	  }
	
	  if (!date || !(value instanceof Array) && !valueType || !(date instanceof Array) && !dateType) {
	    throw new Error('getTileClasses(): Unable to get tile activity classes because one or more required arguments were not passed.');
	  }
	
	  var valueRange = value instanceof Array ? value : (0, _dates.getRange)(valueType, value);
	  var dateRange = date instanceof Array ? date : (0, _dates.getRange)(dateType, date);
	
	  if (isRangeWithinRange(valueRange, dateRange)) {
	    classes.push('react-calendar__tile--active');
	  } else if (doRangesOverlap(valueRange, dateRange)) {
	    classes.push('react-calendar__tile--hasActive');
	  } else if (hover && (
	  // Date before value
	  dateRange[1] < valueRange[0] && isRangeWithinRange([hover, valueRange[0]], dateRange) ||
	  // Date after value
	  dateRange[0] > valueRange[1] && isRangeWithinRange([valueRange[1], hover], dateRange))) {
	    classes.push('react-calendar__tile--hover');
	  }
	
	  return classes;
	};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Tile = __webpack_require__(118);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var className = 'react-calendar__century-view__decades__decade';
	
	var Decade = function Decade(_ref) {
	  var classes = _ref.classes,
	      point = _ref.point,
	      otherProps = _objectWithoutProperties(_ref, ['classes', 'point']);
	
	  return _react2.default.createElement(
	    _Tile2.default,
	    _extends({}, otherProps, {
	      classes: [].concat(_toConsumableArray(classes), [className]),
	      dateTime: point + 'T00:00:00.000',
	      maxDateTransform: _dates.getEndOfDecade,
	      minDateTransform: _dates.getBeginOfDecade,
	      view: 'century'
	    }),
	    (0, _dates.getDecadeLabel)(point)
	  );
	};
	
	Decade.propTypes = _extends({
	  point: _propTypes2.default.number.isRequired
	}, _propTypes3.tileProps);
	
	exports.default = Decade;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _mergeClassNames = __webpack_require__(105);
	
	var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Tile = function Tile(_ref) {
	  var children = _ref.children,
	      classes = _ref.classes,
	      date = _ref.date,
	      dateTime = _ref.dateTime,
	      maxDate = _ref.maxDate,
	      maxDateTransform = _ref.maxDateTransform,
	      minDate = _ref.minDate,
	      minDateTransform = _ref.minDateTransform,
	      onClick = _ref.onClick,
	      onMouseOver = _ref.onMouseOver,
	      style = _ref.style,
	      tileClassName = _ref.tileClassName,
	      tileContent = _ref.tileContent,
	      tileDisabled = _ref.tileDisabled,
	      view = _ref.view;
	  return _react2.default.createElement(
	    'button',
	    {
	      className: (0, _mergeClassNames2.default)(classes, tileClassName instanceof Function ? tileClassName({ date: date, view: view }) : tileClassName),
	      disabled: minDate && minDateTransform(minDate) > date || maxDate && maxDateTransform(maxDate) < date || tileDisabled && tileDisabled({ date: date, view: view }),
	      onClick: onClick && function () {
	        return onClick(date);
	      },
	      onMouseOver: onMouseOver && function () {
	        return onMouseOver(date);
	      },
	      onFocus: onMouseOver && function () {
	        return onMouseOver(date);
	      },
	      style: style,
	      type: 'button'
	    },
	    _react2.default.createElement(
	      'time',
	      { dateTime: dateTime },
	      children
	    ),
	    typeof tileContent === 'function' ? tileContent({ date: date, view: view }) : tileContent
	  );
	};
	
	Tile.propTypes = _extends({}, _propTypes3.tileProps, {
	  children: _propTypes2.default.node.isRequired,
	  dateTime: _propTypes2.default.string.isRequired,
	  maxDateTransform: _propTypes2.default.func.isRequired,
	  minDateTransform: _propTypes2.default.func.isRequired
	});
	
	exports.default = Tile;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Years = __webpack_require__(120);
	
	var _Years2 = _interopRequireDefault(_Years);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DecadeView = function (_PureComponent) {
	  _inherits(DecadeView, _PureComponent);
	
	  function DecadeView() {
	    _classCallCheck(this, DecadeView);
	
	    return _possibleConstructorReturn(this, (DecadeView.__proto__ || Object.getPrototypeOf(DecadeView)).apply(this, arguments));
	  }
	
	  _createClass(DecadeView, [{
	    key: 'renderYears',
	    value: function renderYears() {
	      return _react2.default.createElement(_Years2.default, this.props);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'react-calendar__decade-view' },
	        this.renderYears()
	      );
	    }
	  }]);
	
	  return DecadeView;
	}(_react.PureComponent);
	
	exports.default = DecadeView;
	
	
	DecadeView.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  maxDate: _propTypes3.isMaxDate,
	  minDate: _propTypes3.isMinDate,
	  onChange: _propTypes2.default.func,
	  setActiveRange: _propTypes2.default.func,
	  value: _propTypes3.isValue,
	  valueType: _propTypes2.default.string
	};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _TileGroup = __webpack_require__(114);
	
	var _TileGroup2 = _interopRequireDefault(_TileGroup);
	
	var _Year = __webpack_require__(121);
	
	var _Year2 = _interopRequireDefault(_Year);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Years = function (_PureComponent) {
	  _inherits(Years, _PureComponent);
	
	  function Years() {
	    _classCallCheck(this, Years);
	
	    return _possibleConstructorReturn(this, (Years.__proto__ || Object.getPrototypeOf(Years)).apply(this, arguments));
	  }
	
	  _createClass(Years, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          activeStartDate = _props.activeStartDate,
	          otherProps = _objectWithoutProperties(_props, ['activeStartDate']);
	
	      return _react2.default.createElement(_TileGroup2.default, _extends({}, otherProps, {
	        className: 'react-calendar__decade-view__years',
	        dateTransform: function dateTransform(year) {
	          return new Date(year, 0, 1);
	        },
	        dateType: 'year',
	        end: this.end,
	        start: this.start,
	        tile: _Year2.default
	      }));
	    }
	  }, {
	    key: 'start',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getBeginOfDecadeYear)(activeStartDate);
	    }
	  }, {
	    key: 'end',
	    get: function get() {
	      return this.start + 9;
	    }
	  }]);
	
	  return Years;
	}(_react.PureComponent);
	
	exports.default = Years;
	
	
	Years.propTypes = _extends({}, _propTypes.tileGroupProps);

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Tile = __webpack_require__(118);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var className = 'react-calendar__decade-view__years__year';
	
	var Year = function Year(_ref) {
	  var classes = _ref.classes,
	      point = _ref.point,
	      otherProps = _objectWithoutProperties(_ref, ['classes', 'point']);
	
	  return _react2.default.createElement(
	    _Tile2.default,
	    _extends({}, otherProps, {
	      classes: [].concat(_toConsumableArray(classes), [className]),
	      dateTime: point + 'T00:00:00.000',
	      maxDateTransform: _dates.getEndOfYear,
	      minDateTransform: _dates.getBeginOfYear,
	      view: 'decade'
	    }),
	    point
	  );
	};
	
	Year.propTypes = _extends({
	  point: _propTypes2.default.number.isRequired
	}, _propTypes3.tileProps);
	
	exports.default = Year;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Months = __webpack_require__(123);
	
	var _Months2 = _interopRequireDefault(_Months);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var YearView = function (_PureComponent) {
	  _inherits(YearView, _PureComponent);
	
	  function YearView() {
	    _classCallCheck(this, YearView);
	
	    return _possibleConstructorReturn(this, (YearView.__proto__ || Object.getPrototypeOf(YearView)).apply(this, arguments));
	  }
	
	  _createClass(YearView, [{
	    key: 'renderMonths',
	    value: function renderMonths() {
	      return _react2.default.createElement(_Months2.default, this.props);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { className: 'react-calendar__year-view' },
	        this.renderMonths()
	      );
	    }
	  }]);
	
	  return YearView;
	}(_react.PureComponent);
	
	exports.default = YearView;
	
	
	YearView.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  formatMonth: _propTypes2.default.func,
	  locale: _propTypes2.default.string,
	  maxDate: _propTypes3.isMaxDate,
	  minDate: _propTypes3.isMinDate,
	  onChange: _propTypes2.default.func,
	  setActiveRange: _propTypes2.default.func,
	  value: _propTypes3.isValue,
	  valueType: _propTypes2.default.string
	};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _TileGroup = __webpack_require__(114);
	
	var _TileGroup2 = _interopRequireDefault(_TileGroup);
	
	var _Month = __webpack_require__(124);
	
	var _Month2 = _interopRequireDefault(_Month);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Months = function (_PureComponent) {
	  _inherits(Months, _PureComponent);
	
	  function Months() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Months);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Months.__proto__ || Object.getPrototypeOf(Months)).call.apply(_ref, [this].concat(args))), _this), _this.start = 0, _this.end = 11, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Months, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _props = this.props,
	          activeStartDate = _props.activeStartDate,
	          otherProps = _objectWithoutProperties(_props, ['activeStartDate']);
	
	      return _react2.default.createElement(_TileGroup2.default, _extends({}, otherProps, {
	        className: 'react-calendar__year-view__months',
	        dateTransform: function dateTransform(monthIndex) {
	          return new Date(_this2.year, monthIndex, 1);
	        },
	        dateType: 'month',
	        end: this.end,
	        start: this.start,
	        tile: _Month2.default
	      }));
	    }
	  }, {
	    key: 'year',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getYear)(activeStartDate);
	    }
	  }]);
	
	  return Months;
	}(_react.PureComponent);
	
	exports.default = Months;
	
	
	Months.propTypes = _extends({}, _propTypes3.tileGroupProps, {
	  locale: _propTypes2.default.string
	});

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Tile = __webpack_require__(118);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	var _dates = __webpack_require__(107);
	
	var _dateFormatter = __webpack_require__(108);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var className = 'react-calendar__year-view__months__month';
	
	var Month = function Month(_ref) {
	  var classes = _ref.classes,
	      date = _ref.date,
	      formatMonth = _ref.formatMonth,
	      locale = _ref.locale,
	      otherProps = _objectWithoutProperties(_ref, ['classes', 'date', 'formatMonth', 'locale']);
	
	  return _react2.default.createElement(
	    _Tile2.default,
	    _extends({}, otherProps, {
	      classes: [].concat(_toConsumableArray(classes), [className]),
	      date: date,
	      dateTime: (0, _dates.getISOLocalMonth)(date) + 'T00:00:00.000',
	      maxDateTransform: _dates.getEndOfMonth,
	      minDateTransform: _dates.getBeginOfMonth,
	      view: 'year'
	    }),
	    formatMonth(date, locale)
	  );
	};
	
	Month.defaultProps = {
	  formatMonth: _dateFormatter.formatMonth
	};
	
	Month.propTypes = _extends({}, _propTypes3.tileProps, {
	  formatMonth: _propTypes2.default.func,
	  locale: _propTypes2.default.string
	});
	
	exports.default = Month;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Days = __webpack_require__(126);
	
	var _Days2 = _interopRequireDefault(_Days);
	
	var _Weekdays = __webpack_require__(128);
	
	var _Weekdays2 = _interopRequireDefault(_Weekdays);
	
	var _WeekNumbers = __webpack_require__(129);
	
	var _WeekNumbers2 = _interopRequireDefault(_WeekNumbers);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MonthView = function (_PureComponent) {
	  _inherits(MonthView, _PureComponent);
	
	  function MonthView() {
	    _classCallCheck(this, MonthView);
	
	    return _possibleConstructorReturn(this, (MonthView.__proto__ || Object.getPrototypeOf(MonthView)).apply(this, arguments));
	  }
	
	  _createClass(MonthView, [{
	    key: 'renderWeekdays',
	    value: function renderWeekdays() {
	      return _react2.default.createElement(_Weekdays2.default, {
	        calendarType: this.calendarType,
	        locale: this.props.locale,
	        month: this.props.activeStartDate,
	        formatShortWeekday: this.props.formatShortWeekday
	      });
	    }
	  }, {
	    key: 'renderWeekNumbers',
	    value: function renderWeekNumbers() {
	      var showWeekNumbers = this.props.showWeekNumbers;
	
	
	      if (!showWeekNumbers) {
	        return null;
	      }
	
	      return _react2.default.createElement(_WeekNumbers2.default, {
	        activeStartDate: this.props.activeStartDate,
	        calendarType: this.calendarType,
	        onClickWeekNumber: this.props.onClickWeekNumber
	      });
	    }
	  }, {
	    key: 'renderDays',
	    value: function renderDays() {
	      var _props = this.props,
	          calendarType = _props.calendarType,
	          showWeekNumbers = _props.showWeekNumbers,
	          childProps = _objectWithoutProperties(_props, ['calendarType', 'showWeekNumbers']);
	
	      return _react2.default.createElement(_Days2.default, _extends({
	        calendarType: this.calendarType
	      }, childProps));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var showWeekNumbers = this.props.showWeekNumbers;
	
	
	      var className = 'react-calendar__month-view';
	
	      return _react2.default.createElement(
	        'div',
	        {
	          className: [className, showWeekNumbers ? className + '--weekNumbers' : ''].join(' ')
	        },
	        _react2.default.createElement(
	          'div',
	          {
	            style: {
	              display: 'flex',
	              alignItems: 'flex-end'
	            }
	          },
	          this.renderWeekNumbers(),
	          _react2.default.createElement(
	            'div',
	            {
	              style: {
	                flexGrow: 1,
	                width: '100%'
	              }
	            },
	            this.renderWeekdays(),
	            this.renderDays()
	          )
	        )
	      );
	    }
	  }, {
	    key: 'calendarType',
	    get: function get() {
	      var _props2 = this.props,
	          calendarType = _props2.calendarType,
	          locale = _props2.locale;
	
	
	      if (calendarType) {
	        return calendarType;
	      }
	
	      switch (locale) {
	        case 'en-US':
	          return 'US';
	        default:
	          return 'ISO 8601';
	      }
	    }
	  }]);
	
	  return MonthView;
	}(_react.PureComponent);
	
	exports.default = MonthView;
	
	
	MonthView.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  calendarType: _propTypes3.isCalendarType,
	  formatShortWeekday: _propTypes2.default.func,
	  locale: _propTypes2.default.string,
	  maxDate: _propTypes3.isMaxDate,
	  minDate: _propTypes3.isMinDate,
	  onChange: _propTypes2.default.func,
	  onClickWeekNumber: _propTypes2.default.func,
	  setActiveRange: _propTypes2.default.func,
	  showNeighboringMonth: _propTypes2.default.bool,
	  showWeekNumbers: _propTypes2.default.bool,
	  value: _propTypes3.isValue,
	  valueType: _propTypes2.default.string
	};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _TileGroup = __webpack_require__(114);
	
	var _TileGroup2 = _interopRequireDefault(_TileGroup);
	
	var _Day = __webpack_require__(127);
	
	var _Day2 = _interopRequireDefault(_Day);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Days = function (_PureComponent) {
	  _inherits(Days, _PureComponent);
	
	  function Days() {
	    _classCallCheck(this, Days);
	
	    return _possibleConstructorReturn(this, (Days.__proto__ || Object.getPrototypeOf(Days)).apply(this, arguments));
	  }
	
	  _createClass(Days, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var monthIndex = this.monthIndex;
	
	      var _props = this.props,
	          activeStartDate = _props.activeStartDate,
	          calendarType = _props.calendarType,
	          showNeighboringMonth = _props.showNeighboringMonth,
	          otherProps = _objectWithoutProperties(_props, ['activeStartDate', 'calendarType', 'showNeighboringMonth']);
	
	      return _react2.default.createElement(_TileGroup2.default, _extends({}, otherProps, {
	        className: 'react-calendar__month-view__days',
	        count: 7,
	        dateTransform: function dateTransform(day) {
	          return new Date(_this2.year, monthIndex, day);
	        },
	        dateType: 'day',
	        end: this.end,
	        offset: this.offset,
	        start: this.start,
	        tile: _Day2.default
	        // Tile props
	        , currentMonthIndex: monthIndex
	      }));
	    }
	  }, {
	    key: 'offset',
	    get: function get() {
	      if (this.props.showNeighboringMonth) {
	        return 0;
	      }
	
	      var _props2 = this.props,
	          activeStartDate = _props2.activeStartDate,
	          calendarType = _props2.calendarType;
	
	      return (0, _dates.getDayOfWeek)(activeStartDate, calendarType);
	    }
	
	    /**
	     * Defines on which day of the month the grid shall start. If we simply show current
	     * month, we obviously start on day one, but if showNeighboringMonth is set to
	     * true, we need to find the beginning of the week the first day of the month is in.
	     */
	
	  }, {
	    key: 'start',
	    get: function get() {
	      if (this.props.showNeighboringMonth) {
	        var _props3 = this.props,
	            activeStartDate = _props3.activeStartDate,
	            calendarType = _props3.calendarType;
	
	        return -(0, _dates.getDayOfWeek)(activeStartDate, calendarType) + 1;
	      }
	      return 1;
	    }
	
	    /**
	     * Defines on which day of the month the grid shall end. If we simply show current
	     * month, we need to stop on the last day of the month, but if showNeighboringMonth
	     * is set to true, we need to find the end of the week the last day of the month is in.
	     */
	
	  }, {
	    key: 'end',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      var daysInMonth = (0, _dates.getDaysInMonth)(activeStartDate);
	      if (this.props.showNeighboringMonth) {
	        var year = this.year,
	            monthIndex = this.monthIndex;
	        var calendarType = this.props.calendarType;
	
	        var activeEndDate = new Date(year, monthIndex, daysInMonth);
	        return daysInMonth + (7 - (0, _dates.getDayOfWeek)(activeEndDate, calendarType) - 1);
	      }
	      return daysInMonth;
	    }
	  }, {
	    key: 'year',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getYear)(activeStartDate);
	    }
	  }, {
	    key: 'monthIndex',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getMonthIndex)(activeStartDate);
	    }
	  }]);
	
	  return Days;
	}(_react.PureComponent);
	
	exports.default = Days;
	
	
	Days.propTypes = _extends({
	  calendarType: _propTypes3.isCalendarType.isRequired,
	  showNeighboringMonth: _propTypes2.default.bool
	}, _propTypes3.tileGroupProps);

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Tile = __webpack_require__(118);
	
	var _Tile2 = _interopRequireDefault(_Tile);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var className = 'react-calendar__month-view__days__day';
	
	var Day = function Day(_ref) {
	  var classes = _ref.classes,
	      currentMonthIndex = _ref.currentMonthIndex,
	      date = _ref.date,
	      otherProps = _objectWithoutProperties(_ref, ['classes', 'currentMonthIndex', 'date']);
	
	  return _react2.default.createElement(
	    _Tile2.default,
	    _extends({}, otherProps, {
	      classes: [].concat(_toConsumableArray(classes), [className, (0, _dates.isWeekend)(date) ? className + '--weekend' : null, date.getMonth() !== currentMonthIndex ? className + '--neighboringMonth' : null]),
	      date: date,
	      dateTime: (0, _dates.getISOLocalDate)(date) + 'T00:00:00.000',
	      maxDateTransform: _dates.getEndOfDay,
	      minDateTransform: _dates.getBeginOfDay,
	      view: 'month'
	    }),
	    (0, _dates.getDay)(date)
	  );
	};
	
	Day.propTypes = _extends({
	  currentMonthIndex: _propTypes2.default.number.isRequired
	}, _propTypes3.tileProps);
	
	exports.default = Day;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _Flex = __webpack_require__(115);
	
	var _Flex2 = _interopRequireDefault(_Flex);
	
	var _dates = __webpack_require__(107);
	
	var _dateFormatter = __webpack_require__(108);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Weekdays = function (_Component) {
	  _inherits(Weekdays, _Component);
	
	  function Weekdays() {
	    _classCallCheck(this, Weekdays);
	
	    return _possibleConstructorReturn(this, (Weekdays.__proto__ || Object.getPrototypeOf(Weekdays)).apply(this, arguments));
	  }
	
	  _createClass(Weekdays, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps) {
	      return nextProps.calendarType !== this.props.calendarType || nextProps.locale !== this.props.locale;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          calendarType = _props.calendarType,
	          formatShortWeekday = _props.formatShortWeekday,
	          locale = _props.locale;
	      var beginOfMonth = this.beginOfMonth,
	          year = this.year,
	          monthIndex = this.monthIndex;
	
	
	      var weekdays = [];
	
	      for (var weekday = 1; weekday <= 7; weekday += 1) {
	        var weekdayDate = new Date(year, monthIndex, weekday - (0, _dates.getDayOfWeek)(beginOfMonth, calendarType));
	
	        weekdays.push(_react2.default.createElement(
	          'div',
	          {
	            className: 'react-calendar__month-view__weekdays__weekday',
	            key: weekday,
	            style: { flexGrow: 1 }
	          },
	          formatShortWeekday(weekdayDate, locale).replace('.', '')
	        ));
	      }
	
	      return _react2.default.createElement(
	        _Flex2.default,
	        {
	          className: 'react-calendar__month-view__weekdays',
	          count: 7
	        },
	        weekdays
	      );
	    }
	  }, {
	    key: 'beginOfMonth',
	    get: function get() {
	      var month = this.props.month;
	
	
	      return (0, _dates.getBeginOfMonth)(month);
	    }
	  }, {
	    key: 'year',
	    get: function get() {
	      var beginOfMonth = this.beginOfMonth;
	
	
	      return (0, _dates.getYear)(beginOfMonth);
	    }
	  }, {
	    key: 'monthIndex',
	    get: function get() {
	      var beginOfMonth = this.beginOfMonth;
	
	
	      return (0, _dates.getMonthIndex)(beginOfMonth);
	    }
	  }]);
	
	  return Weekdays;
	}(_react.Component);
	
	exports.default = Weekdays;
	
	
	Weekdays.defaultProps = {
	  formatShortWeekday: _dateFormatter.formatShortWeekday
	};
	
	Weekdays.propTypes = {
	  calendarType: _propTypes3.isCalendarType.isRequired,
	  formatShortWeekday: _propTypes2.default.func,
	  locale: _propTypes2.default.string,
	  month: _propTypes2.default.oneOfType([_propTypes2.default.string, // Only strings that are parseable to integer
	  _propTypes2.default.number, _propTypes2.default.instanceOf(Date)]).isRequired
	};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _WeekNumber = __webpack_require__(130);
	
	var _WeekNumber2 = _interopRequireDefault(_WeekNumber);
	
	var _Flex = __webpack_require__(115);
	
	var _Flex2 = _interopRequireDefault(_Flex);
	
	var _dates = __webpack_require__(107);
	
	var _propTypes3 = __webpack_require__(111);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var WeekNumbers = function (_PureComponent) {
	  _inherits(WeekNumbers, _PureComponent);
	
	  function WeekNumbers() {
	    _classCallCheck(this, WeekNumbers);
	
	    return _possibleConstructorReturn(this, (WeekNumbers.__proto__ || Object.getPrototypeOf(WeekNumbers)).apply(this, arguments));
	  }
	
	  _createClass(WeekNumbers, [{
	    key: 'render',
	    value: function render() {
	      var dates = this.dates,
	          numberOfWeeks = this.numberOfWeeks,
	          weekNumbers = this.weekNumbers;
	      var onClickWeekNumber = this.props.onClickWeekNumber;
	
	
	      return _react2.default.createElement(
	        _Flex2.default,
	        {
	          className: 'react-calendar__month-view__weekNumbers',
	          count: numberOfWeeks,
	          direction: 'column',
	          style: { flexBasis: 'calc(100% * (1 / 8)', flexShrink: 0 }
	        },
	        weekNumbers.map(function (weekNumber, weekIndex) {
	          return _react2.default.createElement(_WeekNumber2.default, {
	            date: dates[weekIndex],
	            key: weekNumber,
	            onClickWeekNumber: onClickWeekNumber,
	            weekNumber: weekNumber
	          });
	        })
	      );
	    }
	  }, {
	    key: 'startWeekday',
	    get: function get() {
	      var _props = this.props,
	          activeStartDate = _props.activeStartDate,
	          calendarType = _props.calendarType;
	
	      return (0, _dates.getDayOfWeek)(activeStartDate, calendarType);
	    }
	  }, {
	    key: 'numberOfDays',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getDaysInMonth)(activeStartDate);
	    }
	  }, {
	    key: 'numberOfWeeks',
	    get: function get() {
	      var days = this.numberOfDays - (7 - this.startWeekday);
	      return 1 + Math.ceil(days / 7);
	    }
	  }, {
	    key: 'year',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getYear)(activeStartDate);
	    }
	  }, {
	    key: 'monthIndex',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getMonthIndex)(activeStartDate);
	    }
	  }, {
	    key: 'day',
	    get: function get() {
	      var activeStartDate = this.props.activeStartDate;
	
	      return (0, _dates.getDay)(activeStartDate);
	    }
	  }, {
	    key: 'dates',
	    get: function get() {
	      var year = this.year,
	          monthIndex = this.monthIndex,
	          numberOfWeeks = this.numberOfWeeks,
	          day = this.day;
	      var calendarType = this.props.calendarType;
	
	
	      var dates = [];
	      for (var index = 0; index < numberOfWeeks; index += 1) {
	        dates.push((0, _dates.getBeginOfWeek)(new Date(year, monthIndex, day + index * 7), calendarType));
	      }
	      return dates;
	    }
	  }, {
	    key: 'weekNumbers',
	    get: function get() {
	      var dates = this.dates;
	      var calendarType = this.props.calendarType;
	
	      return dates.map(function (date) {
	        return (0, _dates.getWeekNumber)(date, calendarType);
	      });
	    }
	  }]);
	
	  return WeekNumbers;
	}(_react.PureComponent);
	
	exports.default = WeekNumbers;
	
	
	WeekNumbers.propTypes = {
	  activeStartDate: _propTypes2.default.instanceOf(Date).isRequired,
	  calendarType: _propTypes3.isCalendarType.isRequired,
	  onClickWeekNumber: _propTypes2.default.func
	};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var WeekNumber = function WeekNumber(_ref) {
	  var date = _ref.date,
	      onClickWeekNumber = _ref.onClickWeekNumber,
	      weekNumber = _ref.weekNumber;
	  return onClickWeekNumber ? _react2.default.createElement(
	    'button',
	    {
	      className: 'react-calendar__tile',
	      onClick: function onClick() {
	        return onClickWeekNumber(weekNumber, date);
	      },
	      style: { flexGrow: 1 },
	      type: 'button'
	    },
	    _react2.default.createElement(
	      'span',
	      null,
	      weekNumber
	    )
	  ) : _react2.default.createElement(
	    'div',
	    {
	      className: 'react-calendar__tile',
	      style: { flexGrow: 1 }
	    },
	    _react2.default.createElement(
	      'span',
	      null,
	      weekNumber
	    )
	  );
	};
	
	WeekNumber.propTypes = {
	  date: _propTypes2.default.instanceOf(Date).isRequired,
	  onClickWeekNumber: _propTypes2.default.func,
	  weekNumber: _propTypes2.default.number.isRequired
	};
	
	exports.default = WeekNumber;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(132);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../css-loader/index.js!./Calendar.css", function() {
				var newContent = require("!!../../css-loader/index.js!./Calendar.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, ".react-calendar {\n  width: 350px;\n  max-width: 100%;\n  background: white;\n  border: 1px solid #a0a096;\n  font-family: Arial, Helvetica, sans-serif;\n  line-height: 1.125em;\n}\n.react-calendar,\n.react-calendar *,\n.react-calendar *:before,\n.react-calendar *:after {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n.react-calendar button {\n  margin: 0;\n  border: 0;\n  outline: none;\n}\n.react-calendar button:enabled:hover {\n  cursor: pointer;\n}\n.react-calendar__navigation {\n  height: 44px;\n  margin-bottom: 1em;\n}\n.react-calendar__navigation button {\n  min-width: 44px;\n  background: none;\n}\n.react-calendar__navigation button:enabled:hover,\n.react-calendar__navigation button:enabled:focus {\n  background-color: #e6e6e6;\n}\n.react-calendar__navigation button[disabled] {\n  background-color: #f0f0f0;\n}\n.react-calendar__month-view__weekdays {\n  text-align: center;\n  text-transform: uppercase;\n  font-weight: bold;\n  font-size: .75em;\n}\n.react-calendar__month-view__weekdays__weekday {\n  padding: .5em;\n}\n.react-calendar__month-view__weekNumbers {\n  font-weight: bold;\n}\n.react-calendar__month-view__weekNumbers .react-calendar__tile {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: .75em;\n  padding: calc(1em) calc(0.66666667em);\n}\n.react-calendar__month-view__days__day--weekend {\n  color: red;\n}\n.react-calendar__month-view__days__day--neighboringMonth {\n  color: #969696;\n}\n.react-calendar__year-view .react-calendar__tile,\n.react-calendar__decade-view .react-calendar__tile,\n.react-calendar__century-view .react-calendar__tile {\n  padding: 2em .5em;\n}\n.react-calendar__tile {\n  max-width: 100%;\n  text-align: center;\n  padding: .75em .5em;\n  background: none;\n}\nbutton.react-calendar__tile:disabled {\n  background-color: #f0f0f0;\n}\nbutton.react-calendar__tile:enabled:hover,\nbutton.react-calendar__tile:enabled:focus {\n  background-color: #e6e6e6;\n}\n.react-calendar__tile--hasActive {\n  background: #76baff;\n}\nbutton.react-calendar__tile--hasActive:enabled:hover,\nbutton.react-calendar__tile--hasActive:enabled:focus {\n  background: #a9d4ff;\n}\n.react-calendar__tile--active {\n  background: #006edc;\n  color: white;\n}\nbutton.react-calendar__tile--active:enabled:hover,\nbutton.react-calendar__tile--active:enabled:focus {\n  background: #1087ff;\n}\n.react-calendar--selectRange .react-calendar__tile--hover {\n  background-color: #e6e6e6;\n}\n", ""]);
	
	// exports


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Popover = __webpack_require__(134);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Popover).default;
	  }
	});
	
	var _PopoverArrow = __webpack_require__(350);
	
	Object.defineProperty(exports, 'PopoverArrow', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_PopoverArrow).default;
	  }
	});
	
	var _PopoverContent = __webpack_require__(289);
	
	Object.defineProperty(exports, 'PopoverContent', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_PopoverContent).default;
	  }
	});
	
	var _PopoverTrigger = __webpack_require__(288);
	
	Object.defineProperty(exports, 'PopoverTrigger', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_PopoverTrigger).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(135);
	
	var _reactPopper = __webpack_require__(277);
	
	var _styles = __webpack_require__(48);
	
	var _utils = __webpack_require__(92);
	
	var _EventListener = __webpack_require__(283);
	
	var _EventListener2 = _interopRequireDefault(_EventListener);
	
	var _Portal = __webpack_require__(286);
	
	var _Portal2 = _interopRequireDefault(_Portal);
	
	var _PopoverTrigger = __webpack_require__(288);
	
	var _PopoverTrigger2 = _interopRequireDefault(_PopoverTrigger);
	
	var _PopoverContent = __webpack_require__(289);
	
	var _PopoverContent2 = _interopRequireDefault(_PopoverContent);
	
	var _PopoverArrow = __webpack_require__(350);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({}, (0, _PopoverArrow.componentTheme)(baseTheme), (0, _PopoverContent.componentTheme)(baseTheme), baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)(_reactPopper.Manager, {
	  display: 'inline-block'
	}, {
	  displayName: 'Popover',
	  includeStyleReset: true,
	  forwardProps: ['tag'],
	  rootEl: 'span'
	});
	
	/**
	 * Popovers float over page content and hold supporting information or user controls.
	 */
	
	var Popover = function (_Component) {
	  _inherits(Popover, _Component);
	
	  function Popover() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Popover);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Popover.__proto__ || Object.getPrototypeOf(Popover)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      isOpen: Boolean(_this.props.defaultIsOpen)
	    }, _this.id = _this.props.id || 'popover-' + (0, _utils.generateId)(), _this.renderPopoverContent = function () {
	      var _this$props = _this.props,
	          content = _this$props.content,
	          usePortal = _this$props.usePortal,
	          wrapContent = _this$props.wrapContent;
	
	      var popoverContent = void 0;
	
	      if (wrapContent) {
	        popoverContent = _react2.default.createElement(
	          _PopoverContent2.default,
	          _this.getContentProps(),
	          content
	        );
	      } else {
	        popoverContent = (0, _react.cloneElement)(content, {
	          ref: function ref(node) {
	            _this.popoverContent = node;
	          }
	        });
	      }
	
	      if (usePortal) {
	        popoverContent = _jsx(_Portal2.default, {}, void 0, popoverContent);
	      }
	
	      return popoverContent;
	    }, _this.getContentId = function () {
	      return _this.id + '-content';
	    }, _this.getTriggerProps = function () {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      var contentId = _this.getContentId();
	      var isOpen = _this.getControllableValue('isOpen');
	      var _this$props2 = _this.props,
	          children = _this$props2.children,
	          disabled = _this$props2.disabled,
	          getTriggerProps = _this$props2.getTriggerProps,
	          triggerRef = _this$props2.triggerRef;
	
	      var child = _react.Children.only(children);
	
	      return (0, _utils.composePropsWithGetter)(_extends({}, props, {
	
	        // Props set by this component
	        'aria-describedby': contentId,
	        'aria-disabled': disabled,
	        'aria-expanded': isOpen,
	        'aria-owns': contentId,
	        children: child,
	        disabled: child.props.disabled !== undefined ? child.props.disabled : disabled,
	        onBlur: _this.onBlur,
	        onClick: !disabled ? (0, _utils.composeEventHandlers)(child.props.onClick, _this.toggleOpenState) : undefined,
	        ref: function ref(node) {
	          _this.popoverTrigger = node;
	          triggerRef && triggerRef(node);
	        },
	        role: 'button'
	      }),
	      // Custom prop getter can override all values
	      getTriggerProps);
	    }, _this.getContentProps = function () {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      var contentId = _this.getContentId();
	      var _this$props3 = _this.props,
	          getContentProps = _this$props3.getContentProps,
	          hasArrow = _this$props3.hasArrow,
	          modifiers = _this$props3.modifiers,
	          placement = _this$props3.placement,
	          subtitle = _this$props3.subtitle,
	          title = _this$props3.title;
	
	
	      return (0, _utils.composePropsWithGetter)(_extends({}, props, {
	
	        // Props set by this component
	        hasArrow: hasArrow,
	        id: contentId,
	        modifiers: modifiers,
	        onBlur: _this.onBlur,
	        placement: placement,
	        ref: function ref(node) {
	          _this.popoverContent = node;
	        },
	        subtitle: subtitle,
	        tabIndex: 0,
	        title: title
	      }),
	      // Custom prop getter can override all values
	      getContentProps);
	    }, _this.onBlur = function (event) {
	      var isOpen = _this.getControllableValue('isOpen');
	      if (isOpen && _this.isEventOutsideComponent(event)) {
	        _this.close(event);
	      }
	    }, _this.close = function (event) {
	      if (_this.isControlled('isOpen')) {
	        _this.closeActions(event);
	      } else {
	        _this.setState(function () {
	          return { isOpen: false };
	        }, function () {
	          _this.closeActions(event);
	        });
	      }
	    }, _this.closeActions = function (event) {
	      var _this$props4 = _this.props,
	          focusTriggerOnClose = _this$props4.focusTriggerOnClose,
	          onClose = _this$props4.onClose;
	
	      onClose && onClose(event);
	      var isOpen = _this.getControllableValue('isOpen');
	      !isOpen && focusTriggerOnClose && _this.focusTrigger();
	    }, _this.focusTrigger = function () {
	      var node = (0, _reactDom.findDOMNode)(_this.popoverTrigger); // eslint-disable-line react/no-find-dom-node
	      if (node && node.firstChild && node.firstChild instanceof HTMLElement) {
	        node.firstChild.focus();
	      }
	    }, _this.handleDocumentClick = function (event) {
	      if (_this.isEventOutsideComponent(event)) {
	        _this.close(event);
	      }
	    }, _this.handleDocumentKeydown = function (event) {
	      if (event.key === 'Escape') {
	        _this.close(event);
	      }
	    }, _this.isEventOutsideComponent = function (event) {
	      /* eslint-disable react/no-find-dom-node */
	      var usePortal = _this.props.usePortal;
	
	      var node = (0, _reactDom.findDOMNode)(_this);
	      var popoverContentNode = (0, _reactDom.findDOMNode)(_this.popoverContent);
	      var target = event.type === 'blur' && event.relatedTarget ? event.relatedTarget : event.target;
	
	      if (usePortal) {
	        return node && node instanceof HTMLElement && target && target instanceof HTMLElement && !node.contains(target) && popoverContentNode && popoverContentNode instanceof HTMLElement && !popoverContentNode.contains(target);
	      } else {
	        return node && node instanceof HTMLElement && target && target instanceof HTMLElement && !node.contains(target);
	      }
	    }, _this.open = function (event) {
	      if (_this.isControlled('isOpen')) {
	        _this.openActions(event);
	      } else {
	        _this.setState(function () {
	          return { isOpen: true };
	        }, function () {
	          _this.openActions(event);
	        });
	      }
	    }, _this.openActions = function (event) {
	      _this.focusTrigger();
	      _this.props.onOpen && _this.props.onOpen(event);
	    }, _this.toggleOpenState = function (event) {
	      var isOpen = _this.getControllableValue('isOpen');
	      if (isOpen) {
	        _this.close(event);
	      } else {
	        _this.open(event);
	      }
	    }, _this.isControlled = function (prop) {
	      return _this.props.hasOwnProperty(prop);
	    }, _this.getControllableValue = function (key) {
	      return _this.isControlled(key) ? _this.props[key] : _this.state[key];
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Popover, [{
	    key: 'render',
	    value: function render() {
	      var restProps = _objectWithoutProperties(this.props, []);
	
	      var isOpen = this.getControllableValue('isOpen');
	
	      var rootProps = _extends({}, restProps, {
	        tag: 'span'
	      });
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        _react2.default.createElement(_PopoverTrigger2.default, this.getTriggerProps()),
	        isOpen && this.renderPopoverContent(),
	        isOpen && _jsx(_EventListener2.default, {
	          listeners: [{
	            target: 'document',
	            event: 'click',
	            handler: this.handleDocumentClick,
	            options: true
	          }, {
	            target: 'document',
	            event: 'keydown',
	            handler: this.handleDocumentKeydown,
	            options: true
	          }]
	        })
	      );
	    }
	  }]);
	
	  return Popover;
	}(_react.Component);
	
	Popover.propTypes = {
	  /** Trigger for the Popover */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node).isRequired : __webpack_require__(82).any.isRequired,
	
	  /** Content of the Popover */
	  content: typeof $FlowFixMe === 'function' ? __webpack_require__(82).instanceOf($FlowFixMe).isRequired : __webpack_require__(82).any.isRequired,
	
	  /**
	   * Open the Popover upon initialization. Primarily for use with uncontrolled
	   * components.
	   */
	  defaultIsOpen: __webpack_require__(82).bool,
	
	  /** Disables the Popover */
	  disabled: __webpack_require__(82).bool,
	
	  /**
	   * Determines whether focus will be set to the trigger when the Popover is
	   * closed.
	   */
	  focusTriggerOnClose: __webpack_require__(82).bool,
	
	  /** Include an arrow on the Popover content pointing to the trigger */
	  hasArrow: __webpack_require__(82).bool,
	
	  /** Id of the Popover */
	  id: __webpack_require__(82).string,
	
	  /** Determines whether the Popover is open. For use with controlled components. */
	  isOpen: __webpack_require__(82).bool,
	
	  /**
	   * Plugins that are used to alter behavior. See
	   * [PopperJS docs](https://popper.js.org/popper-documentation.html#modifiers)
	   * for options.
	   */
	  modifiers: __webpack_require__(82).object,
	
	  /** Called when Popover is closed */
	  onClose: __webpack_require__(82).func,
	
	  /** Called when Popover is opened */
	  onOpen: __webpack_require__(82).func,
	
	  /** @Private Function that returns props to be applied to the content */
	  getContentProps: __webpack_require__(82).func,
	
	  /** @Private Function that returns props to be applied to the trigger */
	  getTriggerProps: __webpack_require__(82).func,
	
	  /** Placement of the Popover */
	  placement: __webpack_require__(82).oneOf(['auto', 'auto-end', 'auto-start', 'bottom', 'bottom-end', 'bottom-start', 'left', 'left-end', 'left-start', 'right', 'right-end', 'right-start', 'top', 'top-end', 'top-start']),
	
	  /** Subtitle displayed under the title */
	  subtitle: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Title of the Popover */
	  title: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** @Private ref for the Popover trigger */
	  triggerRef: __webpack_require__(82).func,
	
	  /** Use a Portal to render the Popover to the body rather than as a sibling to the trigger */
	  usePortal: __webpack_require__(82).bool,
	
	  /** Display the content with default styles */
	  wrapContent: __webpack_require__(82).bool
	};
	Popover.defaultProps = {
	  focusTriggerOnClose: true,
	  hasArrow: true,
	  placement: 'bottom',
	  wrapContent: true
	};
	exports.default = Popover;

/***/ }),
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Arrow = exports.Popper = exports.Target = exports.Manager = undefined;
	
	var _Manager2 = __webpack_require__(278);
	
	var _Manager3 = _interopRequireDefault(_Manager2);
	
	var _Target2 = __webpack_require__(279);
	
	var _Target3 = _interopRequireDefault(_Target2);
	
	var _Popper2 = __webpack_require__(280);
	
	var _Popper3 = _interopRequireDefault(_Popper2);
	
	var _Arrow2 = __webpack_require__(282);
	
	var _Arrow3 = _interopRequireDefault(_Arrow2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.Manager = _Manager3.default;
	exports.Target = _Target3.default;
	exports.Popper = _Popper3.default;
	exports.Arrow = _Arrow3.default;

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Manager = function (_Component) {
	  _inherits(Manager, _Component);
	
	  function Manager() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Manager);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Manager.__proto__ || Object.getPrototypeOf(Manager)).call.apply(_ref, [this].concat(args))), _this), _this._setTargetNode = function (node) {
	      _this._targetNode = node;
	    }, _this._getTargetNode = function () {
	      return _this._targetNode;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Manager, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return {
	        popperManager: {
	          setTargetNode: this._setTargetNode,
	          getTargetNode: this._getTargetNode
	        }
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          tag = _props.tag,
	          children = _props.children,
	          restProps = _objectWithoutProperties(_props, ['tag', 'children']);
	
	      if (tag !== false) {
	        return (0, _react.createElement)(tag, restProps, children);
	      } else {
	        return children;
	      }
	    }
	  }]);
	
	  return Manager;
	}(_react.Component);
	
	Manager.childContextTypes = {
	  popperManager: _propTypes2.default.object.isRequired
	};
	Manager.propTypes = {
	  tag: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool])
	};
	Manager.defaultProps = {
	  tag: 'div'
	};
	exports.default = Manager;

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var Target = function Target(props, context) {
	  var _props$component = props.component,
	      component = _props$component === undefined ? 'div' : _props$component,
	      innerRef = props.innerRef,
	      children = props.children,
	      restProps = _objectWithoutProperties(props, ['component', 'innerRef', 'children']);
	
	  var popperManager = context.popperManager;
	
	  var targetRef = function targetRef(node) {
	    popperManager.setTargetNode(node);
	    if (typeof innerRef === 'function') {
	      innerRef(node);
	    }
	  };
	
	  if (typeof children === 'function') {
	    var targetProps = { ref: targetRef };
	    return children({ targetProps: targetProps, restProps: restProps });
	  }
	
	  var componentProps = _extends({}, restProps);
	
	  if (typeof component === 'string') {
	    componentProps.ref = targetRef;
	  } else {
	    componentProps.innerRef = targetRef;
	  }
	
	  return (0, _react.createElement)(component, componentProps, children);
	};
	
	Target.contextTypes = {
	  popperManager: _propTypes2.default.object.isRequired
	};
	
	Target.propTypes = {
	  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
	  innerRef: _propTypes2.default.func,
	  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
	};
	
	exports.default = Target;

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _popper = __webpack_require__(281);
	
	var _popper2 = _interopRequireDefault(_popper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var noop = function noop() {
	  return null;
	};
	
	var Popper = function (_Component) {
	  _inherits(Popper, _Component);
	
	  function Popper() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Popper);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Popper.__proto__ || Object.getPrototypeOf(Popper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this._setArrowNode = function (node) {
	      _this._arrowNode = node;
	    }, _this._getTargetNode = function () {
	      return _this.context.popperManager.getTargetNode();
	    }, _this._getOffsets = function (data) {
	      return Object.keys(data.offsets).map(function (key) {
	        return data.offsets[key];
	      });
	    }, _this._isDataDirty = function (data) {
	      if (_this.state.data) {
	        return JSON.stringify(_this._getOffsets(_this.state.data)) !== JSON.stringify(_this._getOffsets(data));
	      } else {
	        return true;
	      }
	    }, _this._updateStateModifier = {
	      enabled: true,
	      order: 900,
	      fn: function fn(data) {
	        if (_this._isDataDirty(data)) {
	          _this.setState({ data: data });
	        }
	        return data;
	      }
	    }, _this._getPopperStyle = function () {
	      var data = _this.state.data;
	
	      // If Popper isn't instantiated, hide the popperElement
	      // to avoid flash of unstyled content
	
	      if (!_this._popper || !data) {
	        return {
	          position: 'absolute',
	          pointerEvents: 'none',
	          opacity: 0
	        };
	      }
	
	      var _data$offsets$popper = data.offsets.popper,
	          top = _data$offsets$popper.top,
	          left = _data$offsets$popper.left,
	          position = _data$offsets$popper.position;
	
	
	      return _extends({
	        position: position
	      }, data.styles);
	    }, _this._getPopperPlacement = function () {
	      return !!_this.state.data ? _this.state.data.placement : undefined;
	    }, _this._getPopperHide = function () {
	      return !!_this.state.data && _this.state.data.hide ? '' : undefined;
	    }, _this._getArrowStyle = function () {
	      if (!_this.state.data || !_this.state.data.offsets.arrow) {
	        return {};
	      } else {
	        var _this$state$data$offs = _this.state.data.offsets.arrow,
	            top = _this$state$data$offs.top,
	            left = _this$state$data$offs.left;
	
	        return { top: top, left: left };
	      }
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Popper, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return {
	        popper: {
	          setArrowNode: this._setArrowNode,
	          getArrowStyle: this._getArrowStyle
	        }
	      };
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._updatePopper();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(lastProps) {
	      if (lastProps.placement !== this.props.placement || lastProps.eventsEnabled !== this.props.eventsEnabled) {
	        this._updatePopper();
	      }
	
	      if (this._popper && lastProps.children !== this.props.children) {
	        this._popper.scheduleUpdate();
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this._destroyPopper();
	    }
	  }, {
	    key: '_updatePopper',
	    value: function _updatePopper() {
	      this._destroyPopper();
	      if (this._node) {
	        this._createPopper();
	      }
	    }
	  }, {
	    key: '_createPopper',
	    value: function _createPopper() {
	      var _props = this.props,
	          placement = _props.placement,
	          eventsEnabled = _props.eventsEnabled;
	
	      var modifiers = _extends({}, this.props.modifiers, {
	        applyStyle: { enabled: false },
	        updateState: this._updateStateModifier
	      });
	
	      if (this._arrowNode) {
	        modifiers.arrow = {
	          element: this._arrowNode
	        };
	      }
	
	      this._popper = new _popper2.default(this._getTargetNode(), this._node, {
	        placement: placement,
	        eventsEnabled: eventsEnabled,
	        modifiers: modifiers
	      });
	
	      // schedule an update to make sure everything gets positioned correct
	      // after being instantiated
	      this._popper.scheduleUpdate();
	    }
	  }, {
	    key: '_destroyPopper',
	    value: function _destroyPopper() {
	      if (this._popper) {
	        this._popper.destroy();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _props2 = this.props,
	          component = _props2.component,
	          innerRef = _props2.innerRef,
	          placement = _props2.placement,
	          eventsEnabled = _props2.eventsEnabled,
	          modifiers = _props2.modifiers,
	          children = _props2.children,
	          restProps = _objectWithoutProperties(_props2, ['component', 'innerRef', 'placement', 'eventsEnabled', 'modifiers', 'children']);
	
	      var popperRef = function popperRef(node) {
	        _this2._node = node;
	        if (typeof innerRef === 'function') {
	          innerRef(node);
	        }
	      };
	      var popperStyle = this._getPopperStyle();
	      var popperPlacement = this._getPopperPlacement();
	      var popperHide = this._getPopperHide();
	
	      if (typeof children === 'function') {
	        var _popperProps;
	
	        var popperProps = (_popperProps = {
	          ref: popperRef,
	          style: popperStyle
	        }, _defineProperty(_popperProps, 'data-placement', popperPlacement), _defineProperty(_popperProps, 'data-x-out-of-boundaries', popperHide), _popperProps);
	        return children({
	          popperProps: popperProps,
	          restProps: restProps,
	          scheduleUpdate: this._popper && this._popper.scheduleUpdate
	        });
	      }
	
	      var componentProps = _extends({}, restProps, {
	        style: _extends({}, restProps.style, popperStyle),
	        'data-placement': popperPlacement,
	        'data-x-out-of-boundaries': popperHide
	      });
	
	      if (typeof component === 'string') {
	        componentProps.ref = popperRef;
	      } else {
	        componentProps.innerRef = popperRef;
	      }
	
	      return (0, _react.createElement)(component, componentProps, children);
	    }
	  }]);
	
	  return Popper;
	}(_react.Component);
	
	Popper.contextTypes = {
	  popperManager: _propTypes2.default.object.isRequired
	};
	Popper.childContextTypes = {
	  popper: _propTypes2.default.object.isRequired
	};
	Popper.propTypes = {
	  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
	  innerRef: _propTypes2.default.func,
	  placement: _propTypes2.default.oneOf(_popper2.default.placements),
	  eventsEnabled: _propTypes2.default.bool,
	  modifiers: _propTypes2.default.object,
	  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
	};
	Popper.defaultProps = {
	  component: 'div',
	  placement: 'bottom',
	  eventsEnabled: true,
	  modifiers: {}
	};
	exports.default = Popper;

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**!
	 * @fileOverview Kickass library to create and place poppers near their reference elements.
	 * @version 1.14.1
	 * @license
	 * Copyright (c) 2016 Federico Zivolo and contributors
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */
	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.Popper = factory());
	}(this, (function () { 'use strict';
	
	var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
	var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
	var timeoutDuration = 0;
	for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
	  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
	    timeoutDuration = 1;
	    break;
	  }
	}
	
	function microtaskDebounce(fn) {
	  var called = false;
	  return function () {
	    if (called) {
	      return;
	    }
	    called = true;
	    window.Promise.resolve().then(function () {
	      called = false;
	      fn();
	    });
	  };
	}
	
	function taskDebounce(fn) {
	  var scheduled = false;
	  return function () {
	    if (!scheduled) {
	      scheduled = true;
	      setTimeout(function () {
	        scheduled = false;
	        fn();
	      }, timeoutDuration);
	    }
	  };
	}
	
	var supportsMicroTasks = isBrowser && window.Promise;
	
	/**
	* Create a debounced version of a method, that's asynchronously deferred
	* but called in the minimum time possible.
	*
	* @method
	* @memberof Popper.Utils
	* @argument {Function} fn
	* @returns {Function}
	*/
	var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;
	
	/**
	 * Check if the given variable is a function
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Any} functionToCheck - variable to check
	 * @returns {Boolean} answer to: is a function?
	 */
	function isFunction(functionToCheck) {
	  var getType = {};
	  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	
	/**
	 * Get CSS computed property of the given element
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Eement} element
	 * @argument {String} property
	 */
	function getStyleComputedProperty(element, property) {
	  if (element.nodeType !== 1) {
	    return [];
	  }
	  // NOTE: 1 DOM access here
	  var css = getComputedStyle(element, null);
	  return property ? css[property] : css;
	}
	
	/**
	 * Returns the parentNode or the host of the element
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @returns {Element} parent
	 */
	function getParentNode(element) {
	  if (element.nodeName === 'HTML') {
	    return element;
	  }
	  return element.parentNode || element.host;
	}
	
	/**
	 * Returns the scrolling parent of the given element
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @returns {Element} scroll parent
	 */
	function getScrollParent(element) {
	  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
	  if (!element) {
	    return document.body;
	  }
	
	  switch (element.nodeName) {
	    case 'HTML':
	    case 'BODY':
	      return element.ownerDocument.body;
	    case '#document':
	      return element.body;
	  }
	
	  // Firefox want us to check `-x` and `-y` variations as well
	
	  var _getStyleComputedProp = getStyleComputedProperty(element),
	      overflow = _getStyleComputedProp.overflow,
	      overflowX = _getStyleComputedProp.overflowX,
	      overflowY = _getStyleComputedProp.overflowY;
	
	  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
	    return element;
	  }
	
	  return getScrollParent(getParentNode(element));
	}
	
	/**
	 * Tells if you are running Internet Explorer
	 * @method
	 * @memberof Popper.Utils
	 * @argument {number} version to check
	 * @returns {Boolean} isIE
	 */
	var cache = {};
	
	var isIE = function () {
	  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
	
	  version = version.toString();
	  if (cache.hasOwnProperty(version)) {
	    return cache[version];
	  }
	  switch (version) {
	    case '11':
	      cache[version] = navigator.userAgent.indexOf('Trident') !== -1;
	      break;
	    case '10':
	      cache[version] = navigator.appVersion.indexOf('MSIE 10') !== -1;
	      break;
	    case 'all':
	      cache[version] = navigator.userAgent.indexOf('Trident') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1;
	      break;
	  }
	
	  //Set IE
	  cache.all = cache.all || Object.keys(cache).some(function (key) {
	    return cache[key];
	  });
	  return cache[version];
	};
	
	/**
	 * Returns the offset parent of the given element
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @returns {Element} offset parent
	 */
	function getOffsetParent(element) {
	  if (!element) {
	    return document.documentElement;
	  }
	
	  var noOffsetParent = isIE(10) ? document.body : null;
	
	  // NOTE: 1 DOM access here
	  var offsetParent = element.offsetParent;
	  // Skip hidden elements which don't have an offsetParent
	  while (offsetParent === noOffsetParent && element.nextElementSibling) {
	    offsetParent = (element = element.nextElementSibling).offsetParent;
	  }
	
	  var nodeName = offsetParent && offsetParent.nodeName;
	
	  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
	    return element ? element.ownerDocument.documentElement : document.documentElement;
	  }
	
	  // .offsetParent will return the closest TD or TABLE in case
	  // no offsetParent is present, I hate this job...
	  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
	    return getOffsetParent(offsetParent);
	  }
	
	  return offsetParent;
	}
	
	function isOffsetContainer(element) {
	  var nodeName = element.nodeName;
	
	  if (nodeName === 'BODY') {
	    return false;
	  }
	  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
	}
	
	/**
	 * Finds the root node (document, shadowDOM root) of the given element
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} node
	 * @returns {Element} root node
	 */
	function getRoot(node) {
	  if (node.parentNode !== null) {
	    return getRoot(node.parentNode);
	  }
	
	  return node;
	}
	
	/**
	 * Finds the offset parent common to the two provided nodes
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element1
	 * @argument {Element} element2
	 * @returns {Element} common offset parent
	 */
	function findCommonOffsetParent(element1, element2) {
	  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
	  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
	    return document.documentElement;
	  }
	
	  // Here we make sure to give as "start" the element that comes first in the DOM
	  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
	  var start = order ? element1 : element2;
	  var end = order ? element2 : element1;
	
	  // Get common ancestor container
	  var range = document.createRange();
	  range.setStart(start, 0);
	  range.setEnd(end, 0);
	  var commonAncestorContainer = range.commonAncestorContainer;
	
	  // Both nodes are inside #document
	
	  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
	    if (isOffsetContainer(commonAncestorContainer)) {
	      return commonAncestorContainer;
	    }
	
	    return getOffsetParent(commonAncestorContainer);
	  }
	
	  // one of the nodes is inside shadowDOM, find which one
	  var element1root = getRoot(element1);
	  if (element1root.host) {
	    return findCommonOffsetParent(element1root.host, element2);
	  } else {
	    return findCommonOffsetParent(element1, getRoot(element2).host);
	  }
	}
	
	/**
	 * Gets the scroll value of the given element in the given side (top and left)
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @argument {String} side `top` or `left`
	 * @returns {number} amount of scrolled pixels
	 */
	function getScroll(element) {
	  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';
	
	  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
	  var nodeName = element.nodeName;
	
	  if (nodeName === 'BODY' || nodeName === 'HTML') {
	    var html = element.ownerDocument.documentElement;
	    var scrollingElement = element.ownerDocument.scrollingElement || html;
	    return scrollingElement[upperSide];
	  }
	
	  return element[upperSide];
	}
	
	/*
	 * Sum or subtract the element scroll values (left and top) from a given rect object
	 * @method
	 * @memberof Popper.Utils
	 * @param {Object} rect - Rect object you want to change
	 * @param {HTMLElement} element - The element from the function reads the scroll values
	 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
	 * @return {Object} rect - The modifier rect object
	 */
	function includeScroll(rect, element) {
	  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	  var scrollTop = getScroll(element, 'top');
	  var scrollLeft = getScroll(element, 'left');
	  var modifier = subtract ? -1 : 1;
	  rect.top += scrollTop * modifier;
	  rect.bottom += scrollTop * modifier;
	  rect.left += scrollLeft * modifier;
	  rect.right += scrollLeft * modifier;
	  return rect;
	}
	
	/*
	 * Helper to detect borders of a given element
	 * @method
	 * @memberof Popper.Utils
	 * @param {CSSStyleDeclaration} styles
	 * Result of `getStyleComputedProperty` on the given element
	 * @param {String} axis - `x` or `y`
	 * @return {number} borders - The borders size of the given axis
	 */
	
	function getBordersSize(styles, axis) {
	  var sideA = axis === 'x' ? 'Left' : 'Top';
	  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';
	
	  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
	}
	
	function getSize(axis, body, html, computedStyle) {
	  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
	}
	
	function getWindowSizes() {
	  var body = document.body;
	  var html = document.documentElement;
	  var computedStyle = isIE(10) && getComputedStyle(html);
	
	  return {
	    height: getSize('Height', body, html, computedStyle),
	    width: getSize('Width', body, html, computedStyle)
	  };
	}
	
	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();
	
	
	
	
	
	var defineProperty = function (obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};
	
	/**
	 * Given element offsets, generate an output similar to getBoundingClientRect
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Object} offsets
	 * @returns {Object} ClientRect like output
	 */
	function getClientRect(offsets) {
	  return _extends({}, offsets, {
	    right: offsets.left + offsets.width,
	    bottom: offsets.top + offsets.height
	  });
	}
	
	/**
	 * Get bounding client rect of given element
	 * @method
	 * @memberof Popper.Utils
	 * @param {HTMLElement} element
	 * @return {Object} client rect
	 */
	function getBoundingClientRect(element) {
	  var rect = {};
	
	  // IE10 10 FIX: Please, don't ask, the element isn't
	  // considered in DOM in some circumstances...
	  // This isn't reproducible in IE10 compatibility mode of IE11
	  try {
	    if (isIE(10)) {
	      rect = element.getBoundingClientRect();
	      var scrollTop = getScroll(element, 'top');
	      var scrollLeft = getScroll(element, 'left');
	      rect.top += scrollTop;
	      rect.left += scrollLeft;
	      rect.bottom += scrollTop;
	      rect.right += scrollLeft;
	    } else {
	      rect = element.getBoundingClientRect();
	    }
	  } catch (e) {}
	
	  var result = {
	    left: rect.left,
	    top: rect.top,
	    width: rect.right - rect.left,
	    height: rect.bottom - rect.top
	  };
	
	  // subtract scrollbar size from sizes
	  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
	  var width = sizes.width || element.clientWidth || result.right - result.left;
	  var height = sizes.height || element.clientHeight || result.bottom - result.top;
	
	  var horizScrollbar = element.offsetWidth - width;
	  var vertScrollbar = element.offsetHeight - height;
	
	  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
	  // we make this check conditional for performance reasons
	  if (horizScrollbar || vertScrollbar) {
	    var styles = getStyleComputedProperty(element);
	    horizScrollbar -= getBordersSize(styles, 'x');
	    vertScrollbar -= getBordersSize(styles, 'y');
	
	    result.width -= horizScrollbar;
	    result.height -= vertScrollbar;
	  }
	
	  return getClientRect(result);
	}
	
	function getOffsetRectRelativeToArbitraryNode(children, parent) {
	  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	  var isIE10 = isIE(10);
	  var isHTML = parent.nodeName === 'HTML';
	  var childrenRect = getBoundingClientRect(children);
	  var parentRect = getBoundingClientRect(parent);
	  var scrollParent = getScrollParent(children);
	
	  var styles = getStyleComputedProperty(parent);
	  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
	  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);
	
	  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
	  if (fixedPosition && parent.nodeName === 'HTML') {
	    parentRect.top = Math.max(parentRect.top, 0);
	    parentRect.left = Math.max(parentRect.left, 0);
	  }
	  var offsets = getClientRect({
	    top: childrenRect.top - parentRect.top - borderTopWidth,
	    left: childrenRect.left - parentRect.left - borderLeftWidth,
	    width: childrenRect.width,
	    height: childrenRect.height
	  });
	  offsets.marginTop = 0;
	  offsets.marginLeft = 0;
	
	  // Subtract margins of documentElement in case it's being used as parent
	  // we do this only on HTML because it's the only element that behaves
	  // differently when margins are applied to it. The margins are included in
	  // the box of the documentElement, in the other cases not.
	  if (!isIE10 && isHTML) {
	    var marginTop = parseFloat(styles.marginTop, 10);
	    var marginLeft = parseFloat(styles.marginLeft, 10);
	
	    offsets.top -= borderTopWidth - marginTop;
	    offsets.bottom -= borderTopWidth - marginTop;
	    offsets.left -= borderLeftWidth - marginLeft;
	    offsets.right -= borderLeftWidth - marginLeft;
	
	    // Attach marginTop and marginLeft because in some circumstances we may need them
	    offsets.marginTop = marginTop;
	    offsets.marginLeft = marginLeft;
	  }
	
	  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
	    offsets = includeScroll(offsets, parent);
	  }
	
	  return offsets;
	}
	
	function getViewportOffsetRectRelativeToArtbitraryNode(element) {
	  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	  var html = element.ownerDocument.documentElement;
	  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
	  var width = Math.max(html.clientWidth, window.innerWidth || 0);
	  var height = Math.max(html.clientHeight, window.innerHeight || 0);
	
	  var scrollTop = !excludeScroll ? getScroll(html) : 0;
	  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;
	
	  var offset = {
	    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
	    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
	    width: width,
	    height: height
	  };
	
	  return getClientRect(offset);
	}
	
	/**
	 * Check if the given element is fixed or is inside a fixed parent
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @argument {Element} customContainer
	 * @returns {Boolean} answer to "isFixed?"
	 */
	function isFixed(element) {
	  var nodeName = element.nodeName;
	  if (nodeName === 'BODY' || nodeName === 'HTML') {
	    return false;
	  }
	  if (getStyleComputedProperty(element, 'position') === 'fixed') {
	    return true;
	  }
	  return isFixed(getParentNode(element));
	}
	
	/**
	 * Finds the first parent of an element that has a transformed property defined
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @returns {Element} first transformed parent or documentElement
	 */
	
	function getFixedPositionOffsetParent(element) {
	  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
	  if (!element || !element.parentElement || isIE()) {
	    return document.documentElement;
	  }
	  var el = element.parentElement;
	  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
	    el = el.parentElement;
	  }
	  return el || document.documentElement;
	}
	
	/**
	 * Computed the boundaries limits and return them
	 * @method
	 * @memberof Popper.Utils
	 * @param {HTMLElement} popper
	 * @param {HTMLElement} reference
	 * @param {number} padding
	 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
	 * @param {Boolean} fixedPosition - Is in fixed position mode
	 * @returns {Object} Coordinates of the boundaries
	 */
	function getBoundaries(popper, reference, padding, boundariesElement) {
	  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	
	  // NOTE: 1 DOM access here
	
	  var boundaries = { top: 0, left: 0 };
	  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
	
	  // Handle viewport case
	  if (boundariesElement === 'viewport') {
	    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
	  } else {
	    // Handle other cases based on DOM element used as boundaries
	    var boundariesNode = void 0;
	    if (boundariesElement === 'scrollParent') {
	      boundariesNode = getScrollParent(getParentNode(reference));
	      if (boundariesNode.nodeName === 'BODY') {
	        boundariesNode = popper.ownerDocument.documentElement;
	      }
	    } else if (boundariesElement === 'window') {
	      boundariesNode = popper.ownerDocument.documentElement;
	    } else {
	      boundariesNode = boundariesElement;
	    }
	
	    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);
	
	    // In case of HTML, we need a different computation
	    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
	      var _getWindowSizes = getWindowSizes(),
	          height = _getWindowSizes.height,
	          width = _getWindowSizes.width;
	
	      boundaries.top += offsets.top - offsets.marginTop;
	      boundaries.bottom = height + offsets.top;
	      boundaries.left += offsets.left - offsets.marginLeft;
	      boundaries.right = width + offsets.left;
	    } else {
	      // for all the other DOM elements, this one is good
	      boundaries = offsets;
	    }
	  }
	
	  // Add paddings
	  boundaries.left += padding;
	  boundaries.top += padding;
	  boundaries.right -= padding;
	  boundaries.bottom -= padding;
	
	  return boundaries;
	}
	
	function getArea(_ref) {
	  var width = _ref.width,
	      height = _ref.height;
	
	  return width * height;
	}
	
	/**
	 * Utility used to transform the `auto` placement to the placement with more
	 * available space.
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Object} data - The data object generated by update method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
	  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
	
	  if (placement.indexOf('auto') === -1) {
	    return placement;
	  }
	
	  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);
	
	  var rects = {
	    top: {
	      width: boundaries.width,
	      height: refRect.top - boundaries.top
	    },
	    right: {
	      width: boundaries.right - refRect.right,
	      height: boundaries.height
	    },
	    bottom: {
	      width: boundaries.width,
	      height: boundaries.bottom - refRect.bottom
	    },
	    left: {
	      width: refRect.left - boundaries.left,
	      height: boundaries.height
	    }
	  };
	
	  var sortedAreas = Object.keys(rects).map(function (key) {
	    return _extends({
	      key: key
	    }, rects[key], {
	      area: getArea(rects[key])
	    });
	  }).sort(function (a, b) {
	    return b.area - a.area;
	  });
	
	  var filteredAreas = sortedAreas.filter(function (_ref2) {
	    var width = _ref2.width,
	        height = _ref2.height;
	    return width >= popper.clientWidth && height >= popper.clientHeight;
	  });
	
	  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;
	
	  var variation = placement.split('-')[1];
	
	  return computedPlacement + (variation ? '-' + variation : '');
	}
	
	/**
	 * Get offsets to the reference element
	 * @method
	 * @memberof Popper.Utils
	 * @param {Object} state
	 * @param {Element} popper - the popper element
	 * @param {Element} reference - the reference element (the popper will be relative to this)
	 * @param {Element} fixedPosition - is in fixed position mode
	 * @returns {Object} An object containing the offsets which will be applied to the popper
	 */
	function getReferenceOffsets(state, popper, reference) {
	  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	
	  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
	  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
	}
	
	/**
	 * Get the outer sizes of the given element (offset size + margins)
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element
	 * @returns {Object} object containing width and height properties
	 */
	function getOuterSizes(element) {
	  var styles = getComputedStyle(element);
	  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
	  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
	  var result = {
	    width: element.offsetWidth + y,
	    height: element.offsetHeight + x
	  };
	  return result;
	}
	
	/**
	 * Get the opposite placement of the given one
	 * @method
	 * @memberof Popper.Utils
	 * @argument {String} placement
	 * @returns {String} flipped placement
	 */
	function getOppositePlacement(placement) {
	  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
	  return placement.replace(/left|right|bottom|top/g, function (matched) {
	    return hash[matched];
	  });
	}
	
	/**
	 * Get offsets to the popper
	 * @method
	 * @memberof Popper.Utils
	 * @param {Object} position - CSS position the Popper will get applied
	 * @param {HTMLElement} popper - the popper element
	 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
	 * @param {String} placement - one of the valid placement options
	 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
	 */
	function getPopperOffsets(popper, referenceOffsets, placement) {
	  placement = placement.split('-')[0];
	
	  // Get popper node sizes
	  var popperRect = getOuterSizes(popper);
	
	  // Add position, width and height to our offsets object
	  var popperOffsets = {
	    width: popperRect.width,
	    height: popperRect.height
	  };
	
	  // depending by the popper placement we have to compute its offsets slightly differently
	  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
	  var mainSide = isHoriz ? 'top' : 'left';
	  var secondarySide = isHoriz ? 'left' : 'top';
	  var measurement = isHoriz ? 'height' : 'width';
	  var secondaryMeasurement = !isHoriz ? 'height' : 'width';
	
	  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
	  if (placement === secondarySide) {
	    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
	  } else {
	    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
	  }
	
	  return popperOffsets;
	}
	
	/**
	 * Mimics the `find` method of Array
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Array} arr
	 * @argument prop
	 * @argument value
	 * @returns index or -1
	 */
	function find(arr, check) {
	  // use native find if supported
	  if (Array.prototype.find) {
	    return arr.find(check);
	  }
	
	  // use `filter` to obtain the same behavior of `find`
	  return arr.filter(check)[0];
	}
	
	/**
	 * Return the index of the matching object
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Array} arr
	 * @argument prop
	 * @argument value
	 * @returns index or -1
	 */
	function findIndex(arr, prop, value) {
	  // use native findIndex if supported
	  if (Array.prototype.findIndex) {
	    return arr.findIndex(function (cur) {
	      return cur[prop] === value;
	    });
	  }
	
	  // use `find` + `indexOf` if `findIndex` isn't supported
	  var match = find(arr, function (obj) {
	    return obj[prop] === value;
	  });
	  return arr.indexOf(match);
	}
	
	/**
	 * Loop trough the list of modifiers and run them in order,
	 * each of them will then edit the data object.
	 * @method
	 * @memberof Popper.Utils
	 * @param {dataObject} data
	 * @param {Array} modifiers
	 * @param {String} ends - Optional modifier name used as stopper
	 * @returns {dataObject}
	 */
	function runModifiers(modifiers, data, ends) {
	  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));
	
	  modifiersToRun.forEach(function (modifier) {
	    if (modifier['function']) {
	      // eslint-disable-line dot-notation
	      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
	    }
	    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
	    if (modifier.enabled && isFunction(fn)) {
	      // Add properties to offsets to make them a complete clientRect object
	      // we do this before each modifier to make sure the previous one doesn't
	      // mess with these values
	      data.offsets.popper = getClientRect(data.offsets.popper);
	      data.offsets.reference = getClientRect(data.offsets.reference);
	
	      data = fn(data, modifier);
	    }
	  });
	
	  return data;
	}
	
	/**
	 * Updates the position of the popper, computing the new offsets and applying
	 * the new style.<br />
	 * Prefer `scheduleUpdate` over `update` because of performance reasons.
	 * @method
	 * @memberof Popper
	 */
	function update() {
	  // if popper is destroyed, don't perform any further update
	  if (this.state.isDestroyed) {
	    return;
	  }
	
	  var data = {
	    instance: this,
	    styles: {},
	    arrowStyles: {},
	    attributes: {},
	    flipped: false,
	    offsets: {}
	  };
	
	  // compute reference element offsets
	  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);
	
	  // compute auto placement, store placement inside the data object,
	  // modifiers will be able to edit `placement` if needed
	  // and refer to originalPlacement to know the original value
	  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);
	
	  // store the computed placement inside `originalPlacement`
	  data.originalPlacement = data.placement;
	
	  data.positionFixed = this.options.positionFixed;
	
	  // compute the popper offsets
	  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
	  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';
	
	  // run the modifiers
	  data = runModifiers(this.modifiers, data);
	
	  // the first `update` will call `onCreate` callback
	  // the other ones will call `onUpdate` callback
	  if (!this.state.isCreated) {
	    this.state.isCreated = true;
	    this.options.onCreate(data);
	  } else {
	    this.options.onUpdate(data);
	  }
	}
	
	/**
	 * Helper used to know if the given modifier is enabled.
	 * @method
	 * @memberof Popper.Utils
	 * @returns {Boolean}
	 */
	function isModifierEnabled(modifiers, modifierName) {
	  return modifiers.some(function (_ref) {
	    var name = _ref.name,
	        enabled = _ref.enabled;
	    return enabled && name === modifierName;
	  });
	}
	
	/**
	 * Get the prefixed supported property name
	 * @method
	 * @memberof Popper.Utils
	 * @argument {String} property (camelCase)
	 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
	 */
	function getSupportedPropertyName(property) {
	  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
	  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);
	
	  for (var i = 0; i < prefixes.length; i++) {
	    var prefix = prefixes[i];
	    var toCheck = prefix ? '' + prefix + upperProp : property;
	    if (typeof document.body.style[toCheck] !== 'undefined') {
	      return toCheck;
	    }
	  }
	  return null;
	}
	
	/**
	 * Destroy the popper
	 * @method
	 * @memberof Popper
	 */
	function destroy() {
	  this.state.isDestroyed = true;
	
	  // touch DOM only if `applyStyle` modifier is enabled
	  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
	    this.popper.removeAttribute('x-placement');
	    this.popper.style.position = '';
	    this.popper.style.top = '';
	    this.popper.style.left = '';
	    this.popper.style.right = '';
	    this.popper.style.bottom = '';
	    this.popper.style.willChange = '';
	    this.popper.style[getSupportedPropertyName('transform')] = '';
	  }
	
	  this.disableEventListeners();
	
	  // remove the popper if user explicity asked for the deletion on destroy
	  // do not use `remove` because IE11 doesn't support it
	  if (this.options.removeOnDestroy) {
	    this.popper.parentNode.removeChild(this.popper);
	  }
	  return this;
	}
	
	/**
	 * Get the window associated with the element
	 * @argument {Element} element
	 * @returns {Window}
	 */
	function getWindow(element) {
	  var ownerDocument = element.ownerDocument;
	  return ownerDocument ? ownerDocument.defaultView : window;
	}
	
	function attachToScrollParents(scrollParent, event, callback, scrollParents) {
	  var isBody = scrollParent.nodeName === 'BODY';
	  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
	  target.addEventListener(event, callback, { passive: true });
	
	  if (!isBody) {
	    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
	  }
	  scrollParents.push(target);
	}
	
	/**
	 * Setup needed event listeners used to update the popper position
	 * @method
	 * @memberof Popper.Utils
	 * @private
	 */
	function setupEventListeners(reference, options, state, updateBound) {
	  // Resize event listener on window
	  state.updateBound = updateBound;
	  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });
	
	  // Scroll event listener on scroll parents
	  var scrollElement = getScrollParent(reference);
	  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
	  state.scrollElement = scrollElement;
	  state.eventsEnabled = true;
	
	  return state;
	}
	
	/**
	 * It will add resize/scroll events and start recalculating
	 * position of the popper element when they are triggered.
	 * @method
	 * @memberof Popper
	 */
	function enableEventListeners() {
	  if (!this.state.eventsEnabled) {
	    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
	  }
	}
	
	/**
	 * Remove event listeners used to update the popper position
	 * @method
	 * @memberof Popper.Utils
	 * @private
	 */
	function removeEventListeners(reference, state) {
	  // Remove resize event listener on window
	  getWindow(reference).removeEventListener('resize', state.updateBound);
	
	  // Remove scroll event listener on scroll parents
	  state.scrollParents.forEach(function (target) {
	    target.removeEventListener('scroll', state.updateBound);
	  });
	
	  // Reset state
	  state.updateBound = null;
	  state.scrollParents = [];
	  state.scrollElement = null;
	  state.eventsEnabled = false;
	  return state;
	}
	
	/**
	 * It will remove resize/scroll events and won't recalculate popper position
	 * when they are triggered. It also won't trigger onUpdate callback anymore,
	 * unless you call `update` method manually.
	 * @method
	 * @memberof Popper
	 */
	function disableEventListeners() {
	  if (this.state.eventsEnabled) {
	    cancelAnimationFrame(this.scheduleUpdate);
	    this.state = removeEventListeners(this.reference, this.state);
	  }
	}
	
	/**
	 * Tells if a given input is a number
	 * @method
	 * @memberof Popper.Utils
	 * @param {*} input to check
	 * @return {Boolean}
	 */
	function isNumeric(n) {
	  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	/**
	 * Set the style to the given popper
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element - Element to apply the style to
	 * @argument {Object} styles
	 * Object with a list of properties and values which will be applied to the element
	 */
	function setStyles(element, styles) {
	  Object.keys(styles).forEach(function (prop) {
	    var unit = '';
	    // add unit if the value is numeric and is one of the following
	    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
	      unit = 'px';
	    }
	    element.style[prop] = styles[prop] + unit;
	  });
	}
	
	/**
	 * Set the attributes to the given popper
	 * @method
	 * @memberof Popper.Utils
	 * @argument {Element} element - Element to apply the attributes to
	 * @argument {Object} styles
	 * Object with a list of properties and values which will be applied to the element
	 */
	function setAttributes(element, attributes) {
	  Object.keys(attributes).forEach(function (prop) {
	    var value = attributes[prop];
	    if (value !== false) {
	      element.setAttribute(prop, attributes[prop]);
	    } else {
	      element.removeAttribute(prop);
	    }
	  });
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by `update` method
	 * @argument {Object} data.styles - List of style properties - values to apply to popper element
	 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The same data object
	 */
	function applyStyle(data) {
	  // any property present in `data.styles` will be applied to the popper,
	  // in this way we can make the 3rd party modifiers add custom styles to it
	  // Be aware, modifiers could override the properties defined in the previous
	  // lines of this modifier!
	  setStyles(data.instance.popper, data.styles);
	
	  // any property present in `data.attributes` will be applied to the popper,
	  // they will be set as HTML attributes of the element
	  setAttributes(data.instance.popper, data.attributes);
	
	  // if arrowElement is defined and arrowStyles has some properties
	  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
	    setStyles(data.arrowElement, data.arrowStyles);
	  }
	
	  return data;
	}
	
	/**
	 * Set the x-placement attribute before everything else because it could be used
	 * to add margins to the popper margins needs to be calculated to get the
	 * correct popper offsets.
	 * @method
	 * @memberof Popper.modifiers
	 * @param {HTMLElement} reference - The reference element used to position the popper
	 * @param {HTMLElement} popper - The HTML element used as popper
	 * @param {Object} options - Popper.js options
	 */
	function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
	  // compute reference element offsets
	  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);
	
	  // compute auto placement, store placement inside the data object,
	  // modifiers will be able to edit `placement` if needed
	  // and refer to originalPlacement to know the original value
	  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);
	
	  popper.setAttribute('x-placement', placement);
	
	  // Apply `position` to popper before anything else because
	  // without the position applied we can't guarantee correct computations
	  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });
	
	  return options;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by `update` method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function computeStyle(data, options) {
	  var x = options.x,
	      y = options.y;
	  var popper = data.offsets.popper;
	
	  // Remove this legacy support in Popper.js v2
	
	  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
	    return modifier.name === 'applyStyle';
	  }).gpuAcceleration;
	  if (legacyGpuAccelerationOption !== undefined) {
	    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
	  }
	  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;
	
	  var offsetParent = getOffsetParent(data.instance.popper);
	  var offsetParentRect = getBoundingClientRect(offsetParent);
	
	  // Styles
	  var styles = {
	    position: popper.position
	  };
	
	  // floor sides to avoid blurry text
	  var offsets = {
	    left: Math.floor(popper.left),
	    top: Math.floor(popper.top),
	    bottom: Math.floor(popper.bottom),
	    right: Math.floor(popper.right)
	  };
	
	  var sideA = x === 'bottom' ? 'top' : 'bottom';
	  var sideB = y === 'right' ? 'left' : 'right';
	
	  // if gpuAcceleration is set to `true` and transform is supported,
	  //  we use `translate3d` to apply the position to the popper we
	  // automatically use the supported prefixed version if needed
	  var prefixedProperty = getSupportedPropertyName('transform');
	
	  // now, let's make a step back and look at this code closely (wtf?)
	  // If the content of the popper grows once it's been positioned, it
	  // may happen that the popper gets misplaced because of the new content
	  // overflowing its reference element
	  // To avoid this problem, we provide two options (x and y), which allow
	  // the consumer to define the offset origin.
	  // If we position a popper on top of a reference element, we can set
	  // `x` to `top` to make the popper grow towards its top instead of
	  // its bottom.
	  var left = void 0,
	      top = void 0;
	  if (sideA === 'bottom') {
	    top = -offsetParentRect.height + offsets.bottom;
	  } else {
	    top = offsets.top;
	  }
	  if (sideB === 'right') {
	    left = -offsetParentRect.width + offsets.right;
	  } else {
	    left = offsets.left;
	  }
	  if (gpuAcceleration && prefixedProperty) {
	    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
	    styles[sideA] = 0;
	    styles[sideB] = 0;
	    styles.willChange = 'transform';
	  } else {
	    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
	    var invertTop = sideA === 'bottom' ? -1 : 1;
	    var invertLeft = sideB === 'right' ? -1 : 1;
	    styles[sideA] = top * invertTop;
	    styles[sideB] = left * invertLeft;
	    styles.willChange = sideA + ', ' + sideB;
	  }
	
	  // Attributes
	  var attributes = {
	    'x-placement': data.placement
	  };
	
	  // Update `data` attributes, styles and arrowStyles
	  data.attributes = _extends({}, attributes, data.attributes);
	  data.styles = _extends({}, styles, data.styles);
	  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);
	
	  return data;
	}
	
	/**
	 * Helper used to know if the given modifier depends from another one.<br />
	 * It checks if the needed modifier is listed and enabled.
	 * @method
	 * @memberof Popper.Utils
	 * @param {Array} modifiers - list of modifiers
	 * @param {String} requestingName - name of requesting modifier
	 * @param {String} requestedName - name of requested modifier
	 * @returns {Boolean}
	 */
	function isModifierRequired(modifiers, requestingName, requestedName) {
	  var requesting = find(modifiers, function (_ref) {
	    var name = _ref.name;
	    return name === requestingName;
	  });
	
	  var isRequired = !!requesting && modifiers.some(function (modifier) {
	    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
	  });
	
	  if (!isRequired) {
	    var _requesting = '`' + requestingName + '`';
	    var requested = '`' + requestedName + '`';
	    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
	  }
	  return isRequired;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by update method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function arrow(data, options) {
	  var _data$offsets$arrow;
	
	  // arrow depends on keepTogether in order to work
	  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
	    return data;
	  }
	
	  var arrowElement = options.element;
	
	  // if arrowElement is a string, suppose it's a CSS selector
	  if (typeof arrowElement === 'string') {
	    arrowElement = data.instance.popper.querySelector(arrowElement);
	
	    // if arrowElement is not found, don't run the modifier
	    if (!arrowElement) {
	      return data;
	    }
	  } else {
	    // if the arrowElement isn't a query selector we must check that the
	    // provided DOM node is child of its popper node
	    if (!data.instance.popper.contains(arrowElement)) {
	      console.warn('WARNING: `arrow.element` must be child of its popper element!');
	      return data;
	    }
	  }
	
	  var placement = data.placement.split('-')[0];
	  var _data$offsets = data.offsets,
	      popper = _data$offsets.popper,
	      reference = _data$offsets.reference;
	
	  var isVertical = ['left', 'right'].indexOf(placement) !== -1;
	
	  var len = isVertical ? 'height' : 'width';
	  var sideCapitalized = isVertical ? 'Top' : 'Left';
	  var side = sideCapitalized.toLowerCase();
	  var altSide = isVertical ? 'left' : 'top';
	  var opSide = isVertical ? 'bottom' : 'right';
	  var arrowElementSize = getOuterSizes(arrowElement)[len];
	
	  //
	  // extends keepTogether behavior making sure the popper and its
	  // reference have enough pixels in conjuction
	  //
	
	  // top/left side
	  if (reference[opSide] - arrowElementSize < popper[side]) {
	    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
	  }
	  // bottom/right side
	  if (reference[side] + arrowElementSize > popper[opSide]) {
	    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
	  }
	  data.offsets.popper = getClientRect(data.offsets.popper);
	
	  // compute center of the popper
	  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;
	
	  // Compute the sideValue using the updated popper offsets
	  // take popper margin in account because we don't have this info available
	  var css = getStyleComputedProperty(data.instance.popper);
	  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
	  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
	  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;
	
	  // prevent arrowElement from being placed not contiguously to its popper
	  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);
	
	  data.arrowElement = arrowElement;
	  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);
	
	  return data;
	}
	
	/**
	 * Get the opposite placement variation of the given one
	 * @method
	 * @memberof Popper.Utils
	 * @argument {String} placement variation
	 * @returns {String} flipped placement variation
	 */
	function getOppositeVariation(variation) {
	  if (variation === 'end') {
	    return 'start';
	  } else if (variation === 'start') {
	    return 'end';
	  }
	  return variation;
	}
	
	/**
	 * List of accepted placements to use as values of the `placement` option.<br />
	 * Valid placements are:
	 * - `auto`
	 * - `top`
	 * - `right`
	 * - `bottom`
	 * - `left`
	 *
	 * Each placement can have a variation from this list:
	 * - `-start`
	 * - `-end`
	 *
	 * Variations are interpreted easily if you think of them as the left to right
	 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
	 * is right.<br />
	 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
	 *
	 * Some valid examples are:
	 * - `top-end` (on top of reference, right aligned)
	 * - `right-start` (on right of reference, top aligned)
	 * - `bottom` (on bottom, centered)
	 * - `auto-right` (on the side with more space available, alignment depends by placement)
	 *
	 * @static
	 * @type {Array}
	 * @enum {String}
	 * @readonly
	 * @method placements
	 * @memberof Popper
	 */
	var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];
	
	// Get rid of `auto` `auto-start` and `auto-end`
	var validPlacements = placements.slice(3);
	
	/**
	 * Given an initial placement, returns all the subsequent placements
	 * clockwise (or counter-clockwise).
	 *
	 * @method
	 * @memberof Popper.Utils
	 * @argument {String} placement - A valid placement (it accepts variations)
	 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
	 * @returns {Array} placements including their variations
	 */
	function clockwise(placement) {
	  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	  var index = validPlacements.indexOf(placement);
	  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
	  return counter ? arr.reverse() : arr;
	}
	
	var BEHAVIORS = {
	  FLIP: 'flip',
	  CLOCKWISE: 'clockwise',
	  COUNTERCLOCKWISE: 'counterclockwise'
	};
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by update method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function flip(data, options) {
	  // if `inner` modifier is enabled, we can't use the `flip` modifier
	  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
	    return data;
	  }
	
	  if (data.flipped && data.placement === data.originalPlacement) {
	    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
	    return data;
	  }
	
	  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);
	
	  var placement = data.placement.split('-')[0];
	  var placementOpposite = getOppositePlacement(placement);
	  var variation = data.placement.split('-')[1] || '';
	
	  var flipOrder = [];
	
	  switch (options.behavior) {
	    case BEHAVIORS.FLIP:
	      flipOrder = [placement, placementOpposite];
	      break;
	    case BEHAVIORS.CLOCKWISE:
	      flipOrder = clockwise(placement);
	      break;
	    case BEHAVIORS.COUNTERCLOCKWISE:
	      flipOrder = clockwise(placement, true);
	      break;
	    default:
	      flipOrder = options.behavior;
	  }
	
	  flipOrder.forEach(function (step, index) {
	    if (placement !== step || flipOrder.length === index + 1) {
	      return data;
	    }
	
	    placement = data.placement.split('-')[0];
	    placementOpposite = getOppositePlacement(placement);
	
	    var popperOffsets = data.offsets.popper;
	    var refOffsets = data.offsets.reference;
	
	    // using floor because the reference offsets may contain decimals we are not going to consider here
	    var floor = Math.floor;
	    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);
	
	    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
	    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
	    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
	    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);
	
	    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;
	
	    // flip the variation if required
	    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
	    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);
	
	    if (overlapsRef || overflowsBoundaries || flippedVariation) {
	      // this boolean to detect any flip loop
	      data.flipped = true;
	
	      if (overlapsRef || overflowsBoundaries) {
	        placement = flipOrder[index + 1];
	      }
	
	      if (flippedVariation) {
	        variation = getOppositeVariation(variation);
	      }
	
	      data.placement = placement + (variation ? '-' + variation : '');
	
	      // this object contains `position`, we want to preserve it along with
	      // any additional property we may add in the future
	      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));
	
	      data = runModifiers(data.instance.modifiers, data, 'flip');
	    }
	  });
	  return data;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by update method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function keepTogether(data) {
	  var _data$offsets = data.offsets,
	      popper = _data$offsets.popper,
	      reference = _data$offsets.reference;
	
	  var placement = data.placement.split('-')[0];
	  var floor = Math.floor;
	  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
	  var side = isVertical ? 'right' : 'bottom';
	  var opSide = isVertical ? 'left' : 'top';
	  var measurement = isVertical ? 'width' : 'height';
	
	  if (popper[side] < floor(reference[opSide])) {
	    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
	  }
	  if (popper[opSide] > floor(reference[side])) {
	    data.offsets.popper[opSide] = floor(reference[side]);
	  }
	
	  return data;
	}
	
	/**
	 * Converts a string containing value + unit into a px value number
	 * @function
	 * @memberof {modifiers~offset}
	 * @private
	 * @argument {String} str - Value + unit string
	 * @argument {String} measurement - `height` or `width`
	 * @argument {Object} popperOffsets
	 * @argument {Object} referenceOffsets
	 * @returns {Number|String}
	 * Value in pixels, or original string if no values were extracted
	 */
	function toValue(str, measurement, popperOffsets, referenceOffsets) {
	  // separate value from unit
	  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
	  var value = +split[1];
	  var unit = split[2];
	
	  // If it's not a number it's an operator, I guess
	  if (!value) {
	    return str;
	  }
	
	  if (unit.indexOf('%') === 0) {
	    var element = void 0;
	    switch (unit) {
	      case '%p':
	        element = popperOffsets;
	        break;
	      case '%':
	      case '%r':
	      default:
	        element = referenceOffsets;
	    }
	
	    var rect = getClientRect(element);
	    return rect[measurement] / 100 * value;
	  } else if (unit === 'vh' || unit === 'vw') {
	    // if is a vh or vw, we calculate the size based on the viewport
	    var size = void 0;
	    if (unit === 'vh') {
	      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	    } else {
	      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	    }
	    return size / 100 * value;
	  } else {
	    // if is an explicit pixel unit, we get rid of the unit and keep the value
	    // if is an implicit unit, it's px, and we return just the value
	    return value;
	  }
	}
	
	/**
	 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
	 * @function
	 * @memberof {modifiers~offset}
	 * @private
	 * @argument {String} offset
	 * @argument {Object} popperOffsets
	 * @argument {Object} referenceOffsets
	 * @argument {String} basePlacement
	 * @returns {Array} a two cells array with x and y offsets in numbers
	 */
	function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
	  var offsets = [0, 0];
	
	  // Use height if placement is left or right and index is 0 otherwise use width
	  // in this way the first offset will use an axis and the second one
	  // will use the other one
	  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;
	
	  // Split the offset string to obtain a list of values and operands
	  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
	  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
	    return frag.trim();
	  });
	
	  // Detect if the offset string contains a pair of values or a single one
	  // they could be separated by comma or space
	  var divider = fragments.indexOf(find(fragments, function (frag) {
	    return frag.search(/,|\s/) !== -1;
	  }));
	
	  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
	    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
	  }
	
	  // If divider is found, we divide the list of values and operands to divide
	  // them by ofset X and Y.
	  var splitRegex = /\s*,\s*|\s+/;
	  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];
	
	  // Convert the values with units to absolute pixels to allow our computations
	  ops = ops.map(function (op, index) {
	    // Most of the units rely on the orientation of the popper
	    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
	    var mergeWithPrevious = false;
	    return op
	    // This aggregates any `+` or `-` sign that aren't considered operators
	    // e.g.: 10 + +5 => [10, +, +5]
	    .reduce(function (a, b) {
	      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
	        a[a.length - 1] = b;
	        mergeWithPrevious = true;
	        return a;
	      } else if (mergeWithPrevious) {
	        a[a.length - 1] += b;
	        mergeWithPrevious = false;
	        return a;
	      } else {
	        return a.concat(b);
	      }
	    }, [])
	    // Here we convert the string values into number values (in px)
	    .map(function (str) {
	      return toValue(str, measurement, popperOffsets, referenceOffsets);
	    });
	  });
	
	  // Loop trough the offsets arrays and execute the operations
	  ops.forEach(function (op, index) {
	    op.forEach(function (frag, index2) {
	      if (isNumeric(frag)) {
	        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
	      }
	    });
	  });
	  return offsets;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by update method
	 * @argument {Object} options - Modifiers configuration and options
	 * @argument {Number|String} options.offset=0
	 * The offset value as described in the modifier description
	 * @returns {Object} The data object, properly modified
	 */
	function offset(data, _ref) {
	  var offset = _ref.offset;
	  var placement = data.placement,
	      _data$offsets = data.offsets,
	      popper = _data$offsets.popper,
	      reference = _data$offsets.reference;
	
	  var basePlacement = placement.split('-')[0];
	
	  var offsets = void 0;
	  if (isNumeric(+offset)) {
	    offsets = [+offset, 0];
	  } else {
	    offsets = parseOffset(offset, popper, reference, basePlacement);
	  }
	
	  if (basePlacement === 'left') {
	    popper.top += offsets[0];
	    popper.left -= offsets[1];
	  } else if (basePlacement === 'right') {
	    popper.top += offsets[0];
	    popper.left += offsets[1];
	  } else if (basePlacement === 'top') {
	    popper.left += offsets[0];
	    popper.top -= offsets[1];
	  } else if (basePlacement === 'bottom') {
	    popper.left += offsets[0];
	    popper.top += offsets[1];
	  }
	
	  data.popper = popper;
	  return data;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by `update` method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function preventOverflow(data, options) {
	  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);
	
	  // If offsetParent is the reference element, we really want to
	  // go one step up and use the next offsetParent as reference to
	  // avoid to make this modifier completely useless and look like broken
	  if (data.instance.reference === boundariesElement) {
	    boundariesElement = getOffsetParent(boundariesElement);
	  }
	
	  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);
	  options.boundaries = boundaries;
	
	  var order = options.priority;
	  var popper = data.offsets.popper;
	
	  var check = {
	    primary: function primary(placement) {
	      var value = popper[placement];
	      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
	        value = Math.max(popper[placement], boundaries[placement]);
	      }
	      return defineProperty({}, placement, value);
	    },
	    secondary: function secondary(placement) {
	      var mainSide = placement === 'right' ? 'left' : 'top';
	      var value = popper[mainSide];
	      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
	        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
	      }
	      return defineProperty({}, mainSide, value);
	    }
	  };
	
	  order.forEach(function (placement) {
	    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
	    popper = _extends({}, popper, check[side](placement));
	  });
	
	  data.offsets.popper = popper;
	
	  return data;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by `update` method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function shift(data) {
	  var placement = data.placement;
	  var basePlacement = placement.split('-')[0];
	  var shiftvariation = placement.split('-')[1];
	
	  // if shift shiftvariation is specified, run the modifier
	  if (shiftvariation) {
	    var _data$offsets = data.offsets,
	        reference = _data$offsets.reference,
	        popper = _data$offsets.popper;
	
	    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
	    var side = isVertical ? 'left' : 'top';
	    var measurement = isVertical ? 'width' : 'height';
	
	    var shiftOffsets = {
	      start: defineProperty({}, side, reference[side]),
	      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
	    };
	
	    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
	  }
	
	  return data;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by update method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function hide(data) {
	  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
	    return data;
	  }
	
	  var refRect = data.offsets.reference;
	  var bound = find(data.instance.modifiers, function (modifier) {
	    return modifier.name === 'preventOverflow';
	  }).boundaries;
	
	  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
	    // Avoid unnecessary DOM access if visibility hasn't changed
	    if (data.hide === true) {
	      return data;
	    }
	
	    data.hide = true;
	    data.attributes['x-out-of-boundaries'] = '';
	  } else {
	    // Avoid unnecessary DOM access if visibility hasn't changed
	    if (data.hide === false) {
	      return data;
	    }
	
	    data.hide = false;
	    data.attributes['x-out-of-boundaries'] = false;
	  }
	
	  return data;
	}
	
	/**
	 * @function
	 * @memberof Modifiers
	 * @argument {Object} data - The data object generated by `update` method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {Object} The data object, properly modified
	 */
	function inner(data) {
	  var placement = data.placement;
	  var basePlacement = placement.split('-')[0];
	  var _data$offsets = data.offsets,
	      popper = _data$offsets.popper,
	      reference = _data$offsets.reference;
	
	  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;
	
	  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;
	
	  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);
	
	  data.placement = getOppositePlacement(placement);
	  data.offsets.popper = getClientRect(popper);
	
	  return data;
	}
	
	/**
	 * Modifier function, each modifier can have a function of this type assigned
	 * to its `fn` property.<br />
	 * These functions will be called on each update, this means that you must
	 * make sure they are performant enough to avoid performance bottlenecks.
	 *
	 * @function ModifierFn
	 * @argument {dataObject} data - The data object generated by `update` method
	 * @argument {Object} options - Modifiers configuration and options
	 * @returns {dataObject} The data object, properly modified
	 */
	
	/**
	 * Modifiers are plugins used to alter the behavior of your poppers.<br />
	 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
	 * needed by the library.
	 *
	 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
	 * All the other properties are configurations that could be tweaked.
	 * @namespace modifiers
	 */
	var modifiers = {
	  /**
	   * Modifier used to shift the popper on the start or end of its reference
	   * element.<br />
	   * It will read the variation of the `placement` property.<br />
	   * It can be one either `-end` or `-start`.
	   * @memberof modifiers
	   * @inner
	   */
	  shift: {
	    /** @prop {number} order=100 - Index used to define the order of execution */
	    order: 100,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: shift
	  },
	
	  /**
	   * The `offset` modifier can shift your popper on both its axis.
	   *
	   * It accepts the following units:
	   * - `px` or unitless, interpreted as pixels
	   * - `%` or `%r`, percentage relative to the length of the reference element
	   * - `%p`, percentage relative to the length of the popper element
	   * - `vw`, CSS viewport width unit
	   * - `vh`, CSS viewport height unit
	   *
	   * For length is intended the main axis relative to the placement of the popper.<br />
	   * This means that if the placement is `top` or `bottom`, the length will be the
	   * `width`. In case of `left` or `right`, it will be the height.
	   *
	   * You can provide a single value (as `Number` or `String`), or a pair of values
	   * as `String` divided by a comma or one (or more) white spaces.<br />
	   * The latter is a deprecated method because it leads to confusion and will be
	   * removed in v2.<br />
	   * Additionally, it accepts additions and subtractions between different units.
	   * Note that multiplications and divisions aren't supported.
	   *
	   * Valid examples are:
	   * ```
	   * 10
	   * '10%'
	   * '10, 10'
	   * '10%, 10'
	   * '10 + 10%'
	   * '10 - 5vh + 3%'
	   * '-10px + 5vh, 5px - 6%'
	   * ```
	   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
	   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
	   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
	   *
	   * @memberof modifiers
	   * @inner
	   */
	  offset: {
	    /** @prop {number} order=200 - Index used to define the order of execution */
	    order: 200,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: offset,
	    /** @prop {Number|String} offset=0
	     * The offset value as described in the modifier description
	     */
	    offset: 0
	  },
	
	  /**
	   * Modifier used to prevent the popper from being positioned outside the boundary.
	   *
	   * An scenario exists where the reference itself is not within the boundaries.<br />
	   * We can say it has "escaped the boundaries" — or just "escaped".<br />
	   * In this case we need to decide whether the popper should either:
	   *
	   * - detach from the reference and remain "trapped" in the boundaries, or
	   * - if it should ignore the boundary and "escape with its reference"
	   *
	   * When `escapeWithReference` is set to`true` and reference is completely
	   * outside its boundaries, the popper will overflow (or completely leave)
	   * the boundaries in order to remain attached to the edge of the reference.
	   *
	   * @memberof modifiers
	   * @inner
	   */
	  preventOverflow: {
	    /** @prop {number} order=300 - Index used to define the order of execution */
	    order: 300,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: preventOverflow,
	    /**
	     * @prop {Array} [priority=['left','right','top','bottom']]
	     * Popper will try to prevent overflow following these priorities by default,
	     * then, it could overflow on the left and on top of the `boundariesElement`
	     */
	    priority: ['left', 'right', 'top', 'bottom'],
	    /**
	     * @prop {number} padding=5
	     * Amount of pixel used to define a minimum distance between the boundaries
	     * and the popper this makes sure the popper has always a little padding
	     * between the edges of its container
	     */
	    padding: 5,
	    /**
	     * @prop {String|HTMLElement} boundariesElement='scrollParent'
	     * Boundaries used by the modifier, can be `scrollParent`, `window`,
	     * `viewport` or any DOM element.
	     */
	    boundariesElement: 'scrollParent'
	  },
	
	  /**
	   * Modifier used to make sure the reference and its popper stay near eachothers
	   * without leaving any gap between the two. Expecially useful when the arrow is
	   * enabled and you want to assure it to point to its reference element.
	   * It cares only about the first axis, you can still have poppers with margin
	   * between the popper and its reference element.
	   * @memberof modifiers
	   * @inner
	   */
	  keepTogether: {
	    /** @prop {number} order=400 - Index used to define the order of execution */
	    order: 400,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: keepTogether
	  },
	
	  /**
	   * This modifier is used to move the `arrowElement` of the popper to make
	   * sure it is positioned between the reference element and its popper element.
	   * It will read the outer size of the `arrowElement` node to detect how many
	   * pixels of conjuction are needed.
	   *
	   * It has no effect if no `arrowElement` is provided.
	   * @memberof modifiers
	   * @inner
	   */
	  arrow: {
	    /** @prop {number} order=500 - Index used to define the order of execution */
	    order: 500,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: arrow,
	    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
	    element: '[x-arrow]'
	  },
	
	  /**
	   * Modifier used to flip the popper's placement when it starts to overlap its
	   * reference element.
	   *
	   * Requires the `preventOverflow` modifier before it in order to work.
	   *
	   * **NOTE:** this modifier will interrupt the current update cycle and will
	   * restart it if it detects the need to flip the placement.
	   * @memberof modifiers
	   * @inner
	   */
	  flip: {
	    /** @prop {number} order=600 - Index used to define the order of execution */
	    order: 600,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: flip,
	    /**
	     * @prop {String|Array} behavior='flip'
	     * The behavior used to change the popper's placement. It can be one of
	     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
	     * placements (with optional variations).
	     */
	    behavior: 'flip',
	    /**
	     * @prop {number} padding=5
	     * The popper will flip if it hits the edges of the `boundariesElement`
	     */
	    padding: 5,
	    /**
	     * @prop {String|HTMLElement} boundariesElement='viewport'
	     * The element which will define the boundaries of the popper position,
	     * the popper will never be placed outside of the defined boundaries
	     * (except if keepTogether is enabled)
	     */
	    boundariesElement: 'viewport'
	  },
	
	  /**
	   * Modifier used to make the popper flow toward the inner of the reference element.
	   * By default, when this modifier is disabled, the popper will be placed outside
	   * the reference element.
	   * @memberof modifiers
	   * @inner
	   */
	  inner: {
	    /** @prop {number} order=700 - Index used to define the order of execution */
	    order: 700,
	    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
	    enabled: false,
	    /** @prop {ModifierFn} */
	    fn: inner
	  },
	
	  /**
	   * Modifier used to hide the popper when its reference element is outside of the
	   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
	   * be used to hide with a CSS selector the popper when its reference is
	   * out of boundaries.
	   *
	   * Requires the `preventOverflow` modifier before it in order to work.
	   * @memberof modifiers
	   * @inner
	   */
	  hide: {
	    /** @prop {number} order=800 - Index used to define the order of execution */
	    order: 800,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: hide
	  },
	
	  /**
	   * Computes the style that will be applied to the popper element to gets
	   * properly positioned.
	   *
	   * Note that this modifier will not touch the DOM, it just prepares the styles
	   * so that `applyStyle` modifier can apply it. This separation is useful
	   * in case you need to replace `applyStyle` with a custom implementation.
	   *
	   * This modifier has `850` as `order` value to maintain backward compatibility
	   * with previous versions of Popper.js. Expect the modifiers ordering method
	   * to change in future major versions of the library.
	   *
	   * @memberof modifiers
	   * @inner
	   */
	  computeStyle: {
	    /** @prop {number} order=850 - Index used to define the order of execution */
	    order: 850,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: computeStyle,
	    /**
	     * @prop {Boolean} gpuAcceleration=true
	     * If true, it uses the CSS 3d transformation to position the popper.
	     * Otherwise, it will use the `top` and `left` properties.
	     */
	    gpuAcceleration: true,
	    /**
	     * @prop {string} [x='bottom']
	     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
	     * Change this if your popper should grow in a direction different from `bottom`
	     */
	    x: 'bottom',
	    /**
	     * @prop {string} [x='left']
	     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
	     * Change this if your popper should grow in a direction different from `right`
	     */
	    y: 'right'
	  },
	
	  /**
	   * Applies the computed styles to the popper element.
	   *
	   * All the DOM manipulations are limited to this modifier. This is useful in case
	   * you want to integrate Popper.js inside a framework or view library and you
	   * want to delegate all the DOM manipulations to it.
	   *
	   * Note that if you disable this modifier, you must make sure the popper element
	   * has its position set to `absolute` before Popper.js can do its work!
	   *
	   * Just disable this modifier and define you own to achieve the desired effect.
	   *
	   * @memberof modifiers
	   * @inner
	   */
	  applyStyle: {
	    /** @prop {number} order=900 - Index used to define the order of execution */
	    order: 900,
	    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
	    enabled: true,
	    /** @prop {ModifierFn} */
	    fn: applyStyle,
	    /** @prop {Function} */
	    onLoad: applyStyleOnLoad,
	    /**
	     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
	     * @prop {Boolean} gpuAcceleration=true
	     * If true, it uses the CSS 3d transformation to position the popper.
	     * Otherwise, it will use the `top` and `left` properties.
	     */
	    gpuAcceleration: undefined
	  }
	};
	
	/**
	 * The `dataObject` is an object containing all the informations used by Popper.js
	 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
	 * @name dataObject
	 * @property {Object} data.instance The Popper.js instance
	 * @property {String} data.placement Placement applied to popper
	 * @property {String} data.originalPlacement Placement originally defined on init
	 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
	 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
	 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
	 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
	 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
	 * @property {Object} data.boundaries Offsets of the popper boundaries
	 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
	 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
	 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
	 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
	 */
	
	/**
	 * Default options provided to Popper.js constructor.<br />
	 * These can be overriden using the `options` argument of Popper.js.<br />
	 * To override an option, simply pass as 3rd argument an object with the same
	 * structure of this object, example:
	 * ```
	 * new Popper(ref, pop, {
	 *   modifiers: {
	 *     preventOverflow: { enabled: false }
	 *   }
	 * })
	 * ```
	 * @type {Object}
	 * @static
	 * @memberof Popper
	 */
	var Defaults = {
	  /**
	   * Popper's placement
	   * @prop {Popper.placements} placement='bottom'
	   */
	  placement: 'bottom',
	
	  /**
	   * Set this to true if you want popper to position it self in 'fixed' mode
	   * @prop {Boolean} positionFixed=false
	   */
	  positionFixed: false,
	
	  /**
	   * Whether events (resize, scroll) are initially enabled
	   * @prop {Boolean} eventsEnabled=true
	   */
	  eventsEnabled: true,
	
	  /**
	   * Set to true if you want to automatically remove the popper when
	   * you call the `destroy` method.
	   * @prop {Boolean} removeOnDestroy=false
	   */
	  removeOnDestroy: false,
	
	  /**
	   * Callback called when the popper is created.<br />
	   * By default, is set to no-op.<br />
	   * Access Popper.js instance with `data.instance`.
	   * @prop {onCreate}
	   */
	  onCreate: function onCreate() {},
	
	  /**
	   * Callback called when the popper is updated, this callback is not called
	   * on the initialization/creation of the popper, but only on subsequent
	   * updates.<br />
	   * By default, is set to no-op.<br />
	   * Access Popper.js instance with `data.instance`.
	   * @prop {onUpdate}
	   */
	  onUpdate: function onUpdate() {},
	
	  /**
	   * List of modifiers used to modify the offsets before they are applied to the popper.
	   * They provide most of the functionalities of Popper.js
	   * @prop {modifiers}
	   */
	  modifiers: modifiers
	};
	
	/**
	 * @callback onCreate
	 * @param {dataObject} data
	 */
	
	/**
	 * @callback onUpdate
	 * @param {dataObject} data
	 */
	
	// Utils
	// Methods
	var Popper = function () {
	  /**
	   * Create a new Popper.js instance
	   * @class Popper
	   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
	   * @param {HTMLElement} popper - The HTML element used as popper.
	   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
	   * @return {Object} instance - The generated Popper.js instance
	   */
	  function Popper(reference, popper) {
	    var _this = this;
	
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	    classCallCheck(this, Popper);
	
	    this.scheduleUpdate = function () {
	      return requestAnimationFrame(_this.update);
	    };
	
	    // make update() debounced, so that it only runs at most once-per-tick
	    this.update = debounce(this.update.bind(this));
	
	    // with {} we create a new object with the options inside it
	    this.options = _extends({}, Popper.Defaults, options);
	
	    // init state
	    this.state = {
	      isDestroyed: false,
	      isCreated: false,
	      scrollParents: []
	    };
	
	    // get reference and popper elements (allow jQuery wrappers)
	    this.reference = reference && reference.jquery ? reference[0] : reference;
	    this.popper = popper && popper.jquery ? popper[0] : popper;
	
	    // Deep merge modifiers options
	    this.options.modifiers = {};
	    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
	      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
	    });
	
	    // Refactoring modifiers' list (Object => Array)
	    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
	      return _extends({
	        name: name
	      }, _this.options.modifiers[name]);
	    })
	    // sort the modifiers by order
	    .sort(function (a, b) {
	      return a.order - b.order;
	    });
	
	    // modifiers have the ability to execute arbitrary code when Popper.js get inited
	    // such code is executed in the same order of its modifier
	    // they could add new properties to their options configuration
	    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
	    this.modifiers.forEach(function (modifierOptions) {
	      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
	        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
	      }
	    });
	
	    // fire the first update to position the popper in the right place
	    this.update();
	
	    var eventsEnabled = this.options.eventsEnabled;
	    if (eventsEnabled) {
	      // setup event listeners, they will take care of update the position in specific situations
	      this.enableEventListeners();
	    }
	
	    this.state.eventsEnabled = eventsEnabled;
	  }
	
	  // We can't use class properties because they don't get listed in the
	  // class prototype and break stuff like Sinon stubs
	
	
	  createClass(Popper, [{
	    key: 'update',
	    value: function update$$1() {
	      return update.call(this);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy$$1() {
	      return destroy.call(this);
	    }
	  }, {
	    key: 'enableEventListeners',
	    value: function enableEventListeners$$1() {
	      return enableEventListeners.call(this);
	    }
	  }, {
	    key: 'disableEventListeners',
	    value: function disableEventListeners$$1() {
	      return disableEventListeners.call(this);
	    }
	
	    /**
	     * Schedule an update, it will run on the next UI update available
	     * @method scheduleUpdate
	     * @memberof Popper
	     */
	
	
	    /**
	     * Collection of utilities useful when writing custom modifiers.
	     * Starting from version 1.7, this method is available only if you
	     * include `popper-utils.js` before `popper.js`.
	     *
	     * **DEPRECATION**: This way to access PopperUtils is deprecated
	     * and will be removed in v2! Use the PopperUtils module directly instead.
	     * Due to the high instability of the methods contained in Utils, we can't
	     * guarantee them to follow semver. Use them at your own risk!
	     * @static
	     * @private
	     * @type {Object}
	     * @deprecated since version 1.8
	     * @member Utils
	     * @memberof Popper
	     */
	
	  }]);
	  return Popper;
	}();
	
	/**
	 * The `referenceObject` is an object that provides an interface compatible with Popper.js
	 * and lets you use it as replacement of a real DOM node.<br />
	 * You can use this method to position a popper relatively to a set of coordinates
	 * in case you don't have a DOM node to use as reference.
	 *
	 * ```
	 * new Popper(referenceObject, popperNode);
	 * ```
	 *
	 * NB: This feature isn't supported in Internet Explorer 10
	 * @name referenceObject
	 * @property {Function} data.getBoundingClientRect
	 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
	 * @property {number} data.clientWidth
	 * An ES6 getter that will return the width of the virtual reference element.
	 * @property {number} data.clientHeight
	 * An ES6 getter that will return the height of the virtual reference element.
	 */
	
	
	Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
	Popper.placements = placements;
	Popper.Defaults = Defaults;
	
	return Popper;
	
	})));
	//# sourceMappingURL=popper.js.map
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var Arrow = function Arrow(props, context) {
	  var _props$component = props.component,
	      component = _props$component === undefined ? 'span' : _props$component,
	      innerRef = props.innerRef,
	      children = props.children,
	      restProps = _objectWithoutProperties(props, ['component', 'innerRef', 'children']);
	
	  var popper = context.popper;
	
	  var arrowRef = function arrowRef(node) {
	    popper.setArrowNode(node);
	    if (typeof innerRef === 'function') {
	      innerRef(node);
	    }
	  };
	  var arrowStyle = popper.getArrowStyle();
	
	  if (typeof children === 'function') {
	    var arrowProps = {
	      ref: arrowRef,
	      style: arrowStyle
	    };
	    return children({ arrowProps: arrowProps, restProps: restProps });
	  }
	
	  var componentProps = _extends({}, restProps, {
	    style: _extends({}, arrowStyle, restProps.style)
	  });
	
	  if (typeof component === 'string') {
	    componentProps.ref = arrowRef;
	  } else {
	    componentProps.innerRef = arrowRef;
	  }
	
	  return (0, _react.createElement)(component, componentProps, children);
	};
	
	Arrow.contextTypes = {
	  popper: _propTypes2.default.object.isRequired
	};
	
	Arrow.propTypes = {
	  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
	  innerRef: _propTypes2.default.func,
	  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
	};
	
	exports.default = Arrow;

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _EventListener = __webpack_require__(284);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_EventListener).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _exenv = __webpack_require__(285);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/** Declarative event listener component */
	var EventListener = function (_Component) {
	  _inherits(EventListener, _Component);
	
	  function EventListener() {
	    _classCallCheck(this, EventListener);
	
	    return _possibleConstructorReturn(this, (EventListener.__proto__ || Object.getPrototypeOf(EventListener)).apply(this, arguments));
	  }
	
	  _createClass(EventListener, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.addEventListeners();
	    }
	  }, {
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate() {
	      this.removeEventListeners();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this.addEventListeners();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.removeEventListeners();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return null;
	    }
	  }, {
	    key: 'getTargetNode',
	    value: function getTargetNode(target) {
	      if (_exenv.canUseDOM) {
	        return global[target] || global.document.querySelector(target);
	      }
	    }
	  }, {
	    key: 'addEventListeners',
	    value: function addEventListeners() {
	      var _this2 = this;
	
	      if (_exenv.canUseEventListeners) {
	        this.props.listeners.forEach(function (_ref) {
	          var target = _ref.target,
	              event = _ref.event,
	              handler = _ref.handler,
	              options = _ref.options;
	
	          var node = _this2.getTargetNode(target);
	          node && node.addEventListener(event, handler, options);
	        });
	      }
	    }
	  }, {
	    key: 'removeEventListeners',
	    value: function removeEventListeners() {
	      var _this3 = this;
	
	      if (_exenv.canUseEventListeners) {
	        this.props.listeners.forEach(function (_ref2) {
	          var target = _ref2.target,
	              event = _ref2.event,
	              handler = _ref2.handler,
	              options = _ref2.options;
	
	          var node = _this3.getTargetNode(target);
	          node && node.removeEventListener(event, handler, options);
	        });
	      }
	    }
	  }]);
	
	  return EventListener;
	}(_react.Component);
	
	EventListener.propTypes = {
	  listeners: __webpack_require__(82).arrayOf(__webpack_require__(82).shape({
	    /** Target on which to add event listener. Can be a global such as `window` or `document` or any CSS selector */
	    target: __webpack_require__(82).string.isRequired,
	
	    /** Type of event to listen for, e.g. click */
	    event: __webpack_require__(82).string.isRequired,
	
	    /** Function called when the event is triggered */
	    handler: __webpack_require__(82).func.isRequired,
	
	    /** Options passed to addEventListener/removeEventListener */
	    options: __webpack_require__(82).oneOfType([__webpack_require__(82).bool, __webpack_require__(82).object])
	  })).isRequired
	};
	exports.default = EventListener;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Based on code that is Copyright 2013-2015, Facebook, Inc.
	  All rights reserved.
	*/
	/* global define */
	
	(function () {
		'use strict';
	
		var canUseDOM = !!(
			typeof window !== 'undefined' &&
			window.document &&
			window.document.createElement
		);
	
		var ExecutionEnvironment = {
	
			canUseDOM: canUseDOM,
	
			canUseWorkers: typeof Worker !== 'undefined',
	
			canUseEventListeners:
				canUseDOM && !!(window.addEventListener || window.attachEvent),
	
			canUseViewport: canUseDOM && !!window.screen
	
		};
	
		if (true) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return ExecutionEnvironment;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = ExecutionEnvironment;
		} else {
			window.ExecutionEnvironment = ExecutionEnvironment;
		}
	
	}());


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Portal = __webpack_require__(287);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Portal).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _exenv = __webpack_require__(285);
	
	var _reactDom = __webpack_require__(135);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Portal = function (_Component) {
	  _inherits(Portal, _Component);
	
	  function Portal() {
	    _classCallCheck(this, Portal);
	
	    return _possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).apply(this, arguments));
	  }
	
	  _createClass(Portal, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.createPortal();
	      this.renderIntoPortal();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this.renderIntoPortal();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.closePortal();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return null;
	    }
	  }, {
	    key: 'renderIntoPortal',
	    value: function renderIntoPortal() {
	      if (_exenv.canUseDOM) {
	        var _props = this.props,
	            _children = _props.children,
	            _callback = _props.callback;
	
	        var content = _react.Children.only(_children);
	
	        this.content = (0, _reactDom.unstable_renderSubtreeIntoContainer)(this, content, this.node, _callback);
	      }
	    }
	  }, {
	    key: 'createPortal',
	    value: function createPortal() {
	      if (_exenv.canUseDOM) {
	        this.node = global.document.createElement('div');
	        global.document.body.appendChild(this.node);
	      }
	    }
	  }, {
	    key: 'closePortal',
	    value: function closePortal() {
	      if (_exenv.canUseDOM) {
	        (0, _reactDom.unmountComponentAtNode)(this.node);
	        if (global.document.body.contains && global.document.body.contains(this.node)) {
	          global.document.body.removeChild(this.node);
	        }
	      }
	    }
	  }]);
	
	  return Portal;
	}(_react.Component);
	
	Portal.propTypes = {
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node).isRequired : __webpack_require__(82).any.isRequired,
	  callback: __webpack_require__(82).func
	};
	exports.default = Portal;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactPopper = __webpack_require__(277);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Root = (0, _styles.createStyledComponent)(_reactPopper.Target, {
	  display: 'inline-block'
	}, {
	  displayName: 'PopoverTrigger'
	});
	
	var PopoverTrigger = function (_Component) {
	  _inherits(PopoverTrigger, _Component);
	
	  function PopoverTrigger() {
	    _classCallCheck(this, PopoverTrigger);
	
	    return _possibleConstructorReturn(this, (PopoverTrigger.__proto__ || Object.getPrototypeOf(PopoverTrigger)).apply(this, arguments));
	  }
	
	  _createClass(PopoverTrigger, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          children = _props.children,
	          restProps = _objectWithoutProperties(_props, ['children']);
	
	      var rootProps = {
	        component: 'span'
	      };
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        (0, _react.cloneElement)(_react.Children.only(children), restProps)
	      );
	    }
	  }]);
	
	  return PopoverTrigger;
	}(_react.Component);
	
	PopoverTrigger.propTypes = {
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node).isRequired : __webpack_require__(82).any.isRequired
	};
	exports.default = PopoverTrigger;

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _themes = __webpack_require__(290);
	
	var _Card = __webpack_require__(317);
	
	var _RtlPopper = __webpack_require__(347);
	
	var _RtlPopper2 = _interopRequireDefault(_RtlPopper);
	
	var _PopoverArrow = __webpack_require__(350);
	
	var _PopoverArrow2 = _interopRequireDefault(_PopoverArrow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var arrowSize = '8px';
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    PopoverContent_backgroundColor: baseTheme.color_white,
	    PopoverContent_borderColor: baseTheme.color_gray_20,
	    PopoverContent_borderRadius: baseTheme.borderRadius_1,
	    PopoverContent_boxShadow: baseTheme.shadow_2,
	    PopoverContent_color: baseTheme.color_text,
	    PopoverContent_paddingVertical: baseTheme.space_inset_sm,
	    PopoverContent_maxWidth: 'none',
	    PopoverContent_zIndex: baseTheme.zIndex_100,
	
	    PopoverContentBlock_marginVertical: baseTheme.space_stack_sm,
	    PopoverContentBlock_paddingHorizontal: baseTheme.space_inset_md
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)(_RtlPopper2.default, function (_ref) {
	  var baseTheme = _ref.theme;
	
	  var theme = componentTheme(baseTheme);
	
	  return {
	    backgroundColor: theme.PopoverContent_backgroundColor,
	    border: '1px solid ' + theme.PopoverContent_borderColor,
	    borderRadius: theme.PopoverContent_borderRadius,
	    boxShadow: theme.PopoverContent_boxShadow,
	    color: theme.PopoverContent_color,
	    padding: theme.PopoverContent_paddingVertical + ' 0',
	    maxWidth: theme.PopoverContent_maxWidth,
	    zIndex: theme.PopoverContent_zIndex,
	
	    '&[data-placement^="top"]': {
	      marginBottom: arrowSize
	    },
	    '&[data-placement^="bottom"]': {
	      marginTop: arrowSize
	    },
	    '&[data-placement^="left"]': {
	      marginRight: arrowSize
	    },
	    '&[data-placement^="right"]': {
	      marginLeft: arrowSize
	    },
	    '&[data-x-out-of-boundaries]': {
	      visibility: 'hidden'
	    }
	  };
	}, {
	  displayName: 'PopoverContent',
	  includeStyleReset: true
	});
	
	var cardOverrides = function cardOverrides(_ref2) {
	  var baseTheme = _ref2.theme;
	
	  var theme = componentTheme(baseTheme);
	  return {
	    CardRow_marginVertical: theme.PopoverContentBlock_marginVertical,
	    CardRow_marginVerticalLast: theme.PopoverContentBlock_marginVertical,
	    CardRow_paddingHorizontal: theme.PopoverContentBlock_paddingHorizontal
	  };
	};
	
	var PopoverBlock = (0, _themes.createThemedComponent)(_Card.CardBlock, cardOverrides);
	var PopoverTitle = (0, _themes.createThemedComponent)(_Card.CardTitle, cardOverrides);
	
	/**
	 * PopoverContent component
	 */
	
	var PopoverContent = function (_Component) {
	  _inherits(PopoverContent, _Component);
	
	  function PopoverContent() {
	    _classCallCheck(this, PopoverContent);
	
	    return _possibleConstructorReturn(this, (PopoverContent.__proto__ || Object.getPrototypeOf(PopoverContent)).apply(this, arguments));
	  }
	
	  _createClass(PopoverContent, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          children = _props.children,
	          hasArrow = _props.hasArrow,
	          placement = _props.placement,
	          subtitle = _props.subtitle,
	          title = _props.title,
	          restProps = _objectWithoutProperties(_props, ['children', 'hasArrow', 'placement', 'subtitle', 'title']);
	
	      var rootProps = _extends({
	        placement: placement
	      }, restProps);
	      var popoverArrowProps = {
	        size: arrowSize,
	        placement: placement
	      };
	
	      var _ref4 = _jsx(PopoverTitle, {
	        subtitle: subtitle
	      }, void 0, title);
	
	      var _ref5 = _jsx(PopoverBlock, {}, void 0, children);
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        function (_ref3) {
	          var popperProps = _ref3.popperProps,
	              restProps = _ref3.restProps;
	
	          var wrapperProps = _extends({}, popperProps, restProps);
	          popoverArrowProps.placement = wrapperProps['data-placement'];
	
	          return _react2.default.createElement(
	            'div',
	            wrapperProps,
	            title && _ref4,
	            _ref5,
	            hasArrow && _react2.default.createElement(_PopoverArrow2.default, popoverArrowProps)
	          );
	        }
	      );
	    }
	  }]);
	
	  return PopoverContent;
	}(_react.Component);
	
	PopoverContent.propTypes = {
	  /** Content of the Popover */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node).isRequired : __webpack_require__(82).any.isRequired,
	
	  /**
	   * Plugins that are used to alter behavior. See
	   * [PopperJS docs](https://popper.js.org/popper-documentation.html#modifiers)
	   * for options.
	   */
	  modifiers: __webpack_require__(82).object,
	
	  /** Include an arrow on the Popover content pointing to the trigger */
	  hasArrow: __webpack_require__(82).bool,
	
	  /** Placement of the Popover */
	  placement: __webpack_require__(82).oneOf(['auto', 'auto-end', 'auto-start', 'bottom', 'bottom-end', 'bottom-start', 'left', 'left-end', 'left-start', 'right', 'right-end', 'right-start', 'top', 'top-end', 'top-start']),
	
	  /** Subtitle displayed under the title */
	  subtitle: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Title of the Popover */
	  title: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any
	};
	exports.default = PopoverContent;

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createColorRamp = __webpack_require__(291);
	
	Object.defineProperty(exports, 'createColorRamp', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createColorRamp).default;
	  }
	});
	
	var _createTheme = __webpack_require__(292);
	
	Object.defineProperty(exports, 'createTheme', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createTheme).default;
	  }
	});
	
	var _createThemedComponent = __webpack_require__(313);
	
	Object.defineProperty(exports, 'createThemedComponent', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_createThemedComponent).default;
	  }
	});
	
	var _fontSizeBase = __webpack_require__(88);
	
	Object.defineProperty(exports, 'fontSizeBase', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_fontSizeBase).default;
	  }
	});
	
	var _mapComponentThemes = __webpack_require__(316);
	
	Object.defineProperty(exports, 'mapComponentThemes', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_mapComponentThemes).default;
	  }
	});
	
	var _mineralTheme = __webpack_require__(315);
	
	Object.defineProperty(exports, 'mineralTheme', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_mineralTheme).default;
	  }
	});
	
	var _ThemeProvider = __webpack_require__(314);
	
	Object.defineProperty(exports, 'ThemeProvider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ThemeProvider).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 291 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createColorRamp;
	
	/**
	  * Generates an object of colors with renamed keys from a color palette.
	  * This is primarily used to translate plain color objects into theme variables.
	  *
	  * e.g.
	  *    createColorRamp('blue', 'color_theme', color);
	  *
	  *    returns
	  *      {
	  *        color_theme_10: '#e6eefc',
	  *        color_theme_20: '#c2dbfc',
	  *        color_theme_30: '#9dc2fa',
	  *        color_theme_40: '#72a5f2',
	  *        color_theme_50: '#4a89e8',
	  *        color_theme_60: '#2e6fd9',
	  *        color_theme_70: '#1f5dc2',
	  *        color_theme_80: '#164ea8',
	  *        color_theme_90: '#114091',
	  *        color_theme_100: '#0f397d
	  *      }
	  */
	function createColorRamp(inKey, // The key of the color in the color palette, excluding the index
	outKey, // The key of the color in the returned object, excluding the index
	colors // The palette of colors
	) {
	  var REGEX_IN_KEY = new RegExp("^" + inKey);
	  return Object.keys(colors).filter(function (key) {
	    return REGEX_IN_KEY.test(key);
	  }).reduce(function (acc, key) {
	    var newKey = key.replace(REGEX_IN_KEY, outKey);
	    acc[newKey] = colors[key];
	    return acc;
	  }, {});
	}

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = createTheme;
	
	var _colors = __webpack_require__(293);
	
	var _colors2 = _interopRequireDefault(_colors);
	
	var _createColorRamp = __webpack_require__(291);
	
	var _createColorRamp2 = _interopRequireDefault(_createColorRamp);
	
	var _fontSizeBase = __webpack_require__(88);
	
	var _fontSizeBase2 = _interopRequireDefault(_fontSizeBase);
	
	var _pxToEm = __webpack_require__(87);
	
	var _pxToEm2 = _interopRequireDefault(_pxToEm);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var spacing_quarter = (0, _pxToEm2.default)(2);
	var spacing_half = (0, _pxToEm2.default)(4);
	var spacing_1x = (0, _pxToEm2.default)(8);
	var spacing_2x = (0, _pxToEm2.default)(16);
	var spacing_3x = (0, _pxToEm2.default)(24);
	var spacing_4x = (0, _pxToEm2.default)(32);
	var spacing_8x = (0, _pxToEm2.default)(64);
	
	var grays = (0, _createColorRamp2.default)('gray', 'color_gray', _colors2.default);
	
	function createTheme() {
	  var baseColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'blue';
	  var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	  /* Theme key naming convention:
	   *
	   *   [property]_[target]_[variant]_[state]
	   *
	   * E.g., A key for the border-color on focused "success" buttons and inputs
	   * would look like the following.
	   *
	   *   borderColor_success_focus
	   *
	   * Only [property] is required. Irrelevant parts are skipped.
	   */
	
	  var primaries = (0, _createColorRamp2.default)(baseColor, 'color_theme', _colors2.default);
	
	  // prettier-ignore
	  return _extends({
	    backgroundColor_disabled: _colors2.default.gray_20,
	    backgroundColor_danger: _colors2.default.red_60,
	    backgroundColor_danger_muted: _colors2.default.red_20,
	    backgroundColor_danger_active: _colors2.default.red_70,
	    backgroundColor_danger_activeMuted: _colors2.default.red_30,
	    backgroundColor_danger_focus: _colors2.default.red_60,
	    backgroundColor_danger_hover: _colors2.default.red_50,
	    backgroundColor_success: _colors2.default.green_80,
	    backgroundColor_success_muted: _colors2.default.green_20,
	    backgroundColor_success_active: _colors2.default.green_90,
	    backgroundColor_success_activeMuted: _colors2.default.green_30,
	    backgroundColor_success_focus: _colors2.default.green_80,
	    backgroundColor_success_hover: _colors2.default.green_70,
	    backgroundColor_warning: _colors2.default.orange_60,
	    backgroundColor_warning_muted: _colors2.default.orange_20,
	    backgroundColor_warning_active: _colors2.default.orange_70,
	    backgroundColor_warning_activeMuted: _colors2.default.orange_30,
	    backgroundColor_warning_focus: _colors2.default.orange_60,
	    backgroundColor_warning_hover: _colors2.default.orange_50,
	
	    backgroundColor_input: _colors2.default.white,
	
	    backgroundColor_link_focus: _colors2.default.gray_30,
	
	    borderColor: _colors2.default.gray_40,
	    borderColor_active: primaries.color_theme_60,
	    borderColor_focus: primaries.color_theme_60,
	    borderColor_hover: primaries.color_theme_60,
	    borderColor_danger: _colors2.default.red_60,
	    borderColor_danger_active: _colors2.default.red_70,
	    borderColor_danger_focus: _colors2.default.red_70,
	    borderColor_danger_hover: _colors2.default.red_70,
	    borderColor_danger_muted: _colors2.default.red_40,
	    borderColor_success: _colors2.default.green_70,
	    borderColor_success_active: _colors2.default.green_80,
	    borderColor_success_focus: _colors2.default.green_80,
	    borderColor_success_hover: _colors2.default.green_80,
	    borderColor_success_muted: _colors2.default.green_40,
	    borderColor_warning: _colors2.default.orange_60,
	    borderColor_warning_active: _colors2.default.orange_70,
	    borderColor_warning_focus: _colors2.default.orange_70,
	    borderColor_warning_hover: _colors2.default.orange_70,
	    borderColor_warning_muted: _colors2.default.orange_40,
	
	    borderRadius_1: (0, _pxToEm2.default)(3),
	
	    breakpoint_narrow: 512,
	    breakpoint_medium: 768,
	    breakpoint_wide: 1024,
	
	    color_black: _colors2.default.black,
	
	    color_caption: _colors2.default.gray_80
	
	  }, grays, {
	
	    color_placeholder: _colors2.default.gray_60
	
	  }, primaries, {
	
	    color_text: _colors2.default.gray_100,
	    color_text_disabled: _colors2.default.gray_50,
	    color_text_danger: _colors2.default.red_60,
	    color_text_danger_active: _colors2.default.red_70,
	    color_text_danger_focus: _colors2.default.red_60,
	    color_text_danger_hover: _colors2.default.red_50,
	    color_text_ondanger: _colors2.default.white,
	    color_text_primary: primaries.color_theme_60,
	    color_text_primary_active: primaries.color_theme_70,
	    color_text_primary_focus: primaries.color_theme_60,
	    color_text_primary_hover: primaries.color_theme_50,
	    color_text_onprimary: _colors2.default.white,
	    color_text_success: _colors2.default.green_90,
	    color_text_success_active: _colors2.default.green_100,
	    color_text_success_focus: _colors2.default.green_90,
	    color_text_success_hover: _colors2.default.green_80,
	    color_text_onsuccess: _colors2.default.white,
	    color_text_warning: _colors2.default.orange_70,
	    color_text_warning_active: _colors2.default.orange_80,
	    color_text_warning_focus: _colors2.default.orange_70,
	    color_text_warning_hover: _colors2.default.orange_60,
	    color_text_onwarning: _colors2.default.white,
	
	    color_white: _colors2.default.white,
	
	    direction: 'ltr',
	
	    fontFamily: 'Open Sans',
	    fontFamily_system: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
	    fontFamily_monospace: '"SF Mono", "Droid Sans Mono", "Source Code Pro", Monaco, Consolas, "Courier New", Courier, monospace',
	
	    fontSize_base: _fontSizeBase2.default,
	    fontSize_h1: (0, _pxToEm2.default)(34),
	    fontSize_h2: (0, _pxToEm2.default)(28),
	    fontSize_h3: (0, _pxToEm2.default)(22),
	    fontSize_h4: (0, _pxToEm2.default)(18),
	    fontSize_h5: (0, _pxToEm2.default)(14),
	    fontSize_h6: (0, _pxToEm2.default)(14),
	    fontSize_mouse: (0, _pxToEm2.default)(11),
	    fontSize_prose: (0, _pxToEm2.default)(16),
	    fontSize_ui: (0, _pxToEm2.default)(14),
	
	    fontWeight_regular: 400,
	    fontWeight_semiBold: 600,
	    fontWeight_bold: 700,
	    fontWeight_extraBold: 800,
	
	    lineHeight: 1.25,
	    lineHeight_prose: 1.5,
	
	    shadow_1: '0 1px 2px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.2)',
	    shadow_2: '0 2px 4px 0 rgba(0,0,0,0.2), 0 4px 8px 0 rgba(0,0,0,0.2)',
	    shadow_3: '0 4px 8px 0 rgba(0,0,0,0.2), 0 8px 16px 0 rgba(0,0,0,0.2)',
	    shadow_4: '0 8px 16px 0 rgba(0,0,0,0.2), 0 20px 16px -8px rgba(0,0,0,0.2)',
	    shadow_5: '0 16px 24px 0 rgba(0,0,0,0.2), 0 32px 24px -16px rgba(0,0,0,0.2)',
	
	    size_small: (0, _pxToEm2.default)(24),
	    size_medium: (0, _pxToEm2.default)(32),
	    size_large: (0, _pxToEm2.default)(40),
	    size_jumbo: (0, _pxToEm2.default)(52),
	
	    space_inline_xxs: spacing_quarter,
	    space_inline_xs: spacing_half,
	    space_inline_sm: spacing_1x,
	    space_inline_md: spacing_2x,
	    space_inline_lg: spacing_3x,
	    space_inline_xl: spacing_4x,
	    space_inline_xxl: spacing_8x,
	
	    space_inset_sm: spacing_1x,
	    space_inset_md: spacing_2x,
	    space_inset_lg: spacing_3x,
	
	    space_stack_xxs: spacing_quarter,
	    space_stack_xs: spacing_half,
	    space_stack_sm: spacing_1x,
	    space_stack_md: spacing_2x,
	    space_stack_lg: spacing_3x,
	    space_stack_xl: spacing_4x,
	    space_stack_xxl: spacing_8x,
	
	    zIndex_100: 100,
	    zIndex_200: 200,
	    zIndex_400: 400,
	    zIndex_800: 800,
	    zIndex_1600: 1600
	
	  }, overrides);
	}

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _palette = __webpack_require__(294);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_palette).default;
	  }
	});
	
	var _blue = __webpack_require__(295);
	
	Object.defineProperty(exports, 'blue', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_blue).default;
	  }
	});
	
	var _common = __webpack_require__(296);
	
	Object.defineProperty(exports, 'common', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_common).default;
	  }
	});
	
	var _dusk = __webpack_require__(297);
	
	Object.defineProperty(exports, 'dusk', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_dusk).default;
	  }
	});
	
	var _gray = __webpack_require__(298);
	
	Object.defineProperty(exports, 'gray', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_gray).default;
	  }
	});
	
	var _green = __webpack_require__(299);
	
	Object.defineProperty(exports, 'green', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_green).default;
	  }
	});
	
	var _indigo = __webpack_require__(300);
	
	Object.defineProperty(exports, 'indigo', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_indigo).default;
	  }
	});
	
	var _lime = __webpack_require__(301);
	
	Object.defineProperty(exports, 'lime', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_lime).default;
	  }
	});
	
	var _magenta = __webpack_require__(302);
	
	Object.defineProperty(exports, 'magenta', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_magenta).default;
	  }
	});
	
	var _orange = __webpack_require__(303);
	
	Object.defineProperty(exports, 'orange', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_orange).default;
	  }
	});
	
	var _purple = __webpack_require__(304);
	
	Object.defineProperty(exports, 'purple', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_purple).default;
	  }
	});
	
	var _red = __webpack_require__(305);
	
	Object.defineProperty(exports, 'red', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_red).default;
	  }
	});
	
	var _sky = __webpack_require__(306);
	
	Object.defineProperty(exports, 'sky', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_sky).default;
	  }
	});
	
	var _slate = __webpack_require__(307);
	
	Object.defineProperty(exports, 'slate', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_slate).default;
	  }
	});
	
	var _teal = __webpack_require__(308);
	
	Object.defineProperty(exports, 'teal', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_teal).default;
	  }
	});
	
	var _yellow = __webpack_require__(309);
	
	Object.defineProperty(exports, 'yellow', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_yellow).default;
	  }
	});
	
	var _getColor = __webpack_require__(310);
	
	Object.defineProperty(exports, 'getColor', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_getColor).default;
	  }
	});
	
	var _getReadableTextColor = __webpack_require__(312);
	
	Object.defineProperty(exports, 'getReadableTextColor', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_getReadableTextColor).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _blue = __webpack_require__(295);
	
	var _blue2 = _interopRequireDefault(_blue);
	
	var _common = __webpack_require__(296);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _dusk = __webpack_require__(297);
	
	var _dusk2 = _interopRequireDefault(_dusk);
	
	var _gray = __webpack_require__(298);
	
	var _gray2 = _interopRequireDefault(_gray);
	
	var _green = __webpack_require__(299);
	
	var _green2 = _interopRequireDefault(_green);
	
	var _indigo = __webpack_require__(300);
	
	var _indigo2 = _interopRequireDefault(_indigo);
	
	var _lime = __webpack_require__(301);
	
	var _lime2 = _interopRequireDefault(_lime);
	
	var _magenta = __webpack_require__(302);
	
	var _magenta2 = _interopRequireDefault(_magenta);
	
	var _orange = __webpack_require__(303);
	
	var _orange2 = _interopRequireDefault(_orange);
	
	var _purple = __webpack_require__(304);
	
	var _purple2 = _interopRequireDefault(_purple);
	
	var _red = __webpack_require__(305);
	
	var _red2 = _interopRequireDefault(_red);
	
	var _sky = __webpack_require__(306);
	
	var _sky2 = _interopRequireDefault(_sky);
	
	var _slate = __webpack_require__(307);
	
	var _slate2 = _interopRequireDefault(_slate);
	
	var _teal = __webpack_require__(308);
	
	var _teal2 = _interopRequireDefault(_teal);
	
	var _yellow = __webpack_require__(309);
	
	var _yellow2 = _interopRequireDefault(_yellow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _extends({}, _blue2.default, _common2.default, _dusk2.default, _gray2.default, _green2.default, _indigo2.default, _lime2.default, _magenta2.default, _orange2.default, _purple2.default, _red2.default, _sky2.default, _slate2.default, _teal2.default, _yellow2.default);

/***/ }),
/* 295 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  blue_10: '#e6eefc',
	  blue_20: '#c2dbfc',
	  blue_30: '#9dc2fa',
	  blue_40: '#72a5f2',
	  blue_50: '#4a89e8',
	  blue_60: '#2e6fd9',
	  blue_70: '#1f5dc2',
	  blue_80: '#164ea8',
	  blue_90: '#114091',
	  blue_100: '#0f397d',
	
	  a11y_text_light: [60, 70, 80, 90, 100]
	};

/***/ }),
/* 296 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  black: '#1d1f24',
	  white: '#fff'
	};

/***/ }),
/* 297 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  dusk_10: '#eff1f8',
	  dusk_20: '#d8dced',
	  dusk_30: '#bdc4de',
	  dusk_40: '#99a3c4',
	  dusk_50: '#7680a6',
	  dusk_60: '#596387',
	  dusk_70: '#454e6e',
	  dusk_80: '#373f59',
	  dusk_90: '#2c3247',
	  dusk_100: '#24293b',
	
	  a11y_text_light: [60, 70, 80, 90, 100]
	};

/***/ }),
/* 298 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  gray_10: '#f5f7fa',
	  gray_20: '#ebeff5',
	  gray_30: '#dde3ed',
	  gray_40: '#c8d1e0',
	  gray_50: '#afbacc',
	  gray_60: '#8e99ab',
	  gray_70: '#707a8a',
	  gray_80: '#58606e',
	  gray_90: '#434a54',
	  gray_100: '#333840',
	
	  a11y_text_light: [80, 90, 100]
	};

/***/ }),
/* 299 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  green_10: '#e8fcf2',
	  green_20: '#c0fadc',
	  green_30: '#95f5c3',
	  green_40: '#67eba7',
	  green_50: '#40db8d',
	  green_60: '#1fc06f',
	  green_70: '#10a35a',
	  green_80: '#0a8f4c',
	  green_90: '#06783f',
	  green_100: '#046132',
	
	  a11y_text_light: [90, 100]
	};

/***/ }),
/* 300 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  indigo_10: '#e3e3fa',
	  indigo_20: '#cacafa',
	  indigo_30: '#adadf7',
	  indigo_40: '#8d8df2',
	  indigo_50: '#6c6ceb',
	  indigo_60: '#4c4ce0',
	  indigo_70: '#3737d3',
	  indigo_80: '#2c2abd',
	  indigo_90: '#2621a6',
	  indigo_100: '#201d8f',
	
	  a11y_text_light: [60, 70, 80, 90, 100]
	};

/***/ }),
/* 301 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  lime_10: '#f1fae6',
	  lime_20: '#e7facf',
	  lime_30: '#d2f7a8',
	  lime_40: '#b5f07a',
	  lime_50: '#9be650',
	  lime_60: '#81d42f',
	  lime_70: '#6cbf19',
	  lime_80: '#5aa60d',
	  lime_90: '#4a8c08',
	  lime_100: '#3d7307',
	
	  a11y_text_light: [100]
	};

/***/ }),
/* 302 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  magenta_10: '#f7dae3',
	  magenta_20: '#f7bacd',
	  magenta_30: '#f590b0',
	  magenta_40: '#f06591',
	  magenta_50: '#e63e73',
	  magenta_60: '#d92762',
	  magenta_70: '#c91451',
	  magenta_80: '#b30b43',
	  magenta_90: '#a1083b',
	  magenta_100: '#8d0633',
	
	  a11y_text_light: [60, 70, 80, 90, 100]
	};

/***/ }),
/* 303 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  orange_10: '#fce8e1',
	  orange_20: '#fcd0c0',
	  orange_30: '#fab69d',
	  orange_40: '#f59776',
	  orange_50: '#ed774c',
	  orange_60: '#e05b2b',
	  orange_70: '#cf4615',
	  orange_80: '#bd3909',
	  orange_90: '#a83207',
	  orange_100: '#942c06',
	
	  a11y_text_light: [70, 80, 90, 100]
	};

/***/ }),
/* 304 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  purple_10: '#eedefa',
	  purple_20: '#e1c5fa',
	  purple_30: '#d5a7fa',
	  purple_40: '#c588f7',
	  purple_50: '#af64ed',
	  purple_60: '#9545d8',
	  purple_70: '#8136bf',
	  purple_80: '#6d2aa3',
	  purple_90: '#5f248f',
	  purple_100: '#511f7a',
	
	  a11y_text_light: [60, 70, 80, 90, 100]
	};

/***/ }),
/* 305 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  red_10: '#fce3e3',
	  red_20: '#fabebe',
	  red_30: '#f79999',
	  red_40: '#f27474',
	  red_50: '#eb4d4d',
	  red_60: '#db2929',
	  red_70: '#c71818',
	  red_80: '#ad0e0e',
	  red_90: '#940909',
	  red_100: '#7d0606',
	
	  a11y_text_light: [60, 70, 80, 90, 100]
	};

/***/ }),
/* 306 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  sky_10: '#e1f3fc',
	  sky_20: '#c0e5fc',
	  sky_30: '#9fd9fc',
	  sky_40: '#79c7f7',
	  sky_50: '#51b3f0',
	  sky_60: '#2f9fe0',
	  sky_70: '#1b8bcc',
	  sky_80: '#0f75b0',
	  sky_90: '#0a6091',
	  sky_100: '#084d75',
	
	  a11y_text_light: [80, 90, 100]
	};

/***/ }),
/* 307 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  slate_10: '#ebf3f7',
	  slate_20: '#d3e4ed',
	  slate_30: '#b1cfde',
	  slate_40: '#8fb6c9',
	  slate_50: '#709cb3',
	  slate_60: '#598296',
	  slate_70: '#47697a',
	  slate_80: '#3a5663',
	  slate_90: '#2e444f',
	  slate_100: '#253740',
	
	  a11y_text_light: [70, 80, 90, 100]
	};

/***/ }),
/* 308 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  teal_10: '#e6faf7',
	  teal_20: '#bcf7ee',
	  teal_30: '#8df0de',
	  teal_40: '#5ee6cd',
	  teal_50: '#34d1b7',
	  teal_60: '#20baa3',
	  teal_70: '#15a18e',
	  teal_80: '#0f8c7c',
	  teal_90: '#0c7567',
	  teal_100: '#0a6358',
	
	  a11y_text_light: [90, 100]
	};

/***/ }),
/* 309 */
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  yellow_10: '#fcf1dc',
	  yellow_20: '#fce4b6',
	  yellow_30: '#fad48e',
	  yellow_40: '#f7c868',
	  yellow_50: '#f0b241',
	  yellow_60: '#e3a322',
	  yellow_70: '#d19411',
	  yellow_80: '#bd8308',
	  yellow_90: '#a67305',
	  yellow_100: '#916504',
	
	  a11y_text_light: [100]
	};

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keyedColors = __webpack_require__(311);
	
	var _keyedColors2 = _interopRequireDefault(_keyedColors);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (key, level) {
	  return _keyedColors2.default[key] ? _keyedColors2.default[key][key + '_' + level] : undefined;
	};

/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _blue = __webpack_require__(295);
	
	var _blue2 = _interopRequireDefault(_blue);
	
	var _dusk = __webpack_require__(297);
	
	var _dusk2 = _interopRequireDefault(_dusk);
	
	var _gray = __webpack_require__(298);
	
	var _gray2 = _interopRequireDefault(_gray);
	
	var _green = __webpack_require__(299);
	
	var _green2 = _interopRequireDefault(_green);
	
	var _indigo = __webpack_require__(300);
	
	var _indigo2 = _interopRequireDefault(_indigo);
	
	var _lime = __webpack_require__(301);
	
	var _lime2 = _interopRequireDefault(_lime);
	
	var _magenta = __webpack_require__(302);
	
	var _magenta2 = _interopRequireDefault(_magenta);
	
	var _orange = __webpack_require__(303);
	
	var _orange2 = _interopRequireDefault(_orange);
	
	var _purple = __webpack_require__(304);
	
	var _purple2 = _interopRequireDefault(_purple);
	
	var _red = __webpack_require__(305);
	
	var _red2 = _interopRequireDefault(_red);
	
	var _sky = __webpack_require__(306);
	
	var _sky2 = _interopRequireDefault(_sky);
	
	var _slate = __webpack_require__(307);
	
	var _slate2 = _interopRequireDefault(_slate);
	
	var _teal = __webpack_require__(308);
	
	var _teal2 = _interopRequireDefault(_teal);
	
	var _yellow = __webpack_require__(309);
	
	var _yellow2 = _interopRequireDefault(_yellow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  blue: _blue2.default,
	  dusk: _dusk2.default,
	  gray: _gray2.default,
	  green: _green2.default,
	  indigo: _indigo2.default,
	  lime: _lime2.default,
	  magenta: _magenta2.default,
	  orange: _orange2.default,
	  purple: _purple2.default,
	  red: _red2.default,
	  sky: _sky2.default,
	  slate: _slate2.default,
	  teal: _teal2.default,
	  yellow: _yellow2.default
	};

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _keyedColors = __webpack_require__(311);
	
	var _keyedColors2 = _interopRequireDefault(_keyedColors);
	
	var _common = __webpack_require__(296);
	
	var _common2 = _interopRequireDefault(_common);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (key, level) {
	  if (_keyedColors2.default[key]) {
	    return _keyedColors2.default[key].a11y_text_light.indexOf(level) != -1 ? _common2.default.white : _common2.default.black;
	  }
	  return undefined;
	};

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	exports.default = createThemedComponent;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _glamorous = __webpack_require__(50);
	
	var _ThemeProvider = __webpack_require__(314);
	
	var _ThemeProvider2 = _interopRequireDefault(_ThemeProvider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function getComponentDisplayName(Component) {
	  return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Component';
	}
	
	function createThemedComponent(ComponentToTheme, theme) {
	  var ThemedComponent = function ThemedComponent(props, context) {
	    var outTheme = typeof theme === 'function' ? theme(props, context) : theme;
	
	    var ignore = props.theme,
	        outProps = _objectWithoutProperties(props, ['theme']);
	
	    return _jsx(_ThemeProvider2.default, {
	      theme: outTheme
	    }, void 0, _react2.default.createElement(ComponentToTheme, outProps));
	  };
	
	  ThemedComponent.propTypes = ComponentToTheme.propTypes;
	
	  ThemedComponent.displayName = 'Themed(' + getComponentDisplayName(ComponentToTheme) + ')';
	
	  return (0, _glamorous.withTheme)(ThemedComponent);
	}

/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	exports.default = ThemeProvider;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _glamorous = __webpack_require__(50);
	
	var _mineralTheme = __webpack_require__(315);
	
	var _mineralTheme2 = _interopRequireDefault(_mineralTheme);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * ThemeProvider provides a theme to the tree of components contained within.  See the [theming page](/theming) for more information.
	 */
	function ThemeProvider(_ref) {
	  var children = _ref.children,
	      _ref$theme = _ref.theme,
	      theme = _ref$theme === undefined ? _mineralTheme2.default : _ref$theme;
	
	  return _jsx(_glamorous.ThemeProvider, {
	    theme: theme
	  }, void 0, children);
	}
	ThemeProvider.propTypes = {
	  /** Components to which the theme will be applied */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** A shallow object of [theme variables](/theming#common-scenarios-theme-structure) and their values */
	  theme: __webpack_require__(82).object
	};

/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createTheme = __webpack_require__(292);
	
	var _createTheme2 = _interopRequireDefault(_createTheme);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _createTheme2.default)();

/***/ }),
/* 316 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = mapComponentThemes;
	
	/**
	  * Generates a new component theme based on the theme of another component.
	  */
	function mapComponentThemes(source, override, baseTheme) {
	  var REGEXP_SOURCE_NAME = new RegExp("^" + source.name);
	  var sourceThemeWithRenamedKeys = Object.keys(source.theme).reduce(function (acc, sourceKey) {
	    if (REGEXP_SOURCE_NAME.test(sourceKey)) {
	      var overrideKey = sourceKey.replace(REGEXP_SOURCE_NAME, override.name);
	      acc[overrideKey] = source.theme[sourceKey];
	    }
	    return acc;
	  }, {});
	
	  return _extends({}, baseTheme, sourceThemeWithRenamedKeys, override.theme);
	}

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Card = __webpack_require__(318);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Card).default;
	  }
	});
	
	var _CardActions = __webpack_require__(319);
	
	Object.defineProperty(exports, 'CardActions', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardActions).default;
	  }
	});
	
	var _CardBlock = __webpack_require__(320);
	
	Object.defineProperty(exports, 'CardBlock', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardBlock).default;
	  }
	});
	
	var _CardDivider = __webpack_require__(322);
	
	Object.defineProperty(exports, 'CardDivider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardDivider).default;
	  }
	});
	
	var _CardFooter = __webpack_require__(323);
	
	Object.defineProperty(exports, 'CardFooter', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardFooter).default;
	  }
	});
	
	var _CardImage = __webpack_require__(326);
	
	Object.defineProperty(exports, 'CardImage', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardImage).default;
	  }
	});
	
	var _CardStatus = __webpack_require__(327);
	
	Object.defineProperty(exports, 'CardStatus', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardStatus).default;
	  }
	});
	
	var _CardTitle = __webpack_require__(331);
	
	Object.defineProperty(exports, 'CardTitle', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardTitle).default;
	  }
	});
	
	var _CardTitleMenu = __webpack_require__(335);
	
	Object.defineProperty(exports, 'CardTitleMenu', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_CardTitleMenu).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = Card;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    Card_backgroundColor: baseTheme.color_white,
	    Card_borderColor: baseTheme.color_gray_20,
	    Card_borderRadius: baseTheme.borderRadius_1,
	    Card_boxShadow: baseTheme.shadow_2,
	    Card_boxShadow_focus: '0 0 0 2px ' + baseTheme.color_theme_100 + ', ' + baseTheme.shadow_1,
	
	    CardRow_marginVertical: baseTheme.space_stack_md,
	    CardRow_marginVerticalLast: baseTheme.space_stack_lg,
	    CardRow_paddingHorizontal: baseTheme.space_inset_md
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('div', function (props) {
	  var theme = componentTheme(props.theme);
	
	  return {
	    backgroundColor: theme.Card_backgroundColor,
	    border: '1px solid ' + theme.Card_borderColor,
	    borderRadius: theme.Card_borderRadius,
	    boxShadow: theme.Card_boxShadow,
	    cursor: props.onClick && 'pointer',
	    paddingBottom: '0.01em', // Necessary to prevent margin collapse of last-child
	    paddingTop: '0.01em', // Necessary to prevent margin collapse of first-child
	
	    '&:focus, &[data-simulate-focus]': {
	      boxShadow: theme.Card_boxShadow_focus
	    }
	  };
	}, {
	  displayName: 'Card',
	  includeStyleReset: true
	});
	
	var onKeyDown = function onKeyDown(props, event) {
	  if (event.key === 'Enter' || event.key === ' ') {
	    event.preventDefault();
	    props.onClick && props.onClick(event);
	  }
	};
	
	/**
	 * Cards group conceptually related content.
	 * Cards represent a gateway to more detailed information in another app view.
	 * Use Cards to provide detail about a feature in your app, or to represent data
	 * with which your users can interact.
	 */
	function Card(props) {
	  var rootProps = _extends({
	    onKeyDown: props.onClick ? onKeyDown.bind(null, props) : undefined,
	    role: props.onClick ? 'button' : undefined,
	    tabIndex: props.onClick ? 0 : undefined
	  }, props);
	  return _react2.default.createElement(Root, rootProps);
	}
	Card.propTypes = {
	  /** Content of Card; see the [Basic](#basic) example for more details */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node).isRequired : __webpack_require__(82).any.isRequired,
	
	  /** Called with the click event */
	  onClick: __webpack_require__(82).func
	};

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = CardActions;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _Button = __webpack_require__(46);
	
	var _Button2 = _interopRequireDefault(_Button);
	
	var _Card = __webpack_require__(318);
	
	var _CardBlock = __webpack_require__(320);
	
	var _CardRow = __webpack_require__(321);
	
	var _CardRow2 = _interopRequireDefault(_CardRow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    CardActionsAction_spaceInline: baseTheme.space_inline_sm
	
	  }, baseTheme);
	};
	
	var styles = {
	  action: function action(props) {
	    var theme = _extends({}, componentTheme(props.theme), (0, _CardBlock.componentTheme)(props.theme));
	    var rtl = theme.direction === 'rtl';
	    var fontSize = theme.CardBlock_fontSize;
	    var actionsGap = (0, _styles.getNormalizedValue)(theme.CardActionsAction_spaceInline, fontSize);
	
	    return {
	      alignItems: 'center',
	      display: 'flex',
	      flex: '0 0 auto',
	      fontSize: fontSize,
	      marginBottom: actionsGap,
	      marginLeft: rtl ? null : actionsGap,
	      marginRight: rtl ? actionsGap : null
	    };
	  },
	  root: function root(props) {
	    var theme = _extends({}, componentTheme(props.theme), (0, _Card.componentTheme)(props.theme));
	
	    return {
	      display: 'flex',
	      flexWrap: 'wrap',
	      justifyContent: 'flex-end',
	      // We subtract `theme.CardActionsAction_spaceInline` because of the marginBottom on Action.
	      marginBottom: parseFloat(theme.CardRow_marginVertical) - parseFloat(theme.CardActionsAction_spaceInline) + 'em'
	    };
	  }
	};
	
	var Root = (0, _styles.createStyledComponent)(_CardRow2.default, styles.root, {
	  displayName: 'CardActions'
	});
	var Action = (0, _styles.createStyledComponent)('span', styles.action);
	
	/**
	 * The CardActions component allows you to lay out actions inside your [Card](/components/card).
	 */
	function CardActions(_ref) {
	  var children = _ref.children,
	      restProps = _objectWithoutProperties(_ref, ['children']);
	
	  var actions = _react.Children.map(children, function (child, index) {
	    if (child.type === _Button2.default) {
	      child = (0, _react.cloneElement)(child, { size: 'medium' });
	    }
	    return _jsx(Action, {}, index, child);
	  });
	
	  return _react2.default.createElement(
	    Root,
	    restProps,
	    actions
	  );
	}

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = CardBlock;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _Card = __webpack_require__(318);
	
	var _CardRow = __webpack_require__(321);
	
	var _CardRow2 = _interopRequireDefault(_CardRow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    CardBlock_fontSize: baseTheme.fontSize_ui,
	    CardBlock_lineHeight: baseTheme.lineHeight_prose
	
	  }, baseTheme);
	};
	
	var styles = {
	  inner: function inner(props) {
	    var theme = componentTheme(props.theme);
	
	    return {
	      fontSize: theme.CardBlock_fontSize,
	      lineHeight: theme.CardBlock_lineHeight
	    };
	  },
	  root: function root(props) {
	    var theme = (0, _Card.componentTheme)(props.theme);
	
	    return {
	      '&:last-child': {
	        marginBottom: theme.CardRow_marginVerticalLast
	      }
	    };
	  }
	};
	
	var Root = (0, _styles.createStyledComponent)(_CardRow2.default, styles.root, {
	  displayName: 'CardBlock'
	});
	var Inner = (0, _styles.createStyledComponent)('div', styles.inner);
	
	/**
	 * CardBlock is used to normalize font sizes for content and to provide
	 * consistent margins and padding.
	 */
	function CardBlock(_ref) {
	  var children = _ref.children,
	      restProps = _objectWithoutProperties(_ref, ['children']);
	
	  return _react2.default.createElement(
	    Root,
	    restProps,
	    _jsx(Inner, {}, void 0, children)
	  );
	}

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _styles = __webpack_require__(48);
	
	var _Card = __webpack_require__(318);
	
	exports.default = (0, _styles.createStyledComponent)('div', function (props) {
	  var theme = (0, _Card.componentTheme)(props.theme);
	
	  return {
	    marginBottom: theme.CardRow_marginVertical,
	    marginTop: theme.CardRow_marginVertical,
	    paddingLeft: theme.CardRow_paddingHorizontal,
	    paddingRight: theme.CardRow_paddingHorizontal
	  };
	}, {
	  displayName: 'CardRow'
	});

/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = CardDivider;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _Card = __webpack_require__(318);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    CardDivider_borderColor: baseTheme.borderColor,
	    CardDivider_borderWidth: '1px'
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('div', function (props) {
	  var theme = _extends({}, componentTheme(props.theme), (0, _Card.componentTheme)(props.theme));
	
	  return {
	    backgroundColor: theme.CardDivider_borderColor,
	    height: theme.CardDivider_borderWidth,
	    margin: theme.CardRow_marginVertical + ' 0'
	  };
	}, {
	  displayName: 'CardDivider'
	});
	
	/**
	 * CardDividers separate content in [Card](/components/card) to establish hierarchy.
	 *
	 * Too many dividers will add unnecessary weight to your Card.
	 */
	function CardDivider(props) {
	  return _react2.default.createElement(Root, _extends({}, props, { role: 'separator' }));
	}

/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _themes = __webpack_require__(290);
	
	var _Button = __webpack_require__(46);
	
	var _Button2 = _interopRequireDefault(_Button);
	
	var _IconExpandLess = __webpack_require__(324);
	
	var _IconExpandLess2 = _interopRequireDefault(_IconExpandLess);
	
	var _IconExpandMore = __webpack_require__(325);
	
	var _IconExpandMore2 = _interopRequireDefault(_IconExpandMore);
	
	var _Card = __webpack_require__(318);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    CardFooter_backgroundColor: baseTheme.color_gray_20,
	    CardFooter_borderColor: baseTheme.color_gray_40,
	
	    CardFooterRow_marginVertical: baseTheme.space_stack_sm,
	    CardFooterRow_marginVerticalLast: baseTheme.space_stack_md,
	
	    CardFooterTitle_color: baseTheme.color_text,
	    CardFooterTitle_fontSize: baseTheme.fontSize_h5,
	    CardFooterTitle_fontWeight: baseTheme.fontWeight_bold
	
	  }, baseTheme);
	};
	
	/*
	 * CardFooter can have children like CardBlock and CardActions. When those
	 * components are used directly inside Card they have a specific top/bottom
	 * margin, but when they're used within CardFooter, they have a different
	 * top/bottom margin. This technique accomplishes that without writing a bunch
	 * of descendant selectors.
	 */
	var footerTheme = function footerTheme(_ref) {
	  var theme = _ref.theme;
	  return {
	    CardRow_marginVertical: componentTheme(theme).CardFooterRow_marginVertical,
	    CardRow_marginVerticalLast: componentTheme(theme).CardFooterRow_marginVerticalLast
	  };
	};
	
	var styles = {
	  root: function root(_ref2) {
	    var variant = _ref2.variant,
	        baseTheme = _ref2.theme;
	
	    var theme = _extends({}, componentTheme(baseTheme), (0, _Card.componentTheme)(baseTheme));
	
	    if (variant) {
	      theme = _extends({}, theme, {
	        CardFooter_backgroundColor: theme['backgroundColor_' + variant + '_muted'],
	        CardFooter_borderColor: theme['borderColor_' + variant + '_muted']
	      });
	    }
	
	    // [1] Making the footer overlap the Card border. The `calc` bit accounts
	    //     for the paddingBottom on Card to prevent margin collapse.
	    return {
	      backgroundColor: theme.CardFooter_backgroundColor,
	      border: '1px solid ' + theme.CardFooter_borderColor,
	      borderRadius: '0 0 ' + theme.Card_borderRadius + ' ' + theme.Card_borderRadius,
	      margin: '0 -1px calc(-1px - 0.01em) -1px', // [1]
	      paddingBottom: '0.01em', // Necessary to prevent margin collapse of last-child
	      paddingTop: '0.01em' // Necessary to prevent margin collapse of first-child
	    };
	  },
	  title: function title(props) {
	    var theme = _extends({}, componentTheme(props.theme), (0, _Card.componentTheme)(props.theme));
	    return {
	      alignItems: 'flex-start',
	      display: 'flex',
	      marginBottom: theme.CardFooterRow_marginVertical,
	      marginTop: theme.CardFooterRow_marginVertical,
	      paddingLeft: theme.CardRow_paddingHorizontal,
	      paddingRight: theme.CardRow_paddingHorizontal
	    };
	  },
	  titleContent: function titleContent(props) {
	    var theme = componentTheme(props.theme);
	
	    return {
	      color: theme.CardFooterTitle_color,
	      flex: '1 1 auto',
	      fontSize: theme.CardFooterTitle_fontSize,
	      fontWeight: theme.CardFooterTitle_fontWeight,
	      margin: 0
	    };
	  },
	  /*
	   * A large Button, even with zero'd padding, is still a bit too large in this
	   * context. These styles allow the Button to shrink, but the Icon remains the
	   * same size.
	   */
	  toggleButton: function toggleButton(_ref3) {
	    var theme = _ref3.theme;
	    return {
	      flex: '0 0 auto',
	      height: 'auto',
	      minWidth: 0,
	      overflow: 'hidden',
	      padding: 0,
	      transform: 'translateY(-' + (0, _styles.pxToEm)(1) + ')', // Optical alignment
	
	      // Inner
	      '& > span': {
	        display: 'block',
	        margin: '-' + (0, _styles.pxToEm)(4)
	      },
	
	      '& [role="img"]': {
	        fill: theme.color_text
	      }
	    };
	  }
	};
	
	var Root = (0, _styles.createStyledComponent)('div', styles.root, {
	  displayName: 'CardFooter'
	});
	/*
	 * We shouldn't just create a themed 'div', because it won't be able to apply
	 * the provided theme to itself, which breaks the expectation of
	 * createThemedComponent. So, we theme a simple functional component that
	 * returns a 'div' instead.
	 */
	var Content = (0, _themes.createThemedComponent)(function (props) {
	  return _react2.default.createElement('div', props);
	}, footerTheme);
	var Title = (0, _styles.createStyledComponent)('div', styles.title);
	var TitleContent = (0, _styles.createStyledComponent)('h4', styles.titleContent);
	var ToggleButton = (0, _styles.createStyledComponent)(_Button2.default, styles.toggleButton);
	
	/**
	 * CardFooter is used to append a visually distinct section to [Card](/components/card).
	 */
	
	var CardFooter = function (_Component) {
	  _inherits(CardFooter, _Component);
	
	  function CardFooter() {
	    var _ref4;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, CardFooter);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = CardFooter.__proto__ || Object.getPrototypeOf(CardFooter)).call.apply(_ref4, [this].concat(args))), _this), _this.state = {
	      isOpen: !_this.props.expandable || Boolean(_this.props.defaultIsOpen)
	    }, _this.close = function (event) {
	      if (_this.isControlled('isOpen')) {
	        _this.closeActions(event);
	      } else {
	        _this.setState(function () {
	          return { isOpen: false };
	        }, function () {
	          _this.closeActions(event);
	        });
	      }
	    }, _this.closeActions = function (event) {
	      _this.props.onClose && _this.props.onClose(event);
	    }, _this.open = function (event) {
	      if (_this.isControlled('isOpen')) {
	        _this.openActions(event);
	      } else {
	        _this.setState(function () {
	          return { isOpen: true };
	        }, function () {
	          _this.openActions(event);
	        });
	      }
	    }, _this.openActions = function (event) {
	      _this.props.onOpen && _this.props.onOpen(event);
	    }, _this.toggleOpenState = function (event) {
	      var isOpen = _this.getControllableValue('isOpen');
	      if (isOpen) {
	        _this.close(event);
	      } else {
	        _this.open(event);
	      }
	    }, _this.isControlled = function (prop) {
	      return _this.props.hasOwnProperty(prop);
	    }, _this.getControllableValue = function (key) {
	      return _this.isControlled(key) ? _this.props[key] : _this.state[key];
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(CardFooter, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          children = _props.children,
	          expandable = _props.expandable,
	          title = _props.title,
	          _props$triggerTitle = _props.triggerTitle,
	          triggerTitle = _props$triggerTitle === undefined ? CardFooter.defaultProps.triggerTitle : _props$triggerTitle,
	          restProps = _objectWithoutProperties(_props, ['children', 'expandable', 'title', 'triggerTitle']);
	
	      var isOpen = Boolean(this.getControllableValue('isOpen'));
	
	      var ExpandCollapseIcon = isOpen ? _IconExpandLess2.default : _IconExpandMore2.default;
	
	      return _react2.default.createElement(
	        Root,
	        restProps,
	        title && _jsx(Title, {}, void 0, _jsx(TitleContent, {}, void 0, title), expandable && _jsx(ToggleButton, {
	          onClick: this.toggleOpenState,
	          minimal: true,
	          iconStart: _jsx(ExpandCollapseIcon, {
	            title: triggerTitle(isOpen)
	          })
	        })),
	        isOpen && children && _jsx(Content, {}, void 0, children)
	      );
	    }
	  }]);
	
	  return CardFooter;
	}(_react.Component);
	
	CardFooter.propTypes = {
	  /** Content of CardFooter */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** If `expandable`, expand CardFooter immediately upon initialization */
	  defaultIsOpen: __webpack_require__(82).bool,
	
	  /** Display a trigger to expand/collapse CardFooter contents (`title` is required for this feature)*/
	  expandable: __webpack_require__(82).bool,
	
	  /** For use with controlled components, in which the app manages CardFooter state */
	  isOpen: __webpack_require__(82).bool,
	
	  /** If `expandable`, called when CardFooter is collapsed */
	  onClose: __webpack_require__(82).func,
	
	  /** If `expandable`, called when CardFooter is expanded */
	  onOpen: __webpack_require__(82).func,
	
	  /** Title of the footer */
	  title: __webpack_require__(82).oneOfType([__webpack_require__(82).string, typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any]),
	
	  /** If `expandable`, title for expand/collapse trigger */
	  triggerTitle: __webpack_require__(82).func,
	
	  /** Available variants */
	  variant: __webpack_require__(82).oneOf(['danger', 'success', 'warning'])
	};
	CardFooter.defaultProps = {
	  triggerTitle: function triggerTitle(isOpen) {
	    return isOpen ? 'Collapse contents' : 'Expand contents';
	  }
	};
	exports.default = CardFooter;

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconExpandLess;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconExpandLess(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconExpandLess.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconExpandLess.category = 'navigation';

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconExpandMore;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconExpandMore(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconExpandMore.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconExpandMore.category = 'navigation';

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = CardImage;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _Card = __webpack_require__(318);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Root = (0, _styles.createStyledComponent)('img', function (props) {
	  var theme = (0, _Card.componentTheme)(props.theme);
	
	  return {
	    display: 'block',
	    marginBottom: theme.CardRow_marginVertical,
	    marginTop: theme.CardRow_marginVertical,
	    maxWidth: '100%',
	
	    '&:first-child': {
	      borderRadius: theme.Card_borderRadius + ' ' + theme.Card_borderRadius + ' 0 0',
	      marginTop: 0
	    },
	
	    '&:last-child': {
	      borderRadius: '0 0 ' + theme.Card_borderRadius + ' ' + theme.Card_borderRadius,
	      marginBottom: 0
	    }
	  };
	}, {
	  displayName: 'CardImage',
	  rootEl: 'img'
	});
	
	/**
	 * CardImage renders images full-bleed inside of a [Card](/components/card).
	 * Use CardImage to display static media.
	 */
	
	function CardImage(props) {
	  return _react2.default.createElement(Root, props);
	}

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = CardStatus;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _IconDangerSimple = __webpack_require__(328);
	
	var _IconDangerSimple2 = _interopRequireDefault(_IconDangerSimple);
	
	var _IconSuccessSimple = __webpack_require__(329);
	
	var _IconSuccessSimple2 = _interopRequireDefault(_IconSuccessSimple);
	
	var _IconWarningSimple = __webpack_require__(330);
	
	var _IconWarningSimple2 = _interopRequireDefault(_IconWarningSimple);
	
	var _CardRow = __webpack_require__(321);
	
	var _CardRow2 = _interopRequireDefault(_CardRow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    CardStatus_fontSize: baseTheme.fontSize_ui,
	    CardStatus_fontWeight: baseTheme.fontWeight_regular,
	
	    CardStatusIcon_margin: baseTheme.space_inline_sm,
	    CardStatusIcon_size: (0, _styles.pxToEm)(12)
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)(_CardRow2.default, function (_ref) {
	  var baseTheme = _ref.theme,
	      variant = _ref.variant;
	
	  var theme = componentTheme(baseTheme);
	  var rtl = theme.direction === 'rtl';
	
	  return {
	    alignItems: 'center',
	    color: theme['color_text_' + variant],
	    display: 'flex',
	    fontSize: theme.CardStatus_fontSize,
	    fontWeight: theme.CardStatus_fontWeight,
	
	    '& > [role="img"]': {
	      fill: 'currentcolor',
	      height: theme.CardStatusIcon_size,
	      marginRight: rtl ? null : theme.CardStatusIcon_margin,
	      marginLeft: rtl ? theme.CardStatusIcon_margin : null,
	      width: theme.CardStatusIcon_size
	    }
	  };
	}, {
	  displayName: 'CardStatus'
	});
	
	var statusIcons = {
	  danger: _jsx(_IconDangerSimple2.default, {}),
	  success: _jsx(_IconSuccessSimple2.default, {}),
	  warning: _jsx(_IconWarningSimple2.default, {})
	};
	
	/**
	 * CardStatus provides a standard way of displaying a [Card's](/components/card) current status.
	 */
	function CardStatus(_ref2) {
	  var children = _ref2.children,
	      variant = _ref2.variant,
	      restProps = _objectWithoutProperties(_ref2, ['children', 'variant']);
	
	  var rootProps = _extends({
	    variant: variant
	  }, restProps);
	  var icon = statusIcons[variant];
	
	  return _react2.default.createElement(
	    Root,
	    rootProps,
	    icon,
	    children
	  );
	}

/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconDangerSimple;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M3.94 20.49h16.118a1 1 0 0 0 .866-1.498l-8.06-13.99a.996.996 0 0 0-1.732-.001L3.074 18.993a.998.998 0 0 0 .867 1.499l-.001-.002z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconDangerSimple(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconDangerSimple.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconDangerSimple.category = 'alert';

/***/ }),
/* 329 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconSuccessSimple;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M12 3c4.968 0 9 4.032 9 9s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconSuccessSimple(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconSuccessSimple.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconSuccessSimple.category = 'alert';

/***/ }),
/* 330 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconWarningSimple;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M13.414 2.718l7.868 7.868c.78.78.78 2.047 0 2.828l-7.868 7.868c-.78.78-2.047.78-2.828 0l-7.868-7.868a2.001 2.001 0 0 1 0-2.828l7.868-7.868c.78-.78 2.047-.78 2.828 0z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconWarningSimple(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconWarningSimple.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconWarningSimple.category = 'alert';

/***/ }),
/* 331 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = CardTitle;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _IconDanger = __webpack_require__(332);
	
	var _IconDanger2 = _interopRequireDefault(_IconDanger);
	
	var _IconSuccess = __webpack_require__(333);
	
	var _IconSuccess2 = _interopRequireDefault(_IconSuccess);
	
	var _IconWarning = __webpack_require__(334);
	
	var _IconWarning2 = _interopRequireDefault(_IconWarning);
	
	var _CardRow = __webpack_require__(321);
	
	var _CardRow2 = _interopRequireDefault(_CardRow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    CardTitle_color: baseTheme.color_gray_80,
	    CardTitle_fontSize: baseTheme.fontSize_h4,
	    CardTitle_fontWeight: baseTheme.fontWeight_bold,
	
	    CardTitleAvatar_margin: baseTheme.space_inline_sm,
	    CardTitleAvatarSize: baseTheme.size_small,
	    CardTitleAvatarSize_large: baseTheme.size_large,
	
	    CardTitleIcon_margin: baseTheme.space_inline_sm,
	
	    CardTitleSecondaryText_fontSize: baseTheme.fontSize_mouse,
	    CardTitleSecondaryText_fontWeight: baseTheme.fontWeight_regular,
	
	    CardSubtitle_color: baseTheme.color_gray_80,
	    CardSubtitle_fontSize: baseTheme.fontSize_mouse,
	    CardSubtitle_fontWeight: baseTheme.fontWeight_regular,
	    CardSubtitle_marginTop: baseTheme.space_stack_sm
	
	  }, baseTheme);
	};
	
	var styles = {
	  avatar: function avatar(_ref) {
	    var subtitle = _ref.subtitle,
	        baseTheme = _ref.theme;
	
	    var theme = componentTheme(baseTheme);
	    var rtl = theme.direction === 'rtl';
	    var width = subtitle ? theme.CardTitleAvatarSize_large : theme.CardTitleAvatarSize;
	
	    return {
	      flex: '0 0 auto',
	      marginLeft: rtl ? theme.CardTitleAvatar_margin : null,
	      marginRight: rtl ? null : theme.CardTitleAvatar_margin,
	      width: width,
	
	      '&[class] > *': {
	        height: 'auto',
	        width: '100%'
	      }
	    };
	  },
	  inner: {
	    flex: '1 1 auto'
	  },
	  secondaryText: function secondaryText(props) {
	    var theme = componentTheme(props.theme);
	    var fontSize = theme.CardTitleSecondaryText_fontSize;
	
	    return _extends({
	      flex: '0 0 auto',
	      fontSize: fontSize,
	      fontWeight: theme.CardTitleSecondaryText_fontWeight,
	      transform: 'translateY(' + (0, _styles.getNormalizedValue)((0, _styles.pxToEm)(5), fontSize) + ')' }, {
	      display: 'inline-block',
	      maxWidth: '33%',
	      overflow: 'hidden',
	      textOverflow: 'ellipsis',
	      whiteSpace: 'nowrap',
	      wordWrap: 'normal'
	    });
	  },
	  root: {
	    display: 'flex'
	  },
	  subtitle: function subtitle(_ref2) {
	    var avatar = _ref2.avatar,
	        baseTheme = _ref2.theme;
	
	    var theme = componentTheme(baseTheme);
	    var fontSize = theme.CardSubtitle_fontSize;
	
	    return {
	      color: theme.CardSubtitle_color,
	      fontSize: fontSize,
	      fontWeight: theme.CardSubtitle_fontWeight,
	      margin: 0,
	      marginTop: avatar ? null : (0, _styles.getNormalizedValue)(theme.CardSubtitle_marginTop, fontSize)
	    };
	  },
	  title: function title(_ref3) {
	    var baseTheme = _ref3.theme,
	        variant = _ref3.variant;
	
	    var theme = componentTheme(baseTheme);
	    var rtl = theme.direction === 'rtl';
	
	    return {
	      alignItems: 'flex-start',
	      display: 'flex',
	
	      '& > [role="img"]': {
	        fill: variant ? theme['color_text_' + variant] : null,
	        marginLeft: rtl ? theme.CardTitleIcon_margin : null,
	        marginRight: rtl ? null : theme.CardTitleIcon_margin,
	        position: 'relative',
	        top: (0, _styles.pxToEm)(4) // optical alignment
	      }
	    };
	  },
	  titleContent: function titleContent(_ref4) {
	    var actions = _ref4.actions,
	        baseTheme = _ref4.theme;
	
	    var theme = componentTheme(baseTheme);
	    var rtl = theme.direction === 'rtl';
	    var fontSize = theme.CardTitle_fontSize;
	    var actionsMargin = (0, _styles.getNormalizedValue)(theme.CardTitleIcon_margin, fontSize);
	
	    return {
	      color: theme.CardTitle_color,
	      flex: '1 1 auto',
	      fontSize: fontSize,
	      fontWeight: theme.CardTitle_fontWeight,
	      margin: 0,
	      marginLeft: actions && rtl ? actionsMargin : null,
	      marginRight: actions && !rtl ? actionsMargin : null
	    };
	  }
	};
	
	var Root = (0, _styles.createStyledComponent)(_CardRow2.default, styles.root, {
	  displayName: 'CardTitle'
	});
	var Avatar = (0, _styles.createStyledComponent)('span', styles.avatar);
	var Inner = (0, _styles.createStyledComponent)('div', styles.inner);
	var SecondaryText = (0, _styles.createStyledComponent)('span', styles.secondaryText);
	var Subtitle = (0, _styles.createStyledComponent)('h4', styles.subtitle);
	var Title = (0, _styles.createStyledComponent)('div', styles.title);
	var TitleContent = (0, _styles.createStyledComponent)('h3', styles.titleContent);
	
	var variantIcons = {
	  danger: _jsx(_IconDanger2.default, {
	    size: 'medium'
	  }),
	  success: _jsx(_IconSuccess2.default, {
	    size: 'medium'
	  }),
	  warning: _jsx(_IconWarning2.default, {
	    size: 'medium'
	  })
	};
	
	/**
	 * CardTitle displays a Card title and an optional subtitle.
	 * You can put CardTitle in any order in relation to other root components of
	 * [Card](/components/card).
	 */
	function CardTitle(_ref5) {
	  var actions = _ref5.actions,
	      avatar = _ref5.avatar,
	      children = _ref5.children,
	      secondaryText = _ref5.secondaryText,
	      subtitle = _ref5.subtitle,
	      variant = _ref5.variant,
	      restProps = _objectWithoutProperties(_ref5, ['actions', 'avatar', 'children', 'secondaryText', 'subtitle', 'variant']);
	
	  var rootProps = _extends({}, restProps);
	
	  var secondaryComponent = actions ? _react.Children.map(actions, function (action, index) {
	    return (0, _react.cloneElement)(action, { key: index });
	  }) : secondaryText ? _jsx(SecondaryText, {}, void 0, secondaryText) : null;
	
	  return _react2.default.createElement(
	    Root,
	    rootProps,
	    avatar && _jsx(Avatar, {
	      subtitle: subtitle
	    }, void 0, avatar),
	    _jsx(Inner, {}, void 0, _jsx(Title, {
	      variant: variant
	    }, void 0, variant && variantIcons[variant], _jsx(TitleContent, {
	      actions: actions
	    }, void 0, children), secondaryComponent), subtitle && _jsx(Subtitle, {
	      avatar: avatar
	    }, void 0, subtitle))
	  );
	}

/***/ }),
/* 332 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconDanger;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M3.94 19.49h16.118a1 1 0 0 0 .866-1.498l-8.06-13.99a.996.996 0 0 0-1.732-.001L3.074 17.993a.998.998 0 0 0 .867 1.499zM12 17a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-3.503h-2v-5h2v5z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconDanger(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconDanger.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconDanger.category = 'alert';

/***/ }),
/* 333 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconSuccess;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M12 3c4.968 0 9 4.032 9 9s-4.032 9-9 9-9-4.032-9-9 4.032-9 9-9zm-4.247 8.445L6.5 12.698l3.838 3.838 7.198-7.198-1.253-1.254-5.945 5.945-2.585-2.585z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconSuccess(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconSuccess.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconSuccess.category = 'alert';

/***/ }),
/* 334 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconWarning;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M13.414 2.718l7.868 7.868c.78.78.78 2.047 0 2.828l-7.868 7.868c-.78.78-2.047.78-2.828 0l-7.868-7.868a2.001 2.001 0 0 1 0-2.828l7.868-7.868c.78-.78 2.047-.78 2.828 0zM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1-3.958V8h-2v5.042h2z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconWarning(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconWarning.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconWarning.category = 'alert';

/***/ }),
/* 335 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = CardTitleMenu;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _Button = __webpack_require__(46);
	
	var _Button2 = _interopRequireDefault(_Button);
	
	var _Dropdown = __webpack_require__(336);
	
	var _Dropdown2 = _interopRequireDefault(_Dropdown);
	
	var _IconMoreHoriz = __webpack_require__(349);
	
	var _IconMoreHoriz2 = _interopRequireDefault(_IconMoreHoriz);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var babelPluginFlowReactPropTypes_proptype_ItemGroups = __webpack_require__(342).babelPluginFlowReactPropTypes_proptype_ItemGroups || __webpack_require__(82).any;
	
	var babelPluginFlowReactPropTypes_proptype_Items = __webpack_require__(342).babelPluginFlowReactPropTypes_proptype_Items || __webpack_require__(82).any;
	
	/*
	 * A large Button, even with zero'd padding, is still a bit too large in this
	 * context. These styles allow the Button to shrink, but the Icon remains the
	 * same size.
	 */
	var MenuButton = (0, _styles.createStyledComponent)(_Button2.default, function (_ref) {
	  var theme = _ref.theme;
	  return {
	    height: 'auto',
	    minWidth: 0,
	    overflow: 'hidden',
	    padding: 0,
	
	    // Inner
	    '& > span': {
	      display: 'block',
	      margin: '-' + (0, _styles.pxToEm)(2)
	    },
	
	    '& [role="img"]': {
	      fill: theme.color_text
	    }
	  };
	});
	
	/**
	 * CardTitleMenu
	 */
	function CardTitleMenu(_ref2) {
	  var data = _ref2.data,
	      _ref2$triggerTitle = _ref2.triggerTitle,
	      triggerTitle = _ref2$triggerTitle === undefined ? 'Card actions' : _ref2$triggerTitle,
	      restProps = _objectWithoutProperties(_ref2, ['data', 'triggerTitle']);
	
	  var rootProps = _extends({
	    data: data,
	    placement: 'bottom-end'
	  }, restProps);
	  var buttonProps = {
	    iconStart: _jsx(_IconMoreHoriz2.default, {
	      title: triggerTitle
	    }),
	    minimal: true
	  };
	
	  return _react2.default.createElement(
	    _Dropdown2.default,
	    rootProps,
	    _react2.default.createElement(MenuButton, buttonProps)
	  );
	}

/***/ }),
/* 336 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Dropdown = __webpack_require__(337);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Dropdown).default;
	  }
	});
	
	var _DropdownContent = __webpack_require__(340);
	
	Object.defineProperty(exports, 'DropdownContent', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_DropdownContent).default;
	  }
	});
	
	var _PopoverTrigger = __webpack_require__(288);
	
	Object.defineProperty(exports, 'DropdownTrigger', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_PopoverTrigger).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 337 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(135);
	
	var _scrollIntoViewIfNeeded = __webpack_require__(338);
	
	var _scrollIntoViewIfNeeded2 = _interopRequireDefault(_scrollIntoViewIfNeeded);
	
	var _fastDeepEqual = __webpack_require__(339);
	
	var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);
	
	var _utils = __webpack_require__(92);
	
	var _Popover = __webpack_require__(133);
	
	var _Popover2 = _interopRequireDefault(_Popover);
	
	var _DropdownContent = __webpack_require__(340);
	
	var _DropdownContent2 = _interopRequireDefault(_DropdownContent);
	
	var _ItemMatcher = __webpack_require__(348);
	
	var _ItemMatcher2 = _interopRequireDefault(_ItemMatcher);
	
	var _Menu = __webpack_require__(342);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var babelPluginFlowReactPropTypes_proptype_ItemGroups = __webpack_require__(342).babelPluginFlowReactPropTypes_proptype_ItemGroups || __webpack_require__(82).any;
	
	var babelPluginFlowReactPropTypes_proptype_Items = __webpack_require__(342).babelPluginFlowReactPropTypes_proptype_Items || __webpack_require__(82).any;
	
	var babelPluginFlowReactPropTypes_proptype_Item = __webpack_require__(343).babelPluginFlowReactPropTypes_proptype_Item || __webpack_require__(82).any;
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({}, (0, _DropdownContent.componentTheme)(baseTheme), baseTheme);
	};
	
	/**
	 * Dropdown presents a list of actions after a user interacts with a trigger.
	 */
	
	var Dropdown = function (_Component) {
	  _inherits(Dropdown, _Component);
	
	  function Dropdown() {
	    var _ref;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Dropdown);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      highlightedIndex: _this.props.defaultHighlightedIndex,
	      isOpen: Boolean(_this.props.defaultIsOpen)
	    }, _this.id = _this.props.id || 'dropdown-' + (0, _utils.generateId)(), _this.items = (0, _Menu.getItems)(_this.props.data), _this.getContentId = function () {
	      return _this.id + '-content';
	    }, _this.getMenuId = function () {
	      return _this.id + '-menu';
	    }, _this.getMenuItemId = function (index) {
	      return _this.id + '-item-' + index;
	    }, _this.getTriggerProps = function () {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      var contentId = _this.getContentId();
	      var isOpen = _this.getControllableValue('isOpen');
	
	      return (0, _utils.composePropsWithGetter)(_extends({}, props, {
	
	        // Props set by this component
	        'aria-activedescendant': isOpen ? _this.getHighlightedItemId() || _this.getMenuId() : undefined,
	        'aria-describedby': contentId,
	        'aria-haspopup': true,
	        'aria-owns': contentId,
	        onKeyDown: _this.onTriggerKeyDown,
	        onKeyUp: function onKeyUp(event) {
	          // Prevent Firefox from triggering Popover's onClick handler when
	          // space key is used to activate trigger.
	          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=501496
	          event.key === ' ' && event.preventDefault();
	        }
	      }),
	      // Custom prop getter can override all values
	      _this.props.getTriggerProps);
	    }, _this.getMenuProps = function () {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	      return (0, _utils.composePropsWithGetter)(_extends({}, props, {
	
	        // Props set by this component
	        id: _this.getMenuId(),
	        role: 'menu'
	      }),
	      // Custom prop getter can override all values
	      _this.props.getMenuProps);
	    }, _this.getItemProps = function () {
	      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var scope = arguments[1];
	      var index = scope.index,
	          item = scope.item;
	
	      var highlightedIndex = _this.getControllableValue('highlightedIndex');
	
	      return (0, _utils.composePropsWithGetter)(_extends({}, props, {
	
	        // Props set by this component
	        'aria-disabled': props.disabled,
	        id: _this.getMenuItemId(index),
	        isHighlighted: highlightedIndex === index,
	        onClick: _this.onItemClick.bind(null, item),
	        role: 'menuitem',
	        tabIndex: null // Unset tabIndex because we use arrow keys to navigate instead
	      }),
	      // Custom prop getter can override all values
	      _this.props.getItemProps, scope);
	    }, _this.getHighlightedItemId = function () {
	      var highlightedIndex = _this.getControllableValue('highlightedIndex');
	      return highlightedIndex !== undefined && highlightedIndex !== null ? _this.getMenuItemId(highlightedIndex) : undefined;
	    }, _this.hasHighlightedIndex = function () {
	      return _this.getControllableValue('highlightedIndex') != undefined;
	    }, _this.onTriggerKeyDown = function (event) {
	      var key = event.key;
	
	      var isOpen = _this.getControllableValue('isOpen');
	
	      if (key === 'ArrowUp') {
	        event.preventDefault();
	        _this.highlightPreviousItem();
	        !isOpen && _this.open(event);
	      } else if (key === 'ArrowDown') {
	        event.preventDefault();
	        _this.highlightNextItem();
	        !isOpen && _this.open(event);
	      } else if (key === 'Home' && isOpen) {
	        event.preventDefault();
	        _this.highlightItemAtIndex(0);
	      } else if (key === 'End' && isOpen) {
	        event.preventDefault();
	        _this.highlightItemAtIndex(_this.items.length - 1);
	      } else if (key === 'Enter' || key === ' ') {
	        event.preventDefault();
	        isOpen ? _this.hasHighlightedIndex() ? _this.clickHighlightedItem() : _this.close(event) : _this.open(event);
	      } else if (isOpen) {
	        _this.highlightItemMatchingKey(key);
	      }
	    }, _this.findItemMatchingKey = function (key) {
	      _this.itemMatcher = _this.itemMatcher || new _ItemMatcher2.default();
	      return _this.itemMatcher.findMatchingItem(_this.items, _this.getControllableValue('highlightedIndex'), key);
	    }, _this.highlightItemMatchingKey = function (key) {
	      var matchingItem = _this.findItemMatchingKey(key);
	      matchingItem && _this.highlightItemAtIndex(_this.items.indexOf(matchingItem));
	    }, _this.highlightItemAtIndex = function (index) {
	      if (!_this.isControlled('highlightedIndex')) {
	        _this.setState({ highlightedIndex: index }, _this.scrollHighlightedItemIntoViewIfNeeded);
	      }
	    }, _this.highlightNextItem = function () {
	      if (!_this.isControlled('highlightedIndex')) {
	        _this.setState(function (prevState) {
	          return {
	            highlightedIndex: prevState.highlightedIndex === null || prevState.highlightedIndex === undefined || prevState.highlightedIndex === _this.items.length - 1 ? 0 : prevState.highlightedIndex + 1
	          };
	        }, _this.scrollHighlightedItemIntoViewIfNeeded);
	      }
	    }, _this.highlightPreviousItem = function () {
	      if (!_this.isControlled('highlightedIndex')) {
	        _this.setState(function (prevState) {
	          return {
	            highlightedIndex: !prevState.highlightedIndex ? _this.items.length - 1 : prevState.highlightedIndex - 1
	          };
	        }, _this.scrollHighlightedItemIntoViewIfNeeded);
	      }
	    }, _this.scrollHighlightedItemIntoViewIfNeeded = function () {
	      var highlightedItemNode = global.document.getElementById(_this.getHighlightedItemId());
	      var boundary = (0, _reactDom.findDOMNode)(_this); // eslint-disable-line react/no-find-dom-node
	
	      if (highlightedItemNode && boundary) {
	        (0, _scrollIntoViewIfNeeded2.default)(highlightedItemNode, { boundary: boundary });
	      }
	    }, _this.clickHighlightedItem = function () {
	      var highlightedItemNode = global.document.getElementById(_this.getHighlightedItemId());
	      highlightedItemNode && highlightedItemNode.click();
	    }, _this.open = function (event) {
	      if (_this.isControlled('isOpen')) {
	        _this.openActions(event);
	      } else {
	        _this.setState(function () {
	          return { isOpen: true };
	        }, function () {
	          _this.openActions(event);
	        });
	      }
	    }, _this.openActions = function (event) {
	      _this.scrollHighlightedItemIntoViewIfNeeded();
	      _this.props.onOpen && _this.props.onOpen(event);
	    }, _this.close = function (event) {
	      if (!_this.isControlled('highlightedIndex')) {
	        _this.setState({ highlightedIndex: null });
	      }
	
	      if (_this.isControlled('isOpen')) {
	        _this.closeActions(event);
	      } else {
	        _this.setState(function () {
	          return { isOpen: false };
	        }, function () {
	          _this.closeActions(event);
	        });
	      }
	    }, _this.closeActions = function (event) {
	      _this.props.onClose && _this.props.onClose(event);
	    }, _this.onItemClick = function (item, event) {
	      var onClick = item.onClick;
	
	
	      onClick && onClick(event);
	      _this.close(event);
	      _this.focusTrigger();
	    }, _this.focusTrigger = function () {
	      var node = (0, _reactDom.findDOMNode)(_this.dropdownTrigger); // eslint-disable-line react/no-find-dom-node
	      if (node && node.firstChild && node.firstChild instanceof HTMLElement) {
	        node.firstChild.focus();
	      }
	    }, _this.isControlled = function (prop) {
	      return _this.props.hasOwnProperty(prop);
	    }, _this.getControllableValue = function (key) {
	      return _this.isControlled(key) ? _this.props[key] : _this.state[key];
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(Dropdown, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (!(0, _fastDeepEqual2.default)(this.props.data, nextProps.data)) {
	        this.items = (0, _Menu.getItems)(nextProps.data);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _props = this.props,
	          children = _props.children,
	          data = _props.data,
	          modifiers = _props.modifiers,
	          placement = _props.placement,
	          wide = _props.wide,
	          restProps = _objectWithoutProperties(_props, ['children', 'data', 'modifiers', 'placement', 'wide']);
	
	      var isOpen = this.getControllableValue('isOpen');
	
	      var dropdownContentProps = {
	        data: data,
	        id: this.getContentId(),
	        getItemProps: this.getItemProps,
	        getMenuProps: this.getMenuProps,
	        modifiers: modifiers,
	        placement: placement,
	        wide: wide
	      };
	
	      var rootProps = _extends({
	        id: this.id
	      }, restProps, {
	        content: _react2.default.createElement(_DropdownContent2.default, dropdownContentProps),
	        getTriggerProps: this.getTriggerProps,
	        isOpen: isOpen,
	        onClose: this.close,
	        onOpen: this.open,
	        triggerRef: function triggerRef(node) {
	          _this2.dropdownTrigger = node;
	        },
	        wrapContent: false
	      });
	
	      return _react2.default.createElement(
	        _Popover2.default,
	        rootProps,
	        children
	      );
	    }
	  }]);
	
	  return Dropdown;
	}(_react.Component);
	
	Dropdown.propTypes = {
	  /** Trigger for the Dropdown */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node).isRequired : __webpack_require__(82).any.isRequired,
	
	  /**
	   * Open the Dropdown upon initialization. Primarily for use with uncontrolled
	   * components.
	   */
	  defaultIsOpen: __webpack_require__(82).bool,
	
	  /**
	   * Index of item to be highlighted upon initialization. Primarily for
	   * use with uncontrolled components.
	   */
	  defaultHighlightedIndex: __webpack_require__(82).number,
	
	  /** Disable the Dropdown */
	  disabled: __webpack_require__(82).bool,
	
	  /**
	   * Data from which the [Menu](/components/menu#data) will be constructed
	   * (see [example](#data))
	   */
	  data: __webpack_require__(82).oneOfType([typeof babelPluginFlowReactPropTypes_proptype_Items === 'function' ? babelPluginFlowReactPropTypes_proptype_Items : __webpack_require__(82).shape(babelPluginFlowReactPropTypes_proptype_Items), typeof babelPluginFlowReactPropTypes_proptype_ItemGroups === 'function' ? babelPluginFlowReactPropTypes_proptype_ItemGroups : __webpack_require__(82).shape(babelPluginFlowReactPropTypes_proptype_ItemGroups)]).isRequired,
	
	  /** @Private Function that returns props to be applied to each item */
	  getItemProps: __webpack_require__(82).func,
	
	  /** @Private Function that returns props to be applied to the menu */
	  getMenuProps: __webpack_require__(82).func,
	
	  /** @Private Function that returns props to be applied to the trigger */
	  getTriggerProps: __webpack_require__(82).func,
	
	  /** Index of the highlighted item. For use with controlled components. */
	  highlightedIndex: __webpack_require__(82).number,
	
	  /** Id of the Dropdown */
	  id: __webpack_require__(82).string,
	
	  /** Determines whether the Dropdown is open. For use with controlled components. */
	  isOpen: __webpack_require__(82).bool,
	
	  /**
	   * Plugins that are used to alter behavior. See
	   * [PopperJS docs](https://popper.js.org/popper-documentation.html#modifiers)
	   * for options.
	   */
	  modifiers: __webpack_require__(82).object,
	
	  /** Called when Dropdown is closed */
	  onClose: __webpack_require__(82).func,
	
	  /** Called when Dropdown is opened */
	  onOpen: __webpack_require__(82).func,
	
	  /** Placement of the Dropdown menu */
	  placement: __webpack_require__(82).oneOf(['bottom-end', 'bottom-start', 'left-end', 'left-start', 'right-end', 'right-start', 'top-end', 'top-start']),
	
	  /**
	   * Use a Portal to render the Dropdown menu to the body rather than as a sibling
	   * to the trigger
	   */
	  usePortal: __webpack_require__(82).bool,
	
	  /** Display a wider Dropdown menu */
	  wide: __webpack_require__(82).bool
	};
	Dropdown.defaultProps = {
	  placement: 'bottom-start'
	};
	exports.default = Dropdown;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 338 */
/***/ (function(module, exports, __webpack_require__) {

	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.scrollIntoViewIfNeeded = factory());
	}(this, (function () { 'use strict';
	
	/**
	 * https://github.com/gre/bezier-easing
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
	 */
	
	// These values are established by empiricism with tests (tradeoff: performance VS precision)
	var NEWTON_ITERATIONS = 4;
	var NEWTON_MIN_SLOPE = 0.001;
	var SUBDIVISION_PRECISION = 0.0000001;
	var SUBDIVISION_MAX_ITERATIONS = 10;
	
	var kSplineTableSize = 11;
	var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
	
	var float32ArraySupported = typeof Float32Array === 'function';
	
	function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	function C (aA1)      { return 3.0 * aA1; }
	
	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
	
	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
	
	function binarySubdivide (aX, aA, aB, mX1, mX2) {
	  var currentX, currentT, i = 0;
	  do {
	    currentT = aA + (aB - aA) / 2.0;
	    currentX = calcBezier(currentT, mX1, mX2) - aX;
	    if (currentX > 0.0) {
	      aB = currentT;
	    } else {
	      aA = currentT;
	    }
	  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	  return currentT;
	}
	
	function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
	 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	   var currentSlope = getSlope(aGuessT, mX1, mX2);
	   if (currentSlope === 0.0) {
	     return aGuessT;
	   }
	   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	   aGuessT -= currentX / currentSlope;
	 }
	 return aGuessT;
	}
	
	var src = function bezier (mX1, mY1, mX2, mY2) {
	  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
	    throw new Error('bezier x values must be in [0, 1] range');
	  }
	
	  // Precompute samples table
	  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	  if (mX1 !== mY1 || mX2 !== mY2) {
	    for (var i = 0; i < kSplineTableSize; ++i) {
	      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	    }
	  }
	
	  function getTForX (aX) {
	    var intervalStart = 0.0;
	    var currentSample = 1;
	    var lastSample = kSplineTableSize - 1;
	
	    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	      intervalStart += kSampleStepSize;
	    }
	    --currentSample;
	
	    // Interpolate to provide an initial guess for t
	    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	    var guessForT = intervalStart + dist * kSampleStepSize;
	
	    var initialSlope = getSlope(guessForT, mX1, mX2);
	    if (initialSlope >= NEWTON_MIN_SLOPE) {
	      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	    } else if (initialSlope === 0.0) {
	      return guessForT;
	    } else {
	      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	    }
	  }
	
	  return function BezierEasing (x) {
	    if (mX1 === mY1 && mX2 === mY2) {
	      return x; // linear
	    }
	    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	    if (x === 0) {
	      return 0;
	    }
	    if (x === 1) {
	      return 1;
	    }
	    return calcBezier(getTForX(x), mY1, mY2);
	  };
	};
	
	// Predefined set of animations. Similar to CSS easing functions
	var animations = {
	  ease:  src(0.25, 0.1, 0.25, 1),
	  easeIn: src(0.42, 0, 1, 1),
	  easeOut: src(0, 0, 0.58, 1),
	  easeInOut: src(0.42, 0, 0.58, 1),
	  linear: src(0, 0, 1, 1)
	};
	
	
	var amator = animate;
	
	function animate(source, target, options) {
	  var start= Object.create(null);
	  var diff = Object.create(null);
	  options = options || {};
	  // We let clients specify their own easing function
	  var easing = (typeof options.easing === 'function') ? options.easing : animations[options.easing];
	
	  // if nothing is specified, default to ease (similar to CSS animations)
	  if (!easing) {
	    if (options.easing) {
	      console.warn('Unknown easing function in amator: ' + options.easing);
	    }
	    easing = animations.ease;
	  }
	
	  var step = typeof options.step === 'function' ? options.step : noop;
	  var done = typeof options.done === 'function' ? options.done : noop;
	
	  var scheduler = getScheduler(options.scheduler);
	
	  var keys = Object.keys(target);
	  keys.forEach(function(key) {
	    start[key] = source[key];
	    diff[key] = target[key] - source[key];
	  });
	
	  var durationInMs = options.duration || 400;
	  var durationInFrames = Math.max(1, durationInMs * 0.06); // 0.06 because 60 frames pers 1,000 ms
	  var previousAnimationId;
	  var frame = 0;
	
	  previousAnimationId = scheduler.next(loop);
	
	  return {
	    cancel: cancel
	  }
	
	  function cancel() {
	    scheduler.cancel(previousAnimationId);
	    previousAnimationId = 0;
	  }
	
	  function loop() {
	    var t = easing(frame/durationInFrames);
	    frame += 1;
	    setValues(t);
	    if (frame <= durationInFrames) {
	      previousAnimationId = scheduler.next(loop);
	      step(source);
	    } else {
	      previousAnimationId = 0;
	      setTimeout(function() { done(source); }, 0);
	    }
	  }
	
	  function setValues(t) {
	    keys.forEach(function(key) {
	      source[key] = diff[key] * t + start[key];
	    });
	  }
	}
	
	function noop() { }
	
	function getScheduler(scheduler) {
	  if (!scheduler) {
	    var canRaf = typeof window !== 'undefined' && window.requestAnimationFrame;
	    return canRaf ? rafScheduler() : timeoutScheduler()
	  }
	  if (typeof scheduler.next !== 'function') throw new Error('Scheduler is supposed to have next(cb) function')
	  if (typeof scheduler.cancel !== 'function') throw new Error('Scheduler is supposed to have cancel(handle) function')
	
	  return scheduler
	}
	
	function rafScheduler() {
	  return {
	    next: window.requestAnimationFrame.bind(window),
	    cancel: window.cancelAnimationFrame.bind(window)
	  }
	}
	
	function timeoutScheduler() {
	  return {
	    next: function(cb) {
	      return setTimeout(cb, 1000/60)
	    },
	    cancel: function (id) {
	      return clearTimeout(id)
	    }
	  }
	}
	
	var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var handleScroll$1 = function (parent, _a) {
	    var scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
	    parent.scrollLeft = scrollLeft;
	    parent.scrollTop = scrollTop;
	};
	function calculate(target, options) {
	    if (!target || !(target instanceof HTMLElement))
	        throw new Error('Element is required in scrollIntoViewIfNeeded');
	    var config = __assign$1({ handleScroll: handleScroll$1 }, options);
	    var defaultOffset = { top: 0, right: 0, bottom: 0, left: 0 };
	    config.offset = config.offset
	        ? __assign$1({}, defaultOffset, config.offset) : defaultOffset;
	    function withinBounds(value, min, max, extent) {
	        if (config.centerIfNeeded === false ||
	            (max <= value + extent && value <= min + extent)) {
	            return Math.min(max, Math.max(min, value));
	        }
	        else {
	            return (min + max) / 2;
	        }
	    }
	    var offset = config.offset;
	    var offsetTop = offset.top;
	    var offsetLeft = offset.left;
	    var offsetBottom = offset.bottom;
	    var offsetRight = offset.right;
	    function makeArea(left, top, width, height) {
	        return {
	            left: left + offsetLeft,
	            top: top + offsetTop,
	            width: width,
	            height: height,
	            right: left + offsetLeft + width + offsetRight,
	            bottom: top + offsetTop + height + offsetBottom,
	            translate: function (x, y) {
	                return makeArea(x + left + offsetLeft, y + top + offsetTop, width, height);
	            },
	            relativeFromTo: function (lhs, rhs) {
	                var newLeft = left + offsetLeft, newTop = top + offsetTop;
	                lhs = lhs.offsetParent;
	                rhs = rhs.offsetParent;
	                if (lhs === rhs) {
	                    return area;
	                }
	                for (; lhs; lhs = lhs.offsetParent) {
	                    newLeft += lhs.offsetLeft + lhs.clientLeft;
	                    newTop += lhs.offsetTop + lhs.clientTop;
	                }
	                for (; rhs; rhs = rhs.offsetParent) {
	                    newLeft -= rhs.offsetLeft + rhs.clientLeft;
	                    newTop -= rhs.offsetTop + rhs.clientTop;
	                }
	                return makeArea(newLeft, newTop, width, height);
	            },
	        };
	    }
	    var parent, area = makeArea(target.offsetLeft, target.offsetTop, target.offsetWidth, target.offsetHeight);
	    while ((parent = target.parentNode) instanceof HTMLElement &&
	        target !== config.boundary) {
	        var clientLeft = parent.offsetLeft + parent.clientLeft;
	        var clientTop = parent.offsetTop + parent.clientTop;
	        // Make area relative to parent's client area.
	        area = area
	            .relativeFromTo(target, parent)
	            .translate(-clientLeft, -clientTop);
	        var scrollLeft = withinBounds(parent.scrollLeft, area.right - parent.clientWidth, area.left, parent.clientWidth);
	        var scrollTop = withinBounds(parent.scrollTop, area.bottom - parent.clientHeight, area.top, parent.clientHeight);
	        // Pass the new coordinates to the handleScroll callback
	        config.handleScroll(parent, { scrollLeft: scrollLeft, scrollTop: scrollTop }, config);
	        // Determine actual scroll amount by reading back scroll properties.
	        area = area.translate(clientLeft - parent.scrollLeft, clientTop - parent.scrollTop);
	        target = parent;
	    }
	}
	
	var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var handleScroll = function (parent, _a, config) {
	    var scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
	    if (config.duration) {
	        amator(parent, {
	            scrollLeft: scrollLeft,
	            scrollTop: scrollTop,
	        }, { duration: config.duration, easing: config.easing });
	    }
	    else {
	        parent.scrollLeft = scrollLeft;
	        parent.scrollTop = scrollTop;
	    }
	};
	function isBoolean(options) {
	    return typeof options === 'boolean';
	}
	function scrollIntoViewIfNeeded(target, options, animateOptions, finalElement, offsetOptions) {
	    if (offsetOptions === void 0) { offsetOptions = {}; }
	    if (!target || !(target instanceof HTMLElement))
	        throw new Error('Element is required in scrollIntoViewIfNeeded');
	    var config = { centerIfNeeded: false, handleScroll: handleScroll };
	    if (isBoolean(options)) {
	        config.centerIfNeeded = options;
	    }
	    else {
	        config = __assign({}, config, options);
	    }
	    var defaultOffset = { top: 0, right: 0, bottom: 0, left: 0 };
	    config.offset = config.offset
	        ? __assign({}, defaultOffset, config.offset) : defaultOffset;
	    if (animateOptions) {
	        config.duration = animateOptions.duration;
	        config.easing = animateOptions.easing;
	    }
	    if (finalElement) {
	        config.boundary = finalElement;
	    }
	    if (offsetOptions.offsetTop) {
	        config.offset.top = offsetOptions.offsetTop;
	    }
	    if (offsetOptions.offsetRight) {
	        config.offset.right = offsetOptions.offsetRight;
	    }
	    if (offsetOptions.offsetBottom) {
	        config.offset.bottom = offsetOptions.offsetBottom;
	    }
	    if (offsetOptions.offsetLeft) {
	        config.offset.left = offsetOptions.offsetLeft;
	    }
	    return calculate(target, config);
	}
	
	return scrollIntoViewIfNeeded;
	
	})));


/***/ }),
/* 339 */
/***/ (function(module, exports) {

	'use strict';
	
	var isArray = Array.isArray;
	var keyList = Object.keys;
	var hasProp = Object.prototype.hasOwnProperty;
	
	module.exports = function equal(a, b) {
	  if (a === b) return true;
	
	  var arrA = isArray(a)
	    , arrB = isArray(b)
	    , i
	    , length
	    , key;
	
	  if (arrA && arrB) {
	    length = a.length;
	    if (length != b.length) return false;
	    for (i = 0; i < length; i++)
	      if (!equal(a[i], b[i])) return false;
	    return true;
	  }
	
	  if (arrA != arrB) return false;
	
	  var dateA = a instanceof Date
	    , dateB = b instanceof Date;
	  if (dateA != dateB) return false;
	  if (dateA && dateB) return a.getTime() == b.getTime();
	
	  var regexpA = a instanceof RegExp
	    , regexpB = b instanceof RegExp;
	  if (regexpA != regexpB) return false;
	  if (regexpA && regexpB) return a.toString() == b.toString();
	
	  if (a instanceof Object && b instanceof Object) {
	    var keys = keyList(a);
	    length = keys.length;
	
	    if (length !== keyList(b).length)
	      return false;
	
	    for (i = 0; i < length; i++)
	      if (!hasProp.call(b, keys[i])) return false;
	
	    for (i = 0; i < length; i++) {
	      key = keys[i];
	      if (!equal(a[key], b[key])) return false;
	    }
	
	    return true;
	  }
	
	  return false;
	};


/***/ }),
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utils = __webpack_require__(92);
	
	var _styles = __webpack_require__(48);
	
	var _Menu = __webpack_require__(341);
	
	var _Menu2 = _interopRequireDefault(_Menu);
	
	var _RtlPopper = __webpack_require__(347);
	
	var _RtlPopper2 = _interopRequireDefault(_RtlPopper);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    DropdownContent_backgroundColor: baseTheme.color_white,
	    DropdownContent_borderColor: baseTheme.color_gray_20,
	    DropdownContent_borderRadius: baseTheme.borderRadius_1,
	    DropdownContent_boxShadow: baseTheme.shadow_2,
	    DropdownContent_margin: '5px',
	    DropdownContent_zIndex: baseTheme.zIndex_100
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)(_RtlPopper2.default, function (_ref) {
	  var baseTheme = _ref.theme,
	      wide = _ref.wide;
	
	  var theme = componentTheme(baseTheme);
	
	  return {
	    backgroundColor: theme.DropdownContent_backgroundColor,
	    border: '1px solid ' + theme.DropdownContent_borderColor,
	    borderRadius: theme.DropdownContent_borderRadius,
	    boxShadow: theme.DropdownContent_boxShadow,
	    maxHeight: (0, _styles.pxToEm)(368),
	    overflowY: 'auto',
	    userSelect: 'none',
	    width: wide ? (0, _styles.pxToEm)(344) : (0, _styles.pxToEm)(224),
	    zIndex: theme.DropdownContent_zIndex,
	
	    '&[data-placement^="top"]': {
	      marginBottom: theme.DropdownContent_margin
	    },
	    '&[data-placement^="bottom"]': {
	      marginTop: theme.DropdownContent_margin
	    },
	    '&[data-placement^="left"]': {
	      marginRight: theme.DropdownContent_margin
	    },
	    '&[data-placement^="right"]': {
	      marginLeft: theme.DropdownContent_margin
	    },
	    '&[data-x-out-of-boundaries]': {
	      visibility: 'hidden'
	    }
	  };
	}, {
	  displayName: 'DropdownContent',
	  includeStyleReset: true,
	  filterProps: ['wide']
	});
	
	/**
	 * DropdownContent component
	 */
	
	var DropdownContent = function (_Component) {
	  _inherits(DropdownContent, _Component);
	
	  function DropdownContent() {
	    _classCallCheck(this, DropdownContent);
	
	    return _possibleConstructorReturn(this, (DropdownContent.__proto__ || Object.getPrototypeOf(DropdownContent)).apply(this, arguments));
	  }
	
	  _createClass(DropdownContent, [{
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          data = _props.data,
	          getItemProps = _props.getItemProps,
	          getMenuProps = _props.getMenuProps,
	          id = _props.id,
	          placement = _props.placement,
	          wide = _props.wide,
	          restProps = _objectWithoutProperties(_props, ['data', 'getItemProps', 'getMenuProps', 'id', 'placement', 'wide']);
	
	      var rootProps = _extends({
	        id: id,
	        placement: placement,
	        wide: wide
	      }, restProps);
	
	      var menuProps = (0, _utils.composePropsWithGetter)({
	        // Props set by this component
	        id: id + '-menu',
	        data: data,
	        getItemProps: getItemProps
	      },
	      // Custom prop getter can override all values
	      getMenuProps);
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        function (_ref2) {
	          var popperProps = _ref2.popperProps,
	              restProps = _ref2.restProps;
	
	          var wrapperProps = _extends({}, popperProps, restProps);
	
	          return _react2.default.createElement(
	            'div',
	            wrapperProps,
	            _react2.default.createElement(_Menu2.default, menuProps)
	          );
	        }
	      );
	    }
	  }]);
	
	  return DropdownContent;
	}(_react.Component);
	
	DropdownContent.propTypes = {
	  /** @Private Function that returns props to be applied to each item */
	  getItemProps: __webpack_require__(82).func,
	
	  /** @Private Function that returns props to be applied to the menu */
	  getMenuProps: __webpack_require__(82).func,
	
	  /** Data from which the [Menu](/components/menu#data) will be constructed */
	  data: __webpack_require__(82).arrayOf(__webpack_require__(82).object).isRequired,
	
	  /** Id of the Dropdown content */
	  id: __webpack_require__(82).string.isRequired,
	
	  /** Plugins that are used to alter behavior. See https://popper.js.org/popper-documentation.html#modifiers */
	  modifiers: __webpack_require__(82).object,
	
	  /** Placement of the dropdown */
	  placement: __webpack_require__(82).oneOf(['bottom-end', 'bottom-start', 'left-end', 'left-start', 'right-end', 'right-start', 'top-end', 'top-start']),
	
	  /** Display a wider dropdown menu */
	  wide: __webpack_require__(82).bool
	};
	exports.default = DropdownContent;

/***/ }),
/* 341 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Menu = __webpack_require__(342);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Menu).default;
	  }
	});
	
	var _MenuDivider = __webpack_require__(344);
	
	Object.defineProperty(exports, 'MenuDivider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_MenuDivider).default;
	  }
	});
	
	var _MenuGroup = __webpack_require__(345);
	
	Object.defineProperty(exports, 'MenuGroup', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_MenuGroup).default;
	  }
	});
	
	var _MenuGroupTitle = __webpack_require__(346);
	
	Object.defineProperty(exports, 'MenuGroupTitle', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_MenuGroupTitle).default;
	  }
	});
	
	var _MenuItem = __webpack_require__(343);
	
	Object.defineProperty(exports, 'MenuItem', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_MenuItem).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 342 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getItems = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = Menu;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _index = __webpack_require__(341);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var babelPluginFlowReactPropTypes_proptype_Item = __webpack_require__(343).babelPluginFlowReactPropTypes_proptype_Item || __webpack_require__(82).any;
	
	var babelPluginFlowReactPropTypes_proptype_ItemGroup = {
	  items: __webpack_require__(82).arrayOf(typeof babelPluginFlowReactPropTypes_proptype_Item === 'function' ? babelPluginFlowReactPropTypes_proptype_Item : __webpack_require__(82).shape(babelPluginFlowReactPropTypes_proptype_Item)).isRequired,
	  title: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any
	};
	if (true) Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ItemGroup', {
	  value: babelPluginFlowReactPropTypes_proptype_ItemGroup,
	  configurable: true
	});
	
	var babelPluginFlowReactPropTypes_proptype_Items = __webpack_require__(82).arrayOf(typeof babelPluginFlowReactPropTypes_proptype_Item === 'function' ? babelPluginFlowReactPropTypes_proptype_Item : __webpack_require__(82).shape(babelPluginFlowReactPropTypes_proptype_Item));
	
	if (true) Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Items', {
	  value: babelPluginFlowReactPropTypes_proptype_Items,
	  configurable: true
	});
	
	var babelPluginFlowReactPropTypes_proptype_ItemGroups = __webpack_require__(82).arrayOf(__webpack_require__(82).shape({
	  items: __webpack_require__(82).arrayOf(typeof babelPluginFlowReactPropTypes_proptype_Item === 'function' ? babelPluginFlowReactPropTypes_proptype_Item : __webpack_require__(82).shape(babelPluginFlowReactPropTypes_proptype_Item)).isRequired,
	  title: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any
	}));
	
	if (true) Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_ItemGroups', {
	  value: babelPluginFlowReactPropTypes_proptype_ItemGroups,
	  configurable: true
	});
	
	
	var Root = (0, _styles.createStyledComponent)('div', {}, {
	  displayName: 'Menu',
	  includeStyleReset: true
	});
	
	/**
	 * A Menu presents a list of options representing actions or navigation.
	 * Composed of [MenuItems](/components/menu-item), Menu is usually combined with [Popover](/components/popover) to create a [Dropdown](/components/dropdown).
	 *
	 * Menus are great for collecting actions in one place so your users don't need to scan the entire document to find a feature.
	 */
	function Menu(_ref) {
	  var children = _ref.children,
	      data = _ref.data,
	      getItemProps = _ref.getItemProps,
	      restProps = _objectWithoutProperties(_ref, ['children', 'data', 'getItemProps']);
	
	  var rootProps = _extends({}, restProps);
	
	  return _react2.default.createElement(
	    Root,
	    rootProps,
	    data ? renderFromData(data, getItemProps) : children
	  );
	}
	
	var isGroupedData = function isGroupedData(data) {
	  return data[0].hasOwnProperty('items');
	};
	
	var groupifyData = function groupifyData(data) {
	  return isGroupedData(data) ? data : [{ items: data }];
	};
	
	var getItems = exports.getItems = function getItems(data) {
	  // $FlowFixMe https://github.com/facebook/flow/issues/5885
	  var itemGroups = groupifyData(data);
	  return itemGroups.reduce(function (acc, group) {
	    return group.items && group.items.length ? acc.concat(group.items.filter(function (item) {
	      return !item.divider;
	    })) : acc;
	  }, []);
	};
	
	function renderFromData(data, getItemProps) {
	  // $FlowFixMe https://github.com/facebook/flow/issues/5885
	  var itemGroups = groupifyData(data);
	  return itemGroups.reduce(function (acc, group, groupIndex) {
	    acc.groups.push(renderMenuGroup(group, groupIndex, getItemProps, acc));
	    return acc;
	  }, { groups: [], itemIndex: 0 }).groups;
	}
	
	function renderMenuGroup(group, groupIndex, getItemProps, acc) {
	  return group.items && group.items.length ? _jsx(_index.MenuGroup, {
	    title: group.title
	  }, groupIndex, group.items.map(function (item, itemIndex) {
	    return renderMenuItem(item, itemIndex, getItemProps, acc);
	  })) : null;
	}
	
	renderMenuGroup.propTypes = babelPluginFlowReactPropTypes_proptype_ItemGroup;
	function renderMenuItem(item, itemIndex, getItemProps, acc) {
	  if (item.divider) {
	    return _jsx(_index.MenuDivider, {}, itemIndex);
	  } else {
	    var index = acc.itemIndex++; // Excludes MenuDividers
	
	    var text = item.text,
	        restItemProps = _objectWithoutProperties(item, ['text']);
	
	    var itemProps = getItemProps ? getItemProps(_extends({}, restItemProps, {
	      item: item
	    }), { index: index, item: item }) : _extends({}, restItemProps, {
	      item: item
	    });
	
	    return _react2.default.createElement(
	      _index.MenuItem,
	      _extends({ key: itemIndex }, itemProps),
	      text
	    );
	  }
	}

/***/ }),
/* 343 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = MenuItem;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _glamorous = __webpack_require__(50);
	
	var _styles = __webpack_require__(48);
	
	var _IconDanger = __webpack_require__(332);
	
	var _IconDanger2 = _interopRequireDefault(_IconDanger);
	
	var _IconSuccess = __webpack_require__(333);
	
	var _IconSuccess2 = _interopRequireDefault(_IconSuccess);
	
	var _IconWarning = __webpack_require__(334);
	
	var _IconWarning2 = _interopRequireDefault(_IconWarning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var babelPluginFlowReactPropTypes_proptype_Item = {
	  iconEnd: typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any,
	  iconStart: typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any,
	  disabled: __webpack_require__(82).bool,
	  divider: __webpack_require__(82).bool,
	  onClick: __webpack_require__(82).func,
	  render: __webpack_require__(82).func,
	  secondaryText: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	  text: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	  value: __webpack_require__(82).string,
	  variant: __webpack_require__(82).oneOf(['danger', 'success', 'warning'])
	};
	
	
	// Some of these values (all of the margins & paddings and the content fontSize)
	// come from Button (large)
	if (true) Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_Item', {
	  value: babelPluginFlowReactPropTypes_proptype_Item,
	  configurable: true
	});
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    MenuItem_backgroundColor_active: baseTheme.color_gray_20,
	    MenuItem_backgroundColor_focus: baseTheme.color_gray_10,
	    MenuItem_backgroundColor_hover: baseTheme.color_gray_10,
	    MenuItem_backgroundColor_selected: baseTheme.color_theme_10,
	    MenuItem_backgroundColor_selectedActive: baseTheme.color_theme_30,
	    MenuItem_backgroundColor_selectedHover: baseTheme.color_theme_20,
	    MenuItem_color_text: baseTheme.color_text,
	    MenuItem_fontWeight: baseTheme.fontWeight_regular,
	    MenuItem_fontWeight_selected: baseTheme.fontWeight_bold,
	    MenuItem_paddingHorizontal: baseTheme.space_inset_md,
	    MenuItem_paddingVertical: baseTheme.space_inset_sm,
	
	    MenuItemContent_fontSize: baseTheme.fontSize_ui,
	
	    MenuItemIcon_fill: baseTheme.color_theme_60,
	    MenuItemIcon_margin: baseTheme.space_inset_sm,
	
	    MenuItemSecondaryText_color_text: baseTheme.color_caption,
	    MenuItemSecondaryText_fontSize: (0, _styles.pxToEm)(12)
	
	  }, baseTheme);
	};
	
	// These styles are based off of Button, with significant changes
	var styles = {
	  content: function content(_ref) {
	    var baseTheme = _ref.theme;
	
	    var theme = componentTheme(baseTheme);
	
	    var fontSize = theme.MenuItemContent_fontSize;
	    var paddingBottom = (0, _styles.getNormalizedValue)((0, _styles.pxToEm)(4), fontSize);
	    var paddingTop = (0, _styles.getNormalizedValue)((0, _styles.pxToEm)(3), fontSize);
	
	    return {
	      display: 'flex',
	      flex: '1 1 auto',
	      flexWrap: 'wrap',
	      fontSize: fontSize,
	      justifyContent: 'space-between',
	      padding: paddingTop + ' 0 ' + paddingBottom,
	      whiteSpace: 'normal',
	      wordBreak: 'break-all'
	    };
	  },
	  inner: {
	    display: 'flex',
	    justifyContent: 'space-between'
	  },
	  menuItem: function menuItem(_ref2) {
	    var disabled = _ref2.disabled,
	        isHighlighted = _ref2.isHighlighted,
	        baseTheme = _ref2.theme,
	        variant = _ref2.variant;
	
	    var theme = componentTheme(baseTheme);
	
	    if (variant) {
	      // prettier-ignore
	      theme = _extends({}, theme, {
	        MenuItem_backgroundColor_active: theme['backgroundColor_' + variant + '_activeMuted'],
	        MenuItem_color_text: theme['color_text_' + variant]
	      });
	    }
	
	    return {
	      backgroundColor: isHighlighted && theme.MenuItem_backgroundColor_hover,
	      color: disabled ? theme.color_text_disabled : theme.MenuItem_color_text,
	      cursor: disabled ? 'default' : 'pointer',
	      fontWeight: theme.MenuItem_fontWeight,
	      padding: theme.MenuItem_paddingVertical + ' ' + theme.MenuItem_paddingHorizontal,
	
	      '&:focus': {
	        backgroundColor: !disabled && theme.MenuItem_backgroundColor_focus,
	        outline: 0
	      },
	
	      '&:hover': {
	        backgroundColor: !disabled && theme.MenuItem_backgroundColor_hover
	      },
	
	      '&:active': {
	        backgroundColor: !disabled && theme.MenuItem_backgroundColor_active
	      },
	
	      '[aria-selected="true"]': {
	        backgroundColor: isHighlighted ? theme.MenuItem_backgroundColor_selectedHover : theme.MenuItem_backgroundColor_selected,
	        fontWeight: theme.MenuItem_fontWeight_selected,
	
	        '&:active': {
	          backgroundColor: !disabled && theme.MenuItem_backgroundColor_selectedActive
	        }
	      },
	
	      '& [role="img"]': {
	        boxSizing: 'content-box',
	        display: 'block',
	        fill: disabled || variant ? 'currentColor' : theme.MenuItemIcon_fill,
	        flex: '0 0 auto',
	
	        '&:first-child': {
	          marginLeft: theme.direction === 'rtl' ? theme.MenuItemIcon_margin : null,
	          marginRight: theme.direction === 'ltr' ? theme.MenuItemIcon_margin : null
	        },
	
	        '&:last-child': {
	          marginLeft: theme.direction === 'ltr' ? theme.MenuItemIcon_margin : null,
	          marginRight: theme.direction === 'rtl' ? theme.MenuItemIcon_margin : null
	        }
	      }
	    };
	  },
	  secondaryText: function secondaryText(props) {
	    var theme = componentTheme(props.theme);
	
	    return {
	      color: theme.MenuItemSecondaryText_color_text,
	      fontSize: theme.MenuItemSecondaryText_fontSize,
	      // The regular text fontSize is larger than that of the secondary text.
	      // This magic number (optically) re-aligns both sets of text vertically.
	      paddingTop: (0, _styles.getNormalizedValue)((0, _styles.pxToEm)(3), theme.MenuItemSecondaryText_fontSize),
	      wordBreak: 'break-word'
	    };
	  },
	  text: function text(props) {
	    var theme = componentTheme(props.theme);
	
	    var margin = (0, _styles.getNormalizedValue)(theme.space_inline_sm, theme.MenuItemContent_fontSize);
	
	    return {
	      marginLeft: theme.direction === 'rtl' && margin,
	      marginRight: theme.direction === 'ltr' && margin,
	      wordBreak: 'break-word'
	    };
	  }
	};
	
	var Root = (0, _styles.createStyledComponent)('div', styles.menuItem, {
	  displayName: 'MenuItem'
	});
	
	var CustomRoot = (0, _glamorous.withTheme)(function (_ref3) {
	  var item = _ref3.item,
	      itemProps = _ref3.itemProps,
	      render = _ref3.render,
	      baseTheme = _ref3.theme;
	
	  var theme = componentTheme(baseTheme);
	  return render(item, itemProps, theme);
	});
	
	var Content = (0, _styles.createStyledComponent)('span', styles.content);
	var Inner = (0, _styles.createStyledComponent)('span', styles.inner);
	var SecondaryText = (0, _styles.createStyledComponent)('span', styles.secondaryText);
	var Text = (0, _styles.createStyledComponent)('span', styles.text);
	
	var onKeyDown = function onKeyDown(onClick, event) {
	  if (event.key === 'Enter' || event.key === ' ') {
	    event.preventDefault();
	    onClick && onClick(event);
	  }
	};
	
	var variantIcons = {
	  danger: _jsx(_IconDanger2.default, {
	    size: (0, _styles.pxToEm)(24)
	  }),
	  success: _jsx(_IconSuccess2.default, {
	    size: (0, _styles.pxToEm)(24)
	  }),
	  warning: _jsx(_IconWarning2.default, {
	    size: (0, _styles.pxToEm)(24)
	  })
	};
	
	var defaultRender = function defaultRender(_ref4) {
	  var children = _ref4.children,
	      disabled = _ref4.disabled,
	      iconEnd = _ref4.iconEnd,
	      iconStart = _ref4.iconStart,
	      onClick = _ref4.onClick,
	      secondaryText = _ref4.secondaryText,
	      variant = _ref4.variant,
	      tabIndex = _ref4.tabIndex,
	      restProps = _objectWithoutProperties(_ref4, ['children', 'disabled', 'iconEnd', 'iconStart', 'onClick', 'secondaryText', 'variant', 'tabIndex']);
	
	  var rootProps = _extends({
	    disabled: disabled,
	    onClick: disabled ? undefined : onClick,
	    onKeyDown: onClick ? onKeyDown.bind(null, onClick) : undefined,
	    tabIndex: disabled ? '-1' : tabIndex,
	    variant: variant
	  }, restProps);
	
	  var startIcon = variant !== undefined && variant && variantIcons[variant];
	  if (iconStart) {
	    startIcon = (0, _react.cloneElement)(iconStart, { size: (0, _styles.pxToEm)(24), key: 'iconStart' });
	  }
	
	  var endIcon = iconEnd && (0, _react.cloneElement)(iconEnd, { size: (0, _styles.pxToEm)(24), key: 'iconEnd' });
	
	  // This structure is based on Button
	  return _react2.default.createElement(
	    Root,
	    rootProps,
	    _jsx(Inner, {}, void 0, startIcon, (children || secondaryText) && _jsx(Content, {}, void 0, _jsx(Text, {}, void 0, children), SecondaryText && _jsx(SecondaryText, {}, void 0, secondaryText)), endIcon)
	  );
	};
	
	var customRender = function customRender(_ref5) {
	  var render = _ref5.render,
	      item = _ref5.item,
	      restProps = _objectWithoutProperties(_ref5, ['render', 'item']);
	
	  var customRootProps = {
	    item: item,
	    itemProps: _extends({
	      onKeyDown: item && item.onClick ? onKeyDown.bind(null, item.onClick) : undefined,
	      tabIndex: item && item.disabled && '-1'
	    }, restProps),
	    render: render
	  };
	  return _react2.default.createElement(CustomRoot, customRootProps);
	};
	
	/**
	 * A MenuItem represents an option in a [Menu](/components/menu).
	 * They can be used to trigger actions or navigate to a new location.
	 * MenuItems provide context through optional variants, secondary text, or [Icons](/components/icon).
	 *
	 * A custom rendering hook is exposed to enable any extra functionality your app requires.
	 */
	function MenuItem(_ref6) {
	  var _ref6$tabIndex = _ref6.tabIndex,
	      tabIndex = _ref6$tabIndex === undefined ? 0 : _ref6$tabIndex,
	      restProps = _objectWithoutProperties(_ref6, ['tabIndex']);
	
	  var rootProps = _extends({
	    tabIndex: tabIndex
	  }, restProps);
	
	  if (rootProps.render) {
	    return customRender(rootProps);
	  } else {
	    return defaultRender(rootProps);
	  }
	}

/***/ }),
/* 344 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = MenuDivider;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    MenuDivider_borderColor: baseTheme.borderColor,
	    MenuDivider_borderWidth: '1px',
	    MenuDivider_margin: baseTheme.space_stack_sm
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('div', function (props) {
	  var theme = componentTheme(props.theme);
	
	  return {
	    backgroundColor: theme.MenuDivider_borderColor,
	    height: theme.MenuDivider_borderWidth,
	    margin: theme.MenuDivider_margin + ' 0'
	  };
	}, {
	  displayName: 'MenuDivider'
	});
	
	/**
	 * MenuDividers separate [MenuItems](/components/menu-item) and [MenuGroups](/components/menu-group) to establish hierarchy in a [Menu](/components/menu) with several options.
	 *
	 * MenuDividers are not merely design elements to visually separate options.
	 * Rather, the are a way to logically group choices.
	 * Too many dividers will add unnecessary weight to your Menu.
	 */
	function MenuDivider(props) {
	  return _react2.default.createElement(Root, _extends({}, props, { role: 'separator' }));
	}

/***/ }),
/* 345 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = MenuGroup;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _MenuGroupTitle = __webpack_require__(346);
	
	var _MenuGroupTitle2 = _interopRequireDefault(_MenuGroupTitle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    MenuGroup_margin: baseTheme.space_stack_sm
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('div', function (props) {
	  var theme = componentTheme(props.theme);
	
	  return {
	    margin: theme.MenuGroup_margin + ' 0',
	    '&:first-child,& + &': {
	      marginTop: 0
	    },
	
	    '&:last-child': {
	      marginBottom: 0
	    }
	  };
	}, {
	  displayName: 'MenuGroup'
	});
	
	/**
	 * MenuGroups assemble [MenuItems](/components/menu-item) and can display a title.
	 * Grouping Menu options provides context clues to users about related actions.
	 * An optional title can be added to reinforce the intent of the grouping.
	 */
	function MenuGroup(_ref) {
	  var children = _ref.children,
	      title = _ref.title,
	      restProps = _objectWithoutProperties(_ref, ['children', 'title']);
	
	  return _react2.default.createElement(
	    Root,
	    restProps,
	    title && _jsx(_MenuGroupTitle2.default, {}, void 0, title),
	    children
	  );
	}

/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = MenuGroupTitle;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _MenuItem = __webpack_require__(343);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    MenuGroupTitle_fontSize: (0, _styles.pxToEm)(12),
	    MenuGroupTitle_fontWeight: baseTheme.fontWeight_bold,
	    MenuGroupTitle_paddingTop: baseTheme.space_stack_md,
	    MenuGroupTitle_paddingBottom: baseTheme.space_stack_sm
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('h3', function (props) {
	  var theme = _extends({}, componentTheme(props.theme), (0, _MenuItem.componentTheme)(props.theme));
	
	  var paddingBottom = (0, _styles.getNormalizedValue)(theme.MenuGroupTitle_paddingBottom, theme.MenuGroupTitle_fontSize);
	
	  var paddingTop = (0, _styles.getNormalizedValue)(theme.MenuGroupTitle_paddingTop, theme.MenuGroupTitle_fontSize);
	
	  // We need to use MenuItem's padding, to match
	  var paddingHorizontal = (0, _styles.getNormalizedValue)(theme.MenuItem_paddingHorizontal, theme.MenuGroupTitle_fontSize);
	
	  return {
	    fontSize: theme.MenuGroupTitle_fontSize,
	    fontWeight: theme.MenuGroupTitle_fontWeight,
	    margin: 0,
	    padding: paddingTop + ' ' + paddingHorizontal + ' ' + paddingBottom
	  };
	}, {
	  displayName: 'MenuGroupTitle'
	});
	
	/**
	 * Menu group title component
	 */
	function MenuGroupTitle(props) {
	  return _react2.default.createElement(Root, props);
	}

/***/ }),
/* 347 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactPopper = __webpack_require__(277);
	
	var _glamorous = __webpack_require__(50);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var getRtlPlacement = function getRtlPlacement(placement) {
	  var rtlPlacementMap = {
	    end: 'start',
	    start: 'end'
	  };
	
	  var _placement$split = placement.split('-'),
	      _placement$split2 = _slicedToArray(_placement$split, 2),
	      edge = _placement$split2[0],
	      direction = _placement$split2[1];
	
	  if (['bottom', 'top'].indexOf(edge) !== -1) {
	    return placement.replace(direction, rtlPlacementMap[direction]);
	  }
	
	  return placement;
	};
	
	/**
	 * Wrapper around react-popper's Popper to respect RTL in placement
	 */
	function RtlPopper(_ref) {
	  var placement = _ref.placement,
	      theme = _ref.theme,
	      restProps = _objectWithoutProperties(_ref, ['placement', 'theme']);
	
	  var rootProps = _extends({
	    placement: placement && theme.direction === 'rtl' ? getRtlPlacement(placement) : placement
	  }, restProps);
	
	  return _react2.default.createElement(_reactPopper.Popper, rootProps);
	}
	
	exports.default = (0, _glamorous.withTheme)(RtlPopper);

/***/ }),
/* 348 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var babelPluginFlowReactPropTypes_proptype_Item = __webpack_require__(343).babelPluginFlowReactPropTypes_proptype_Item || __webpack_require__(82).any;
	
	var babelPluginFlowReactPropTypes_proptype_Items = __webpack_require__(342).babelPluginFlowReactPropTypes_proptype_Items || __webpack_require__(82).any;
	
	var ItemMatcher = function ItemMatcher() {
	  var _this = this;
	
	  _classCallCheck(this, ItemMatcher);
	
	  this.keys = '';
	
	  this.findMatchingItem = function (items, highlightedIndex, key) {
	    if (!_this.isMatchableCharacter(key)) {
	      return;
	    }
	
	    _this.searchIndex = highlightedIndex === undefined ? 0 : highlightedIndex + 1;
	
	    _this.keys += key;
	    _this.resetKeysAfterDelay();
	
	    var match = _this.findMatchingItemInRange(items, _this.searchIndex, items.length) || _this.findMatchingItemInRange(items, 0, _this.searchIndex);
	
	    return match;
	  };
	
	  this.findMatchingItemInRange = function (items, start, end) {
	    var keys = _this.keys.toLowerCase();
	    for (var index = start; index < end; index++) {
	      var text = items[index].text;
	
	      if (text && typeof text === 'string' && text.toLowerCase().indexOf(keys) === 0) {
	        return items[index];
	      }
	    }
	  };
	
	  this.resetKeysAfterDelay = function () {
	    if (_this.keysTimer) {
	      global.clearTimeout(_this.keysTimer);
	      _this.keysTimer = null;
	    }
	
	    _this.keysTimer = global.setTimeout(function () {
	      _this.keys = '';
	      _this.keysTimer = null;
	    }, 500);
	  };
	
	  this.isMatchableCharacter = function (key) {
	    return key.length === 1 && /\S/.test(key);
	  };
	}
	
	// Exclude standalone modifier keys, but allow use as combinator
	// e.g. Reject standalone ALT key, but ALT+m which creates µ is okay
	;
	
	exports.default = ItemMatcher;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconMoreHoriz;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ = __webpack_require__(90);
	
	var _2 = _interopRequireDefault(_);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconMoreHoriz(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconMoreHoriz.propTypes = {
	  size: __webpack_require__(82).oneOfType([__webpack_require__(82).string, __webpack_require__(82).oneOf(['small']), __webpack_require__(82).oneOf(['medium']), __webpack_require__(82).oneOf(['large'])]),
	  color: __webpack_require__(82).string,
	  rtl: __webpack_require__(82).bool,
	  title: __webpack_require__(82).string
	};
	IconMoreHoriz.category = 'navigation';

/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = PopoverArrow;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactPopper = __webpack_require__(277);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    PopoverArrow_backgroundColor: baseTheme.color_white,
	    PopoverArrow_borderColor: baseTheme.color_gray_20
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)(_reactPopper.Arrow, function (_ref) {
	  var placement = _ref.placement,
	      size = _ref.size,
	      baseTheme = _ref.theme;
	
	  var theme = componentTheme(baseTheme);
	  var arrowShadow = ', 0 3px 1px rgba(0, 0, 0, 0.3)';
	  var horizontalOffset = '-' + (parseFloat(size) - 4) + 'px';
	  var directionalStyles = void 0;
	  var rotation = 0;
	
	  switch (true) {
	    case placement && placement.startsWith('top'):
	      // Magic numbers to optically match theme.boxShadow_2
	      arrowShadow = ', 0 4px 2px rgba(0, 0, 0, 0.3)';
	      directionalStyles = {
	        bottom: '-' + (parseFloat(size) - 2) + 'px',
	        left: 'calc(50% - ' + size + ')',
	        marginBottom: 0,
	        marginTop: 0
	      };
	      break;
	    case placement && placement.startsWith('bottom'):
	      arrowShadow = '';
	      directionalStyles = {
	        top: '-' + (parseFloat(size) - 3) + 'px',
	        left: 'calc(50% - ' + size + ')',
	        marginBottom: 0,
	        marginTop: 0
	      };
	      rotation = 180;
	      break;
	    case placement && placement.startsWith('left'):
	      directionalStyles = {
	        right: horizontalOffset,
	        top: 'calc(50% - ' + size + ')',
	        marginLeft: 0,
	        marginRight: 0
	      };
	      rotation = -90;
	      break;
	    case placement && placement.startsWith('right'):
	      directionalStyles = {
	        left: horizontalOffset,
	        top: 'calc(50% - ' + size + ')',
	        marginLeft: 0,
	        marginRight: 0
	      };
	      rotation = 90;
	      break;
	    default:
	      directionalStyles = {
	        display: 'none'
	      };
	  }
	
	  return _extends({
	    color: theme.PopoverArrow_backgroundColor,
	    display: 'inline-block',
	    fontSize: size,
	    margin: size,
	    position: 'absolute',
	    textShadow: '0 2px 0 ' + theme.PopoverArrow_borderColor + arrowShadow,
	    transform: 'rotate(' + rotation + 'deg) scaleX(2)'
	  }, directionalStyles);
	}, {
	  displayName: 'PopoverArrow',
	  rootEl: 'span'
	});
	
	/**
	 * PopoverArrow component
	 */
	function PopoverArrow(props) {
	  return _react2.default.createElement(
	    Root,
	    _extends({}, props, { 'aria-hidden': true }),
	    '\u25BC'
	  );
	}
	PopoverArrow.propTypes = {
	  /** Size of arrow */
	  size: __webpack_require__(82).string.isRequired,
	
	  /** Placement of the popper */
	  placement: __webpack_require__(82).oneOf(['auto', 'auto-end', 'auto-start', 'bottom', 'bottom-end', 'bottom-start', 'left', 'left-end', 'left-start', 'right', 'right-end', 'right-start', 'top', 'top-end', 'top-start'])
	};

/***/ }),
/* 351 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(352);
	
	var _Form = __webpack_require__(354);
	
	var _TextInput = __webpack_require__(358);
	
	var _TextInput2 = _interopRequireDefault(_TextInput);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var FilterInput = function (_Component) {
	    _inherits(FilterInput, _Component);
	
	    function FilterInput() {
	        _classCallCheck(this, FilterInput);
	
	        return _possibleConstructorReturn(this, (FilterInput.__proto__ || Object.getPrototypeOf(FilterInput)).apply(this, arguments));
	    }
	
	    _createClass(FilterInput, [{
	        key: '_onFilterTextChange',
	        value: function _onFilterTextChange(e) {
	            this.props.filterTextFt(e.target.value);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var inputProps = {
	                value: this.props.filterText,
	                onChange: this._onFilterTextChange.bind(this),
	                label: 'Site Name'
	            };
	            return _react2.default.createElement(
	                'div',
	                { className: 'filter-input' },
	                _react2.default.createElement(
	                    'div',
	                    { className: 'form-group' },
	                    _react2.default.createElement(_Form.FormField, _extends({ input: _TextInput2.default }, inputProps))
	                )
	            );
	        }
	    }]);
	
	    return FilterInput;
	}(_react.Component);
	
	exports.default = FilterInput;
	
	
	FilterInput.propTypes = {
	    filterTextFt: _react2.default.PropTypes.func.isRequired,
	    filterText: _react2.default.PropTypes.string
	};

/***/ }),
/* 352 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(353);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!./filter-input.css", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!./filter-input.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, ".filter-input {\n  margin: 1rem;\n  width: 50%;\n}", ""]);
	
	// exports


/***/ }),
/* 354 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _FormField = __webpack_require__(355);
	
	Object.defineProperty(exports, 'FormField', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_FormField).default;
	  }
	});
	
	var _FormFieldset = __webpack_require__(356);
	
	Object.defineProperty(exports, 'FormFieldset', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_FormFieldset).default;
	  }
	});
	
	var _FormFieldDivider = __webpack_require__(357);
	
	Object.defineProperty(exports, 'FormFieldDivider', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_FormFieldDivider).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 355 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _utils = __webpack_require__(92);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var REGEX_GROUP = /(Checkbox|Radio|Group)/i;
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    FormFieldCaption_color_text: baseTheme.color_gray_80,
	    FormFieldCaption_fontSize: baseTheme.fontSize_mouse,
	    FormFieldCaption_marginTop: baseTheme.space_stack_xxs,
	    FormFieldCaption_marginTop_isGroup: baseTheme.space_stack_sm,
	
	    FormFieldLabel_color_text: baseTheme.color_gray_80,
	    FormFieldLabel_fontSize: baseTheme.fontSize_ui,
	    FormFieldLabel_fontWeight: baseTheme.fontWeight_semiBold,
	    FormFieldLabel_marginBottom: baseTheme.space_stack_sm,
	
	    FormFieldSecondaryText_fontSize: baseTheme.fontSize_mouse,
	    FormFieldSecondaryText_color_text: baseTheme.color_gray_80,
	    FormFieldSecondaryText_color_text_required: baseTheme.color_text_danger
	
	  }, baseTheme);
	};
	
	var styles = {
	  caption: function caption(_ref) {
	    var isGroup = _ref.isGroup,
	        baseTheme = _ref.theme,
	        variant = _ref.variant;
	
	    var theme = componentTheme(baseTheme);
	    if (variant) {
	      // prettier-ignore
	      theme = _extends({}, theme, {
	        FormFieldCaption_color_text: baseTheme['color_text_' + variant]
	      });
	    }
	
	    var fontSize = theme.FormFieldCaption_fontSize;
	
	    return {
	      color: theme.FormFieldCaption_color_text,
	      fontSize: fontSize,
	      marginTop: isGroup ? (0, _styles.getNormalizedValue)(theme.FormFieldCaption_marginTop_isGroup, fontSize) : (0, _styles.getNormalizedValue)(theme.FormFieldCaption_marginTop, fontSize)
	    };
	  },
	  textWrapper: function textWrapper(_ref2) {
	    var hideLabel = _ref2.hideLabel,
	        baseTheme = _ref2.theme;
	
	    var theme = componentTheme(baseTheme);
	
	    return _extends({
	      color: theme.FormFieldLabel_color_text,
	      display: 'flex',
	      fontSize: theme.FormFieldLabel_fontSize,
	      fontWeight: theme.FormFieldLabel_fontWeight,
	      justifyContent: 'space-between',
	      marginBottom: theme.FormFieldLabel_marginBottom
	    }, hideLabel ? {
	      border: '0',
	      clip: 'rect(0 0 0 0)',
	      clipPath: 'inset(50%)',
	      height: '1px',
	      margin: '-1px',
	      overflow: 'hidden',
	      padding: '0',
	      position: 'absolute',
	      whiteSpace: 'nowrap',
	      width: '1px'
	    } : {}, {
	      '& > *': {
	        alignSelf: 'flex-end',
	        display: 'inline-block'
	      }
	    });
	  },
	  secondaryText: function (_secondaryText) {
	    function secondaryText(_x) {
	      return _secondaryText.apply(this, arguments);
	    }
	
	    secondaryText.toString = function () {
	      return _secondaryText.toString();
	    };
	
	    return secondaryText;
	  }(function (_ref3) {
	    var secondaryText = _ref3.secondaryText,
	        baseTheme = _ref3.theme;
	
	    var theme = componentTheme(baseTheme);
	
	    return {
	      color: secondaryText ? theme.FormFieldSecondaryText_color_text : theme.FormFieldSecondaryText_color_text_required,
	      fontSize: theme.FormFieldSecondaryText_fontSize
	    };
	  })
	};
	
	var Root = (0, _styles.createStyledComponent)('div', {}, {
	  displayName: 'FormField',
	  includeStyleReset: true
	});
	var TextWrapper = (0, _styles.createStyledComponent)('div', styles.textWrapper);
	var SecondaryText = (0, _styles.createStyledComponent)('span', styles.secondaryText);
	var Caption = (0, _styles.createStyledComponent)('div', styles.caption);
	
	/**
	 * The FormField component enhances form inputs with an accessible label and
	 * optionally displays additional help text.
	 */
	
	var FormField = function (_Component) {
	  _inherits(FormField, _Component);
	
	  function FormField() {
	    var _ref4;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, FormField);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = FormField.__proto__ || Object.getPrototypeOf(FormField)).call.apply(_ref4, [this].concat(args))), _this), _this.id = 'formField-' + (0, _utils.generateId)(), _this.getControlName = function () {
	      var _this$props = _this.props,
	          children = _this$props.children,
	          input = _this$props.input;
	
	      var controlName = void 0;
	
	      if (input && input.name) {
	        controlName = input.name;
	      } else if (children) {
	        var child = _react.Children.only(children);
	        if (child.type && child.type.name) {
	          controlName = child.type.name;
	        }
	      }
	
	      return controlName;
	    }, _this.isGroup = function () {
	      var controlName = _this.getControlName();
	
	      return controlName && REGEX_GROUP.test(controlName);
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(FormField, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _props = this.props,
	          caption = _props.caption,
	          children = _props.children,
	          className = _props.className,
	          hideLabel = _props.hideLabel,
	          input = _props.input,
	          label = _props.label,
	          required = _props.required,
	          requiredText = _props.requiredText,
	          otherRootProps = _props.rootProps,
	          secondaryText = _props.secondaryText,
	          variant = _props.variant,
	          restProps = _objectWithoutProperties(_props, ['caption', 'children', 'className', 'hideLabel', 'input', 'label', 'required', 'requiredText', 'rootProps', 'secondaryText', 'variant']);
	
	      var rootProps = _extends({
	        className: className
	      }, otherRootProps);
	
	      // Label structure differs if input/control is a grouped control which has
	      // its own label tag.  e.g. Radio, Checkbox, RadioGroup, CheckboxGroup
	      var isGroup = this.isGroup();
	      var Label = isGroup ? 'div' : 'label';
	
	      var textWrapperProps = {
	        hideLabel: hideLabel,
	        key: this.id + '-textWrapper'
	      };
	
	      var labelTextProps = {
	        id: this.id + '-labelText'
	      };
	
	      var captionProps = {
	        caption: caption,
	        isGroup: isGroup,
	        variant: variant,
	        id: this.id + '-caption'
	      };
	
	      var controlProps = function controlProps() {
	        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	        return _extends({
	          'aria-describedby': caption && captionProps.id,
	          key: _this2.id + '-control',
	          required: required,
	          rootProps: isGroup ? _extends({
	            'aria-labelledby': labelTextProps.id,
	            'aria-describedby': caption && captionProps.id
	          }, props.rootProps) : props.rootProps,
	          variant: variant
	        }, restProps);
	      };
	
	      var control = null;
	      if (input) {
	        control = (0, _react.createElement)(input, controlProps());
	      } else if (children) {
	        var child = _react.Children.only(children);
	        control = (0, _react.cloneElement)(child, controlProps(child.props));
	      }
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        _jsx(Label, {}, void 0, _react2.default.createElement(
	          TextWrapper,
	          textWrapperProps,
	          _react2.default.createElement(
	            'span',
	            labelTextProps,
	            label
	          ),
	          (required || secondaryText) && _jsx(SecondaryText, {
	            secondaryText: secondaryText
	          }, void 0, secondaryText ? secondaryText : requiredText)
	        ), control),
	        caption && _react2.default.createElement(
	          Caption,
	          captionProps,
	          caption
	        )
	      );
	    }
	  }]);
	
	  return FormField;
	}(_react.Component);
	
	FormField.propTypes = {
	  /**
	   * Caption associated with the input element; commonly used to provide help
	   * text
	   */
	  caption: __webpack_require__(82).oneOfType([__webpack_require__(82).string, typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any]),
	
	  /** Form input element */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** @Private CSS className */
	  className: __webpack_require__(82).string,
	
	  /** Visually hide label, but keep available for [assistive technologies](https://webaccess.berkeley.edu/resources/assistive-technology) */
	  hideLabel: __webpack_require__(82).bool,
	
	  /** Form input class; alternative to `children` */
	  input: typeof React$ComponentType === 'function' ? __webpack_require__(82).instanceOf(React$ComponentType) : __webpack_require__(82).any,
	
	  /** Props to be applied directly to the root element, rather than the input */
	  rootProps: __webpack_require__(82).object,
	
	  /** Label associated with the input element */
	  label: __webpack_require__(82).oneOfType([__webpack_require__(82).string, typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any]).isRequired,
	
	  /** Marks associated input as required */
	  required: __webpack_require__(82).bool,
	
	  /** Text used to indicate a required field */
	  requiredText: __webpack_require__(82).oneOfType([__webpack_require__(82).string, typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any]),
	
	  /**
	   * Secondary text associated with the input element; takes precedence over
	   * `requiredText`
	   */
	  secondaryText: __webpack_require__(82).oneOfType([__webpack_require__(82).string, typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any]),
	
	  /** Available variants */
	  variant: __webpack_require__(82).oneOf(['success', 'warning', 'danger'])
	};
	FormField.defaultProps = {
	  requiredText: 'Required'
	};
	exports.default = FormField;

/***/ }),
/* 356 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = FormFieldset;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    FormFieldset_borderColor: baseTheme.borderColor,
	
	    FormFieldsetLegend_color_text: baseTheme.color_text,
	    FormFieldsetLegend_fontSize: baseTheme.fontSize_ui,
	    FormFieldsetLegend_fontWeight: baseTheme.fontWeight_bold
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('fieldset', function (_ref) {
	  var disabled = _ref.disabled,
	      baseTheme = _ref.theme;
	
	  var theme = componentTheme(baseTheme);
	
	  return {
	    border: '1px solid transparent',
	    borderTopColor: theme.FormFieldset_borderColor,
	    padding: 0,
	
	    '& > legend': {
	      color: disabled ? theme.color_text_disabled : theme.FormFieldsetLegend_color_text,
	      fontSize: theme.FormFieldsetLegend_fontSize,
	      fontWeight: theme.FormFieldsetLegend_fontWeight,
	      lineHeight: theme.size_medium,
	      padding: 0,
	      paddingLeft: theme.direction === 'rtl' ? theme.space_inline_sm : null,
	      paddingRight: theme.direction === 'ltr' ? theme.space_inline_sm : null
	    }
	  };
	}, {
	  displayName: 'FormFieldset',
	  includeStyleReset: true,
	  rootEl: 'fieldset'
	});
	
	/**
	 * FormFieldsets group related [FormFields](/components/form-field) and provide a legend.
	 * Grouping FormFields provides contextual clues to users and enhances
	 * accessibility.
	 */
	function FormFieldset(_ref2) {
	  var children = _ref2.children,
	      legend = _ref2.legend,
	      restProps = _objectWithoutProperties(_ref2, ['children', 'legend']);
	
	  return _react2.default.createElement(
	    Root,
	    restProps,
	    legend && _jsx('legend', {}, void 0, legend),
	    children
	  );
	}

/***/ }),
/* 357 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = FormFieldDivider;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    FormFieldDivider_borderColor: baseTheme.borderColor,
	    FormFieldDivider_borderWidth: '1px',
	    FormFieldDivider_margin: baseTheme.space_stack_sm
	
	  }, baseTheme);
	};
	
	var Root = (0, _styles.createStyledComponent)('div', function (_ref) {
	  var baseTheme = _ref.theme;
	
	  var theme = componentTheme(baseTheme);
	
	  return {
	    backgroundColor: theme.FormFieldDivider_borderColor,
	    height: theme.FormFieldDivider_borderWidth,
	    margin: theme.FormFieldDivider_margin + ' 0'
	  };
	}, {
	  displayName: 'FormFieldDivider'
	});
	
	/**
	 * FormFieldDivider separates [FormFields](/components/form-field) to group form inputs.
	 *
	 * FormFieldDividers help your users grok forms with several inputs by hinting
	 * at related fields, without explicitly adding a legend.
	 */
	function FormFieldDivider(props) {
	  return _react2.default.createElement(Root, _extends({}, props, { role: 'separator' }));
	}

/***/ }),
/* 358 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _TextInput = __webpack_require__(359);
	
	Object.defineProperty(exports, 'default', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_TextInput).default;
	  }
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 359 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = TextInput;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _themes = __webpack_require__(290);
	
	var _FauxControl = __webpack_require__(360);
	
	var _FauxControl2 = _interopRequireDefault(_FauxControl);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({}, (0, _themes.mapComponentThemes)({
	    name: 'FauxControl',
	    theme: (0, _FauxControl.componentTheme)(baseTheme)
	  }, {
	    name: 'TextInput',
	    theme: {
	      TextInput_color_placeholder: baseTheme.color_gray_60,
	
	      TextInputIcon_fill: baseTheme.color_gray_40
	    }
	  }, baseTheme));
	};
	
	var styles = {
	  input: {
	    backgroundColor: 'transparent',
	    border: 0,
	    boxShadow: 'none',
	    flex: '1 1 auto',
	    fontFamily: 'inherit',
	    minWidth: 0,
	    width: '100%'
	  },
	  root: function root(_ref) {
	    var baseTheme = _ref.theme,
	        variant = _ref.variant;
	
	    var theme = componentTheme(baseTheme);
	
	    return {
	      alignItems: 'center',
	      cursor: 'text',
	      display: 'flex',
	      width: '100%',
	
	      '& [role="img"]': {
	        display: 'block',
	        fill: theme.TextInputIcon_fill,
	        flex: '0 0 auto',
	        margin: '0 ' + theme.TextInputIcon_marginHorizontal,
	
	        '&:last-of-type': {
	          fill: variant ? theme['color_text_' + variant] : theme.TextInputIcon_fill
	        }
	      }
	    };
	  }
	};
	
	var Root = (0, _styles.createStyledComponent)(_FauxControl2.default, styles.root, {
	  displayName: 'TextInput'
	});
	var Input = (0, _styles.createStyledComponent)('input', styles.input, {
	  dispayName: 'Input',
	  rootEl: 'input'
	});
	
	/**
	 * TextInput allows your app to accept a text value from the user. It supports
	 * any of the text-based input types, such as `text`, `number` or `email`.
	 */
	function TextInput(_ref2) {
	  var className = _ref2.className,
	      disabled = _ref2.disabled,
	      iconEnd = _ref2.iconEnd,
	      iconStart = _ref2.iconStart,
	      inputRef = _ref2.inputRef,
	      invalid = _ref2.invalid,
	      prefix = _ref2.prefix,
	      readOnly = _ref2.readOnly,
	      required = _ref2.required,
	      otherRootProps = _ref2.rootProps,
	      _ref2$size = _ref2.size,
	      size = _ref2$size === undefined ? 'large' : _ref2$size,
	      suffix = _ref2.suffix,
	      _ref2$type = _ref2.type,
	      type = _ref2$type === undefined ? 'text' : _ref2$type,
	      variant = _ref2.variant,
	      restProps = _objectWithoutProperties(_ref2, ['className', 'disabled', 'iconEnd', 'iconStart', 'inputRef', 'invalid', 'prefix', 'readOnly', 'required', 'rootProps', 'size', 'suffix', 'type', 'variant']);
	
	  var inputProps = _extends({
	    'aria-invalid': invalid,
	    'aria-required': required,
	    controlRef: inputRef,
	    disabled: disabled,
	    readOnly: readOnly,
	    required: required,
	    type: type
	  }, restProps);
	
	  var rootProps = _extends({
	    className: className,
	    control: Input,
	    controlProps: inputProps,
	    disabled: disabled,
	    iconEnd: iconEnd,
	    iconStart: iconStart,
	    prefix: prefix,
	    readOnly: readOnly,
	    size: size,
	    suffix: suffix,
	    variant: variant
	  }, otherRootProps);
	
	  return _react2.default.createElement(Root, rootProps);
	}

/***/ }),
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentTheme = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styles = __webpack_require__(48);
	
	var _IconDanger = __webpack_require__(332);
	
	var _IconDanger2 = _interopRequireDefault(_IconDanger);
	
	var _IconSuccess = __webpack_require__(333);
	
	var _IconSuccess2 = _interopRequireDefault(_IconSuccess);
	
	var _IconWarning = __webpack_require__(334);
	
	var _IconWarning2 = _interopRequireDefault(_IconWarning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var componentTheme = exports.componentTheme = function componentTheme(baseTheme) {
	  return _extends({
	    FauxControl_backgroundColor: baseTheme.backgroundColor_input,
	    FauxControl_borderColor: baseTheme.borderColor,
	    FauxControl_borderColor_active: baseTheme.borderColor,
	    FauxControl_borderColor_focus: baseTheme.borderColor,
	    FauxControl_borderColor_hover: baseTheme.borderColor_hover,
	    FauxControl_borderRadius: baseTheme.borderRadius_1,
	    FauxControl_borderWidth: '1px',
	    FauxControl_boxShadow_active: '0 0 0 1px ' + baseTheme.color_white + ', 0 0 0 2px ' + baseTheme.borderColor_active,
	    FauxControl_boxShadow_focus: '0 0 0 1px ' + baseTheme.color_white + ', 0 0 0 2px ' + baseTheme.borderColor_focus,
	    FauxControl_color_placeholder: baseTheme.color_gray_60,
	    FauxControl_color_text: baseTheme.color_gray_80,
	    FauxControl_fontSize: baseTheme.fontSize_ui,
	    FauxControl_fontSize_small: (0, _styles.pxToEm)(12),
	    FauxControl_height_small: baseTheme.size_small,
	    FauxControl_height_medium: baseTheme.size_medium,
	    FauxControl_height_large: baseTheme.size_large,
	    FauxControl_height_jumbo: baseTheme.size_jumbo,
	    FauxControl_paddingHorizontal: baseTheme.space_inset_md,
	    FauxControl_paddingHorizontal_small: baseTheme.space_inset_sm,
	
	    FauxControlIcon_marginHorizontal: baseTheme.space_inline_sm
	
	  }, baseTheme);
	};
	
	var styles = {
	  prefix: function prefix(_ref) {
	    var iconStart = _ref.iconStart,
	        size = _ref.size,
	        baseTheme = _ref.theme;
	
	    var theme = componentTheme(baseTheme);
	    var rtl = theme.direction === 'rtl';
	
	    var fontSize = size === 'small' ? theme.FauxControl_fontSize_small : theme.FauxControl_fontSize;
	    var marginWithIcon = (0, _styles.getNormalizedValue)(theme.FauxControl_paddingHorizontal, fontSize);
	    var marginWithoutIcon = (0, _styles.getNormalizedValue)(parseFloat(theme.FauxControlIcon_marginHorizontal) / 2 + 'em', fontSize);
	
	    return _extends({
	      flex: '0 0 auto',
	      fontSize: fontSize,
	      marginLeft: rtl ? marginWithoutIcon : iconStart ? 0 : marginWithIcon,
	      marginRight: rtl ? iconStart ? 0 : marginWithIcon : marginWithoutIcon,
	      whiteSpace: 'nowrap'
	    }, {
	      display: 'inline-block',
	      maxWidth: '8em',
	      overflow: 'hidden',
	      textOverflow: 'ellipsis',
	      whiteSpace: 'nowrap',
	      wordWrap: 'normal'
	    });
	  },
	  control: function control(_ref2) {
	    var controlPropsIn = _ref2.controlPropsIn,
	        disabled = _ref2.disabled,
	        hasPlaceholder = _ref2.hasPlaceholder,
	        iconEnd = _ref2.iconEnd,
	        iconStart = _ref2.iconStart,
	        prefix = _ref2.prefix,
	        readOnly = _ref2.readOnly,
	        size = _ref2.size,
	        suffix = _ref2.suffix,
	        baseTheme = _ref2.theme,
	        variant = _ref2.variant;
	
	    var theme = componentTheme(baseTheme);
	
	    if (variant) {
	      // prettier-ignore
	      theme = _extends({}, theme, {
	        FauxControl_boxShadow_focus: '0 0 0 1px ' + theme.color_white + ', 0 0 0 2px ' + theme['borderColor_' + variant]
	      });
	    }
	
	    if (controlPropsIn.variant) {
	      // prettier-ignore
	      theme = _extends({}, theme, {
	        FauxControl_color_text: theme['color_text_' + controlPropsIn.variant]
	      });
	    }
	
	    var rtl = theme.direction === 'rtl';
	    var fontSize = size === 'small' ? theme.FauxControl_fontSize_small : theme.FauxControl_fontSize;
	    var sizeAppropriateHorizontalPadding = size === 'small' || size === 'medium' ? theme.FauxControl_paddingHorizontal_small || theme.FauxControl_paddingHorizontal : theme.FauxControl_paddingHorizontal;
	    var paddingWithoutIcon = (0, _styles.getNormalizedValue)(sizeAppropriateHorizontalPadding, fontSize);
	
	    var placeholderStyles = {
	      color: theme.FauxControl_color_placeholder,
	      fontStyle: 'italic'
	    };
	
	    return {
	      color: disabled ? theme.color_text_disabled : hasPlaceholder || readOnly ? theme.FauxControl_color_placeholder : theme.FauxControl_color_text,
	      fontSize: fontSize,
	      fontStyle: hasPlaceholder ? 'italic' : null,
	      height: (0, _styles.getNormalizedValue)(theme['FauxControl_height_' + size], fontSize),
	      outline: 0,
	      paddingLeft: (iconStart || prefix) && !rtl || (iconEnd || variant || suffix) && rtl ? 0 : paddingWithoutIcon,
	      paddingRight: (iconEnd || variant || suffix) && !rtl || (iconStart || prefix) && rtl ? 0 : paddingWithoutIcon,
	
	      '&::placeholder': placeholderStyles,
	      '&::-ms-input-placeholder': placeholderStyles, // Edge
	      '&:-ms-input-placeholder': placeholderStyles, // IE 11
	
	      '&::-ms-clear': {
	        display: 'none'
	      },
	
	      '&:focus,&[data-simulate-focus]': {
	        '& ~ div:last-child': {
	          borderColor: theme.FauxControl_borderColor_focus,
	          boxShadow: theme.FauxControl_boxShadow_focus
	        }
	      }
	    };
	  },
	  root: function root(_ref3) {
	    var disabled = _ref3.disabled,
	        baseTheme = _ref3.theme,
	        variant = _ref3.variant;
	
	    var theme = componentTheme(baseTheme);
	    if (variant) {
	      // prettier-ignore
	      theme = _extends({}, theme, {
	        FauxControl_borderColor_hover: theme['borderColor_' + variant + '_hover'],
	        FauxControl_boxShadow_active: '0 0 0 1px ' + theme.color_white + ', 0 0 0 2px ' + theme['borderColor_' + variant],
	        FauxControl_boxShadow_focus: '0 0 0 1px ' + theme.color_white + ', 0 0 0 2px ' + theme['borderColor_' + variant]
	      });
	    }
	
	    return {
	      position: 'relative',
	      zIndex: 1,
	
	      '&:hover,&[data-simulate-hover]': {
	        '& > div:last-child': {
	          borderColor: !disabled ? theme.FauxControl_borderColor_hover : null
	        }
	      },
	
	      '&:focus,&[data-simulate-focus]': {
	        '& > div:last-child': {
	          borderColor: !disabled ? theme.FauxControl_borderColor_focus : null,
	          boxShadow: !disabled ? theme.FauxControl_boxShadow_focus : null
	        }
	      },
	
	      '&:active,&[data-simulate-active]': {
	        '& > div:last-child': {
	          borderColor: theme.FauxControl_borderColor_active,
	          boxShadow: disabled ? 'none' : theme.FauxControl_boxShadow_active
	        }
	      }
	    };
	  },
	  suffix: function suffix(_ref4) {
	    var iconEnd = _ref4.iconEnd,
	        size = _ref4.size,
	        baseTheme = _ref4.theme,
	        variant = _ref4.variant;
	
	    var theme = componentTheme(baseTheme);
	    var rtl = theme.direction === 'rtl';
	
	    var fontSize = size === 'small' ? theme.FauxControl_fontSize_small : theme.FauxControl_fontSize;
	    var marginWithIcon = (0, _styles.getNormalizedValue)(theme.FauxControl_paddingHorizontal, fontSize);
	    var marginWithoutIcon = (0, _styles.getNormalizedValue)(parseFloat(theme.FauxControlIcon_marginHorizontal) / 2 + 'em', fontSize);
	
	    return _extends({
	      flex: '0 0 auto',
	      fontSize: fontSize,
	      marginLeft: rtl ? iconEnd || variant ? 0 : marginWithIcon : marginWithoutIcon,
	      marginRight: rtl ? marginWithoutIcon : iconEnd || variant ? 0 : marginWithIcon,
	      whiteSpace: 'nowrap'
	    }, {
	      display: 'inline-block',
	      maxWidth: '8em',
	      overflow: 'hidden',
	      textOverflow: 'ellipsis',
	      whiteSpace: 'nowrap',
	      wordWrap: 'normal'
	    });
	  },
	  underlay: function underlay(_ref5) {
	    var disabled = _ref5.disabled,
	        readOnly = _ref5.readOnly,
	        baseTheme = _ref5.theme,
	        variant = _ref5.variant;
	
	    var theme = componentTheme(baseTheme);
	
	    return {
	      backgroundColor: disabled || readOnly ? theme.backgroundColor_disabled : theme.FauxControl_backgroundColor,
	      borderColor: variant && !disabled && !readOnly ? theme['borderColor_' + variant] : theme.FauxControl_borderColor,
	      borderRadius: theme.FauxControl_borderRadius,
	      borderStyle: 'solid',
	      borderWidth: theme.FauxControl_borderWidth,
	      bottom: 0,
	      left: 0,
	      position: 'absolute',
	      right: 0,
	      top: 0,
	      zIndex: -1
	    };
	  }
	};
	
	var Prefix = (0, _styles.createStyledComponent)('span', styles.prefix);
	var Root = (0, _styles.createStyledComponent)('div', styles.root, {
	  displayName: 'FauxControl',
	  includeStyleReset: true
	});
	var Suffix = (0, _styles.createStyledComponent)('span', styles.suffix);
	var Underlay = (0, _styles.createStyledComponent)('div', styles.underlay, {
	  displayName: 'Underlay'
	});
	
	var variantIcons = {
	  danger: _jsx(_IconDanger2.default, {}),
	  success: _jsx(_IconSuccess2.default, {}),
	  warning: _jsx(_IconWarning2.default, {})
	};
	
	function getIcons(_ref6) {
	  var disabled = _ref6.disabled,
	      iconStart = _ref6.iconStart,
	      iconEnd = _ref6.iconEnd,
	      readOnly = _ref6.readOnly,
	      size = _ref6.size,
	      variant = _ref6.variant,
	      variantIcons = _ref6.variantIcons;
	
	  if (disabled || readOnly) {
	    return [];
	  }
	
	  var iconSize = size === 'small' ? 'medium' : (0, _styles.pxToEm)(24);
	  var startIcon = iconStart && (0, _react.cloneElement)(iconStart, {
	    size: iconSize,
	    key: 'iconStart'
	  });
	
	  var endIconSource = variant ? variantIcons[variant] : iconEnd ? iconEnd : null;
	
	  var endIcon = endIconSource && (0, _react.cloneElement)(endIconSource, {
	    size: iconSize,
	    key: 'iconEnd'
	  });
	
	  return [startIcon, endIcon];
	}
	
	// The control node must be created outside of render, so that the entire DOM
	// element is replaced only when the control prop is changed.
	var createControlNode = function createControlNode(props) {
	  return (0, _styles.createStyledComponent)(props.control, styles.control);
	};
	
	/**
	 * FauxControl
	 */
	
	var FauxControl = function (_Component) {
	  _inherits(FauxControl, _Component);
	
	  function FauxControl() {
	    var _ref7;
	
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, FauxControl);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref7 = FauxControl.__proto__ || Object.getPrototypeOf(FauxControl)).call.apply(_ref7, [this].concat(args))), _this), _this.controlNode = createControlNode(_this.props), _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  _createClass(FauxControl, [{
	    key: 'componentWillUpdate',
	    value: function componentWillUpdate(nextProps) {
	      if (this.props.control !== nextProps.control) {
	        this.controlNode = createControlNode(nextProps);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props,
	          afterItems = _props.afterItems,
	          beforeItems = _props.beforeItems,
	          children = _props.children,
	          controlPropsIn = _props.controlProps,
	          disabled = _props.disabled,
	          fauxControlRef = _props.fauxControlRef,
	          iconEnd = _props.iconEnd,
	          iconStart = _props.iconStart,
	          prefixIn = _props.prefix,
	          size = _props.size,
	          readOnly = _props.readOnly,
	          suffixIn = _props.suffix,
	          variant = _props.variant,
	          restProps = _objectWithoutProperties(_props, ['afterItems', 'beforeItems', 'children', 'controlProps', 'disabled', 'fauxControlRef', 'iconEnd', 'iconStart', 'prefix', 'size', 'readOnly', 'suffix', 'variant']);
	
	      var rootProps = _extends({
	        disabled: disabled,
	        innerRef: fauxControlRef,
	        variant: variant
	      }, restProps);
	
	      var _getIcons = getIcons({
	        disabled: disabled,
	        iconStart: iconStart,
	        iconEnd: iconEnd,
	        readOnly: readOnly,
	        size: size,
	        variant: variant,
	        variantIcons: variantIcons
	      }),
	          _getIcons2 = _slicedToArray(_getIcons, 2),
	          startIcon = _getIcons2[0],
	          endIcon = _getIcons2[1];
	
	      var prefixAndSuffixProps = {
	        iconEnd: iconEnd,
	        iconStart: iconStart,
	        size: size,
	        variant: variant
	      };
	
	      var prefix = prefixIn ? _react2.default.createElement(
	        Prefix,
	        _extends({}, prefixAndSuffixProps, { key: 'prefix' }),
	        prefixIn
	      ) : null;
	      var suffix = suffixIn ? _react2.default.createElement(
	        Suffix,
	        _extends({}, prefixAndSuffixProps, { key: 'suffix' }),
	        suffixIn
	      ) : null;
	
	      var controlProps = _extends({
	        controlPropsIn: controlPropsIn
	      }, controlPropsIn, {
	        children: children,
	        disabled: disabled,
	        iconEnd: iconEnd,
	        iconStart: iconStart,
	        prefix: prefixIn,
	        innerRef: controlPropsIn && controlPropsIn.controlRef,
	        readOnly: readOnly,
	        size: size,
	        suffix: suffixIn,
	        variant: variant
	      });
	
	      var Control = this.controlNode;
	
	      var underlayProps = { disabled: disabled, readOnly: readOnly, variant: variant };
	
	      return _react2.default.createElement(
	        Root,
	        rootProps,
	        beforeItems,
	        startIcon,
	        prefix,
	        _react2.default.createElement(Control, _extends({}, controlProps, { key: 'control' })),
	        suffix,
	        endIcon,
	        afterItems,
	        _react2.default.createElement(Underlay, underlayProps)
	      );
	    }
	  }]);
	
	  return FauxControl;
	}(_react.Component);
	
	FauxControl.propTypes = {
	  /** Elements to display after iconEnd */
	  afterItems: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Elements to display before iconStart */
	  beforeItems: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Content of control */
	  children: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Component that receives focus */
	  control: typeof React$ComponentType === 'function' ? __webpack_require__(82).instanceOf(React$ComponentType).isRequired : __webpack_require__(82).any.isRequired,
	
	  /** Props applied to the control */
	  controlProps: __webpack_require__(82).object,
	
	  /** Disables the source */
	  disabled: __webpack_require__(82).bool,
	
	  /** ref for the FauxControl */
	  fauxControlRef: __webpack_require__(82).func,
	
	  /** Icon located at the start of the control */
	  iconStart: typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any,
	
	  /** Icon located at the end of the control */
	  iconEnd: typeof React$Element === 'function' ? __webpack_require__(82).instanceOf(React$Element) : __webpack_require__(82).any,
	
	  /** Text to display before control */
	  prefix: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Indicates that the user cannot modify the value of the source */
	  readOnly: __webpack_require__(82).bool,
	
	  /** Available sizes */
	  size: __webpack_require__(82).oneOf(['small', 'medium', 'large', 'jumbo']),
	
	  /** Text to display after control */
	  suffix: typeof React$Node === 'function' ? __webpack_require__(82).instanceOf(React$Node) : __webpack_require__(82).any,
	
	  /** Available variants */
	  variant: __webpack_require__(82).oneOf(['success', 'warning', 'danger'])
	};
	exports.default = FauxControl;

/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _tableHeader = __webpack_require__(362);
	
	var _tableHeader2 = _interopRequireDefault(_tableHeader);
	
	var _tableRow = __webpack_require__(366);
	
	var _tableRow2 = _interopRequireDefault(_tableRow);
	
	__webpack_require__(367);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CampSiteTable = function (_Component) {
	    _inherits(CampSiteTable, _Component);
	
	    function CampSiteTable() {
	        _classCallCheck(this, CampSiteTable);
	
	        return _possibleConstructorReturn(this, (CampSiteTable.__proto__ || Object.getPrototypeOf(CampSiteTable)).apply(this, arguments));
	    }
	
	    _createClass(CampSiteTable, [{
	        key: 'render',
	        value: function render() {
	            var _this2 = this;
	
	            if (this.props.campSiteData.isEmpty()) {
	                return _react2.default.createElement(
	                    'div',
	                    { className: 'loading-container' },
	                    'No sites match your filter.'
	                );
	            }
	
	            var siteRows = this.props.campSiteData.map(function (campsite, idx) {
	                return _react2.default.createElement(_tableRow2.default, { key: idx, campSite: campsite, showOnlyAvailable: _this2.props.showOnlyAvailable });
	            });
	            return _react2.default.createElement(
	                'div',
	                { className: 'site-table-container container-fluid' },
	                _react2.default.createElement(
	                    'table',
	                    { className: 'site-table' },
	                    _react2.default.createElement(_tableHeader2.default, { dates: this.props.dates }),
	                    _react2.default.createElement(
	                        'tbody',
	                        null,
	                        siteRows
	                    )
	                )
	            );
	        }
	    }]);
	
	    return CampSiteTable;
	}(_react.Component);
	
	exports.default = CampSiteTable;
	
	
	CampSiteTable.propTypes = {
	    dates: _react2.default.PropTypes.object.isRequired,
	    campSiteData: _react2.default.PropTypes.object.isRequired
	};

/***/ }),
/* 362 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactAddonsPureRenderMixin = __webpack_require__(363);
	
	var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);
	
	__webpack_require__(364);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TableHeader = function (_React$Component) {
	    _inherits(TableHeader, _React$Component);
	
	    function TableHeader(props) {
	        _classCallCheck(this, TableHeader);
	
	        var _this = _possibleConstructorReturn(this, (TableHeader.__proto__ || Object.getPrototypeOf(TableHeader)).call(this, props));
	
	        _this.shouldComponentUpdate = _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(_this);
	        return _this;
	    }
	
	    _createClass(TableHeader, [{
	        key: 'render',
	        value: function render() {
	            var dateCells = this.props.dates.map(function (date) {
	                return _react2.default.createElement(
	                    'th',
	                    { key: date.format('MMDD'), className: 'status-col' },
	                    date.format('ddd MM/DD')
	                );
	            });
	
	            return _react2.default.createElement(
	                'thead',
	                null,
	                _react2.default.createElement(
	                    'tr',
	                    null,
	                    _react2.default.createElement(
	                        'th',
	                        { className: 'site-col' },
	                        'Site'
	                    ),
	                    dateCells
	                )
	            );
	        }
	    }]);
	
	    return TableHeader;
	}(_react2.default.Component);
	
	exports.default = TableHeader;
	
	
	TableHeader.propTypes = {
	    dates: _react2.default.PropTypes.object.isRequired
	};

/***/ }),
/* 363 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2015-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	var shallowEqual = __webpack_require__(222);
	
	module.exports = {
	  shouldComponentUpdate: function(nextProps, nextState) {
	    return (
	      !shallowEqual(this.props, nextProps) ||
	      !shallowEqual(this.state, nextState)
	    );
	  }
	};


/***/ }),
/* 364 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(365);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!./table-header.css", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!./table-header.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 365 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ }),
/* 366 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactAddonsPureRenderMixin = __webpack_require__(363);
	
	var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TableRow = function (_React$Component) {
	    _inherits(TableRow, _React$Component);
	
	    function TableRow(props) {
	        _classCallCheck(this, TableRow);
	
	        var _this = _possibleConstructorReturn(this, (TableRow.__proto__ || Object.getPrototypeOf(TableRow)).call(this, props));
	
	        _this.shouldComponentUpdate = _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(_this);
	        return _this;
	    }
	
	    _createClass(TableRow, [{
	        key: 'render',
	        value: function render() {
	            var site = this.props.campSite;
	            var statuses = site.get('availability').map(function (status, idx) {
	                return _react2.default.createElement(
	                    'td',
	                    { key: idx, className: 'status-col' },
	                    status.get('status')
	                );
	            });
	
	            if (this.props.showOnlyAvailable && site.get('availability').filter(function (status) {
	                return status.get('status') != "NA";
	            }).size == 0) {
	                return null;
	            }
	            return _react2.default.createElement(
	                'tr',
	                { className: 'site-row' },
	                _react2.default.createElement(
	                    'td',
	                    { className: 'site-col' },
	                    site.get('name') + ' (' + site.get('id') + ')'
	                ),
	                statuses
	            );
	        }
	    }]);
	
	    return TableRow;
	}(_react2.default.Component);
	
	exports.default = TableRow;
	
	
	TableRow.propTypes = {
	    campSite: _react2.default.PropTypes.object.isRequired,
	    showOnlyAvailable: _react2.default.PropTypes.bool
	};

/***/ }),
/* 367 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(368);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!./site-tables.css", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!./site-tables.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 368 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, "table.site-table {\n  border-collapse: collapse;\n  width: 100%;\n  table-layout: fixed;\n  background-color: white;\n  margin-bottom: 1rem;\n}\n\n.site-col {\n  width: 24rem;\n  text-align: left;\n}\n\n.status-col {\n  width: 6rem;\n  text-align: center;\n}\n\n.site-table th,\ntd {\n  border: 1px solid #ddd;\n  padding: 0 5px 0 5px;\n}\n\n.site-table tr:nth-child(even) {\n  background-color: #f2f2f2\n}\n\n.site-table th {\n  background-color: #4CAF50;\n  color: white;\n}\n\ntr.site-row:hover {\n  background-color: yellow;\n}\n", ""]);
	
	// exports


/***/ }),
/* 369 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(370);
	
	var _filterInput = __webpack_require__(351);
	
	var _filterInput2 = _interopRequireDefault(_filterInput);
	
	var _siteTable = __webpack_require__(361);
	
	var _siteTable2 = _interopRequireDefault(_siteTable);
	
	var _calendarControl = __webpack_require__(9);
	
	var _calendarControl2 = _interopRequireDefault(_calendarControl);
	
	var _tableLoadingIndicator = __webpack_require__(372);
	
	var _tableLoadingIndicator2 = _interopRequireDefault(_tableLoadingIndicator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-unused-vars */
	
	/* eslint-enable no-unused-vars */
	
	
	var Site = function (_Component) {
	    _inherits(Site, _Component);
	
	    function Site() {
	        _classCallCheck(this, Site);
	
	        return _possibleConstructorReturn(this, (Site.__proto__ || Object.getPrototypeOf(Site)).apply(this, arguments));
	    }
	
	    _createClass(Site, [{
	        key: 'render',
	        value: function render() {
	            var filterProps = {
	                filterTextFt: this.props.filterTextFt,
	                filterText: this.props.filterText
	            };
	            var tableProps = {
	                dates: this.props.dates,
	                campSiteData: this.props.siteAvailability,
	                showOnlyAvailable: this.props.showOnlyAvailable
	            };
	            var calendarControlProps = {
	                dates: this.props.dates,
	                incrementWeekOffset: this.props.incrementWeekOffset,
	                decrementWeekOffset: this.props.decrementWeekOffset,
	                weekOffset: this.props.weekOffset
	            };
	
	            var siteProps = {
	                dataFetched: this.props.dataFetched
	            };
	
	            var table = void 0;
	            if (siteProps.dataFetched) {
	                table = _react2.default.createElement(_siteTable2.default, tableProps);
	            } else {
	                table = _react2.default.createElement(_tableLoadingIndicator2.default, null);
	            }
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(
	                    'div',
	                    { className: 'container-fluid header-container' },
	                    _react2.default.createElement('div', { className: 'header' }),
	                    _react2.default.createElement('div', { className: 'logo' }),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'controls' },
	                        _react2.default.createElement(_filterInput2.default, filterProps),
	                        _react2.default.createElement(_calendarControl2.default, calendarControlProps),
	                        _react2.default.createElement(
	                            'div',
	                            { className: 'filter-available' },
	                            _react2.default.createElement('input', { type: 'checkbox', label: 'Filter Unavailable', onClick: this.props.toggleAvailable,
	                                value: this.props.showOnlyAvailable }),
	                            _react2.default.createElement(
	                                'p',
	                                null,
	                                'Only sites with availability.'
	                            )
	                        )
	                    )
	                ),
	                table
	            );
	        }
	    }]);
	
	    return Site;
	}(_react.Component);
	
	exports.default = Site;

/***/ }),
/* 370 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(371);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!./site.css", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!./site.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 371 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, "body {\n  /*background-color: black !important;*/\n}\n.header-container {\n  padding-bottom: 1rem;\n}\n.header {\n  background-image: url(/rmnp-background.jpg);\n  min-height: 300px;\n  background-size: cover;\n  margin-top: 1rem;\n}\n.site-table-container {\n  overflow-x: auto;\n}\n.controls {\n  background-color: rgba(0, 0, 0, 0.43);\n  position: absolute;\n  top: 173px;\n  margin-left: 1rem;\n  color: white;\n  width: 66rem;\n}\n.calendar-control,\n.filter-input,\n.cal-control-text,\n.filter-available,\n.filter-available > p {\n  display: inline-block;\n}\n\n.filter-input > .form-group {\n  margin-bottom: -2px;\n}\n\n.filter-available {\n  margin-left: 1rem;\n}\n\n.filter-available > p {\n  margin-left: .5rem;\n}\n", ""]);
	
	// exports


/***/ }),
/* 372 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(373);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TableLoadingIndicator = function (_React$Component) {
	    _inherits(TableLoadingIndicator, _React$Component);
	
	    function TableLoadingIndicator() {
	        _classCallCheck(this, TableLoadingIndicator);
	
	        return _possibleConstructorReturn(this, (TableLoadingIndicator.__proto__ || Object.getPrototypeOf(TableLoadingIndicator)).apply(this, arguments));
	    }
	
	    _createClass(TableLoadingIndicator, [{
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                { className: 'loading-container' },
	                _react2.default.createElement(
	                    'div',
	                    { className: 'loading-message' },
	                    _react2.default.createElement(
	                        'h1',
	                        { className: 'loading-text' },
	                        'Loading campsite data'
	                    ),
	                    _react2.default.createElement('img', { src: '/gears.svg' })
	                )
	            );
	        }
	    }]);
	
	    return TableLoadingIndicator;
	}(_react2.default.Component);
	
	exports.default = TableLoadingIndicator;

/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(374);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(100)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js!./table-loading-indicator.css", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js!./table-loading-indicator.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(99)(false);
	// imports
	
	
	// module
	exports.push([module.id, ".loading-container {\n    display: flex;\n    justify-content: center;\n}\n\n.loading-message {\n    padding: 0.5rem 1rem 0 1rem;\n    background-color: white;\n}\n\nh1.loading-text {\n    display: inline-block;\n}\n\n.loading-message img {\n    height: 50px;\n    margin-bottom: 25px;\n}", ""]);
	
	// exports


/***/ }),
/* 375 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SiteContainer = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRedux = __webpack_require__(376);
	
	var _site = __webpack_require__(369);
	
	var _site2 = _interopRequireDefault(_site);
	
	var _campsiteActions = __webpack_require__(1);
	
	var _campsiteReducer = __webpack_require__(405);
	
	var _index = __webpack_require__(530);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable no-unused-vars */
	
	/* eslint-enable no-unused-vars */
	
	
	var SiteContainer = exports.SiteContainer = function (_Component) {
	    _inherits(SiteContainer, _Component);
	
	    function SiteContainer() {
	        _classCallCheck(this, SiteContainer);
	
	        return _possibleConstructorReturn(this, (SiteContainer.__proto__ || Object.getPrototypeOf(SiteContainer)).apply(this, arguments));
	    }
	
	    _createClass(SiteContainer, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.props.fetchSiteData();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(_site2.default, this.props);
	        }
	    }]);
	
	    return SiteContainer;
	}(_react.Component);
	
	function mapStateToProps(state) {
	    state = state[_index.campSiteKey];
	
	    var weekOffset = (0, _campsiteReducer.getWeekOffset)(state);
	
	    return {
	        filterText: (0, _campsiteReducer.getFilterText)(state),
	        dates: (0, _campsiteReducer.getDates)(state),
	        siteAvailability: (0, _campsiteReducer.getSiteAvailability)(state, weekOffset * 7),
	        showOnlyAvailable: (0, _campsiteReducer.getShouldShowOnlyAvailable)(state),
	        dataFetched: (0, _campsiteReducer.getDataFetched)(state),
	        weekOffset: weekOffset
	    };
	}
	
	function mapDispatchToProps(dispatch) {
	    return {
	        fetchSiteData: function fetchSiteData() {
	            return dispatch((0, _campsiteActions.fetchSiteData)());
	        },
	        filterTextFt: function filterTextFt(text) {
	            return dispatch((0, _campsiteActions.updateFilterText)(text));
	        },
	        incrementWeekOffset: function incrementWeekOffset() {
	            return dispatch((0, _campsiteActions.incrementWeekOffset)());
	        },
	        decrementWeekOffset: function decrementWeekOffset() {
	            return dispatch((0, _campsiteActions.decrementWeekOffset)());
	        },
	        toggleAvailable: function toggleAvailable() {
	            return dispatch((0, _campsiteActions.toggleAvailable)());
	        }
	    };
	}
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SiteContainer);

/***/ }),
/* 376 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.connect = exports.Provider = undefined;
	
	var _Provider = __webpack_require__(377);
	
	var _Provider2 = _interopRequireDefault(_Provider);
	
	var _connect = __webpack_require__(380);
	
	var _connect2 = _interopRequireDefault(_connect);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	exports.Provider = _Provider2["default"];
	exports.connect = _connect2["default"];

/***/ }),
/* 377 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports["default"] = undefined;
	
	var _react = __webpack_require__(10);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	var _storeShape = __webpack_require__(378);
	
	var _storeShape2 = _interopRequireDefault(_storeShape);
	
	var _warning = __webpack_require__(379);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var didWarnAboutReceivingStore = false;
	function warnAboutReceivingStore() {
	  if (didWarnAboutReceivingStore) {
	    return;
	  }
	  didWarnAboutReceivingStore = true;
	
	  (0, _warning2["default"])('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
	}
	
	var Provider = function (_Component) {
	  _inherits(Provider, _Component);
	
	  Provider.prototype.getChildContext = function getChildContext() {
	    return { store: this.store };
	  };
	
	  function Provider(props, context) {
	    _classCallCheck(this, Provider);
	
	    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
	
	    _this.store = props.store;
	    return _this;
	  }
	
	  Provider.prototype.render = function render() {
	    return _react.Children.only(this.props.children);
	  };
	
	  return Provider;
	}(_react.Component);
	
	exports["default"] = Provider;
	
	
	if (process.env.NODE_ENV !== 'production') {
	  Provider.prototype.componentWillReceiveProps = function (nextProps) {
	    var store = this.store;
	    var nextStore = nextProps.store;
	
	
	    if (store !== nextStore) {
	      warnAboutReceivingStore();
	    }
	  };
	}
	
	Provider.propTypes = {
	  store: _storeShape2["default"].isRequired,
	  children: _propTypes2["default"].element.isRequired
	};
	Provider.childContextTypes = {
	  store: _storeShape2["default"].isRequired
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 378 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	exports["default"] = _propTypes2["default"].shape({
	  subscribe: _propTypes2["default"].func.isRequired,
	  dispatch: _propTypes2["default"].func.isRequired,
	  getState: _propTypes2["default"].func.isRequired
	});

/***/ }),
/* 379 */
/***/ (function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports["default"] = warning;
	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */
	}

/***/ }),
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports["default"] = connect;
	
	var _react = __webpack_require__(10);
	
	var _storeShape = __webpack_require__(378);
	
	var _storeShape2 = _interopRequireDefault(_storeShape);
	
	var _shallowEqual = __webpack_require__(381);
	
	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);
	
	var _wrapActionCreators = __webpack_require__(382);
	
	var _wrapActionCreators2 = _interopRequireDefault(_wrapActionCreators);
	
	var _warning = __webpack_require__(379);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var _isPlainObject = __webpack_require__(385);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _hoistNonReactStatics = __webpack_require__(403);
	
	var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);
	
	var _invariant = __webpack_require__(404);
	
	var _invariant2 = _interopRequireDefault(_invariant);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var defaultMapStateToProps = function defaultMapStateToProps(state) {
	  return {};
	}; // eslint-disable-line no-unused-vars
	var defaultMapDispatchToProps = function defaultMapDispatchToProps(dispatch) {
	  return { dispatch: dispatch };
	};
	var defaultMergeProps = function defaultMergeProps(stateProps, dispatchProps, parentProps) {
	  return _extends({}, parentProps, stateProps, dispatchProps);
	};
	
	function getDisplayName(WrappedComponent) {
	  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}
	
	var errorObject = { value: null };
	function tryCatch(fn, ctx) {
	  try {
	    return fn.apply(ctx);
	  } catch (e) {
	    errorObject.value = e;
	    return errorObject;
	  }
	}
	
	// Helps track hot reloading.
	var nextVersion = 0;
	
	function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
	  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	
	  var shouldSubscribe = Boolean(mapStateToProps);
	  var mapState = mapStateToProps || defaultMapStateToProps;
	
	  var mapDispatch = void 0;
	  if (typeof mapDispatchToProps === 'function') {
	    mapDispatch = mapDispatchToProps;
	  } else if (!mapDispatchToProps) {
	    mapDispatch = defaultMapDispatchToProps;
	  } else {
	    mapDispatch = (0, _wrapActionCreators2["default"])(mapDispatchToProps);
	  }
	
	  var finalMergeProps = mergeProps || defaultMergeProps;
	  var _options$pure = options.pure,
	      pure = _options$pure === undefined ? true : _options$pure,
	      _options$withRef = options.withRef,
	      withRef = _options$withRef === undefined ? false : _options$withRef;
	
	  var checkMergedEquals = pure && finalMergeProps !== defaultMergeProps;
	
	  // Helps track hot reloading.
	  var version = nextVersion++;
	
	  return function wrapWithConnect(WrappedComponent) {
	    var connectDisplayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';
	
	    function checkStateShape(props, methodName) {
	      if (!(0, _isPlainObject2["default"])(props)) {
	        (0, _warning2["default"])(methodName + '() in ' + connectDisplayName + ' must return a plain object. ' + ('Instead received ' + props + '.'));
	      }
	    }
	
	    function computeMergedProps(stateProps, dispatchProps, parentProps) {
	      var mergedProps = finalMergeProps(stateProps, dispatchProps, parentProps);
	      if (process.env.NODE_ENV !== 'production') {
	        checkStateShape(mergedProps, 'mergeProps');
	      }
	      return mergedProps;
	    }
	
	    var Connect = function (_Component) {
	      _inherits(Connect, _Component);
	
	      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
	        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged;
	      };
	
	      function Connect(props, context) {
	        _classCallCheck(this, Connect);
	
	        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));
	
	        _this.version = version;
	        _this.store = props.store || context.store;
	
	        (0, _invariant2["default"])(_this.store, 'Could not find "store" in either the context or ' + ('props of "' + connectDisplayName + '". ') + 'Either wrap the root component in a <Provider>, ' + ('or explicitly pass "store" as a prop to "' + connectDisplayName + '".'));
	
	        var storeState = _this.store.getState();
	        _this.state = { storeState: storeState };
	        _this.clearCache();
	        return _this;
	      }
	
	      Connect.prototype.computeStateProps = function computeStateProps(store, props) {
	        if (!this.finalMapStateToProps) {
	          return this.configureFinalMapState(store, props);
	        }
	
	        var state = store.getState();
	        var stateProps = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(state, props) : this.finalMapStateToProps(state);
	
	        if (process.env.NODE_ENV !== 'production') {
	          checkStateShape(stateProps, 'mapStateToProps');
	        }
	        return stateProps;
	      };
	
	      Connect.prototype.configureFinalMapState = function configureFinalMapState(store, props) {
	        var mappedState = mapState(store.getState(), props);
	        var isFactory = typeof mappedState === 'function';
	
	        this.finalMapStateToProps = isFactory ? mappedState : mapState;
	        this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1;
	
	        if (isFactory) {
	          return this.computeStateProps(store, props);
	        }
	
	        if (process.env.NODE_ENV !== 'production') {
	          checkStateShape(mappedState, 'mapStateToProps');
	        }
	        return mappedState;
	      };
	
	      Connect.prototype.computeDispatchProps = function computeDispatchProps(store, props) {
	        if (!this.finalMapDispatchToProps) {
	          return this.configureFinalMapDispatch(store, props);
	        }
	
	        var dispatch = store.dispatch;
	
	        var dispatchProps = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(dispatch, props) : this.finalMapDispatchToProps(dispatch);
	
	        if (process.env.NODE_ENV !== 'production') {
	          checkStateShape(dispatchProps, 'mapDispatchToProps');
	        }
	        return dispatchProps;
	      };
	
	      Connect.prototype.configureFinalMapDispatch = function configureFinalMapDispatch(store, props) {
	        var mappedDispatch = mapDispatch(store.dispatch, props);
	        var isFactory = typeof mappedDispatch === 'function';
	
	        this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch;
	        this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1;
	
	        if (isFactory) {
	          return this.computeDispatchProps(store, props);
	        }
	
	        if (process.env.NODE_ENV !== 'production') {
	          checkStateShape(mappedDispatch, 'mapDispatchToProps');
	        }
	        return mappedDispatch;
	      };
	
	      Connect.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
	        var nextStateProps = this.computeStateProps(this.store, this.props);
	        if (this.stateProps && (0, _shallowEqual2["default"])(nextStateProps, this.stateProps)) {
	          return false;
	        }
	
	        this.stateProps = nextStateProps;
	        return true;
	      };
	
	      Connect.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
	        var nextDispatchProps = this.computeDispatchProps(this.store, this.props);
	        if (this.dispatchProps && (0, _shallowEqual2["default"])(nextDispatchProps, this.dispatchProps)) {
	          return false;
	        }
	
	        this.dispatchProps = nextDispatchProps;
	        return true;
	      };
	
	      Connect.prototype.updateMergedPropsIfNeeded = function updateMergedPropsIfNeeded() {
	        var nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props);
	        if (this.mergedProps && checkMergedEquals && (0, _shallowEqual2["default"])(nextMergedProps, this.mergedProps)) {
	          return false;
	        }
	
	        this.mergedProps = nextMergedProps;
	        return true;
	      };
	
	      Connect.prototype.isSubscribed = function isSubscribed() {
	        return typeof this.unsubscribe === 'function';
	      };
	
	      Connect.prototype.trySubscribe = function trySubscribe() {
	        if (shouldSubscribe && !this.unsubscribe) {
	          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this));
	          this.handleChange();
	        }
	      };
	
	      Connect.prototype.tryUnsubscribe = function tryUnsubscribe() {
	        if (this.unsubscribe) {
	          this.unsubscribe();
	          this.unsubscribe = null;
	        }
	      };
	
	      Connect.prototype.componentDidMount = function componentDidMount() {
	        this.trySubscribe();
	      };
	
	      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	        if (!pure || !(0, _shallowEqual2["default"])(nextProps, this.props)) {
	          this.haveOwnPropsChanged = true;
	        }
	      };
	
	      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
	        this.tryUnsubscribe();
	        this.clearCache();
	      };
	
	      Connect.prototype.clearCache = function clearCache() {
	        this.dispatchProps = null;
	        this.stateProps = null;
	        this.mergedProps = null;
	        this.haveOwnPropsChanged = true;
	        this.hasStoreStateChanged = true;
	        this.haveStatePropsBeenPrecalculated = false;
	        this.statePropsPrecalculationError = null;
	        this.renderedElement = null;
	        this.finalMapDispatchToProps = null;
	        this.finalMapStateToProps = null;
	      };
	
	      Connect.prototype.handleChange = function handleChange() {
	        if (!this.unsubscribe) {
	          return;
	        }
	
	        var storeState = this.store.getState();
	        var prevStoreState = this.state.storeState;
	        if (pure && prevStoreState === storeState) {
	          return;
	        }
	
	        if (pure && !this.doStatePropsDependOnOwnProps) {
	          var haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this);
	          if (!haveStatePropsChanged) {
	            return;
	          }
	          if (haveStatePropsChanged === errorObject) {
	            this.statePropsPrecalculationError = errorObject.value;
	          }
	          this.haveStatePropsBeenPrecalculated = true;
	        }
	
	        this.hasStoreStateChanged = true;
	        this.setState({ storeState: storeState });
	      };
	
	      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
	        (0, _invariant2["default"])(withRef, 'To access the wrapped instance, you need to specify ' + '{ withRef: true } as the fourth argument of the connect() call.');
	
	        return this.refs.wrappedInstance;
	      };
	
	      Connect.prototype.render = function render() {
	        var haveOwnPropsChanged = this.haveOwnPropsChanged,
	            hasStoreStateChanged = this.hasStoreStateChanged,
	            haveStatePropsBeenPrecalculated = this.haveStatePropsBeenPrecalculated,
	            statePropsPrecalculationError = this.statePropsPrecalculationError,
	            renderedElement = this.renderedElement;
	
	
	        this.haveOwnPropsChanged = false;
	        this.hasStoreStateChanged = false;
	        this.haveStatePropsBeenPrecalculated = false;
	        this.statePropsPrecalculationError = null;
	
	        if (statePropsPrecalculationError) {
	          throw statePropsPrecalculationError;
	        }
	
	        var shouldUpdateStateProps = true;
	        var shouldUpdateDispatchProps = true;
	        if (pure && renderedElement) {
	          shouldUpdateStateProps = hasStoreStateChanged || haveOwnPropsChanged && this.doStatePropsDependOnOwnProps;
	          shouldUpdateDispatchProps = haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps;
	        }
	
	        var haveStatePropsChanged = false;
	        var haveDispatchPropsChanged = false;
	        if (haveStatePropsBeenPrecalculated) {
	          haveStatePropsChanged = true;
	        } else if (shouldUpdateStateProps) {
	          haveStatePropsChanged = this.updateStatePropsIfNeeded();
	        }
	        if (shouldUpdateDispatchProps) {
	          haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded();
	        }
	
	        var haveMergedPropsChanged = true;
	        if (haveStatePropsChanged || haveDispatchPropsChanged || haveOwnPropsChanged) {
	          haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
	        } else {
	          haveMergedPropsChanged = false;
	        }
	
	        if (!haveMergedPropsChanged && renderedElement) {
	          return renderedElement;
	        }
	
	        if (withRef) {
	          this.renderedElement = (0, _react.createElement)(WrappedComponent, _extends({}, this.mergedProps, {
	            ref: 'wrappedInstance'
	          }));
	        } else {
	          this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps);
	        }
	
	        return this.renderedElement;
	      };
	
	      return Connect;
	    }(_react.Component);
	
	    Connect.displayName = connectDisplayName;
	    Connect.WrappedComponent = WrappedComponent;
	    Connect.contextTypes = {
	      store: _storeShape2["default"]
	    };
	    Connect.propTypes = {
	      store: _storeShape2["default"]
	    };
	
	    if (process.env.NODE_ENV !== 'production') {
	      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
	        if (this.version === version) {
	          return;
	        }
	
	        // We are hot reloading!
	        this.version = version;
	        this.trySubscribe();
	        this.clearCache();
	      };
	    }
	
	    return (0, _hoistNonReactStatics2["default"])(Connect, WrappedComponent);
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 381 */
/***/ (function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = shallowEqual;
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }
	
	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);
	
	  if (keysA.length !== keysB.length) {
	    return false;
	  }
	
	  // Test for A's keys different from B.
	  var hasOwn = Object.prototype.hasOwnProperty;
	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }
	
	  return true;
	}

/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports["default"] = wrapActionCreators;
	
	var _redux = __webpack_require__(383);
	
	function wrapActionCreators(actionCreators) {
	  return function (dispatch) {
	    return (0, _redux.bindActionCreators)(actionCreators, dispatch);
	  };
	}

/***/ }),
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    (global.hoistNonReactStatics = factory());
	}(this, (function () {
	    'use strict';
	    
	    var REACT_STATICS = {
	        childContextTypes: true,
	        contextTypes: true,
	        defaultProps: true,
	        displayName: true,
	        getDefaultProps: true,
	        getDerivedStateFromProps: true,
	        mixins: true,
	        propTypes: true,
	        type: true
	    };
	    
	    var KNOWN_STATICS = {
	        name: true,
	        length: true,
	        prototype: true,
	        caller: true,
	        callee: true,
	        arguments: true,
	        arity: true
	    };
	    
	    var defineProperty = Object.defineProperty;
	    var getOwnPropertyNames = Object.getOwnPropertyNames;
	    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	    var getPrototypeOf = Object.getPrototypeOf;
	    var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
	    
	    return function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
	        if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
	            
	            if (objectPrototype) {
	                var inheritedComponent = getPrototypeOf(sourceComponent);
	                if (inheritedComponent && inheritedComponent !== objectPrototype) {
	                    hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
	                }
	            }
	            
	            var keys = getOwnPropertyNames(sourceComponent);
	            
	            if (getOwnPropertySymbols) {
	                keys = keys.concat(getOwnPropertySymbols(sourceComponent));
	            }
	            
	            for (var i = 0; i < keys.length; ++i) {
	                var key = keys[i];
	                if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
	                    var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
	                    try { // Avoid failures from read-only properties
	                        defineProperty(targetComponent, key, descriptor);
	                    } catch (e) {}
	                }
	            }
	            
	            return targetComponent;
	        }
	        
	        return targetComponent;
	    };
	})));


/***/ }),
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 405 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.initialState = undefined;
	exports.getFilterText = getFilterText;
	exports.getSiteAvailability = getSiteAvailability;
	exports.getDates = getDates;
	exports.getWeekOffset = getWeekOffset;
	exports.getShouldShowOnlyAvailable = getShouldShowOnlyAvailable;
	exports.getDataFetched = getDataFetched;
	exports.campSiteReducer = campSiteReducer;
	
	var _immutable = __webpack_require__(7);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _moment = __webpack_require__(406);
	
	var _moment2 = _interopRequireDefault(_moment);
	
	var _campsiteActions = __webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var initialState = exports.initialState = _immutable2.default.fromJS({
	    campsiteData: [],
	    allDates: [],
	    selectedDates: [],
	    filterText: '',
	    weekOffset: 0,
	    showOnlyAvailable: false,
	    dataFetched: false
	});
	
	function getFilterText(state) {
	    return state.get('filterText');
	}
	
	function getSiteAvailability(state, offset) {
	    var filteredSites = state.get('campsiteData').filter(function (site) {
	        return site.get('name').toUpperCase().includes(getFilterText(state).toUpperCase());
	    });
	
	    return filteredSites.map(function (site) {
	        var filteredStatus = site.get('availability').skip(offset).take(7);
	        return site.set('availability', filteredStatus);
	    });
	}
	
	function getDates(state) {
	    return state.get('allDates').skip(getWeekOffset(state) * 7).take(7);
	}
	
	function getWeekOffset(state) {
	    return state.get('weekOffset');
	}
	
	function getShouldShowOnlyAvailable(state) {
	    return state.get('showOnlyAvailable');
	}
	
	function getDataFetched(state) {
	    return state.get('dataFetched');
	}
	
	function campSiteReducer() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
	    switch (action.type) {
	        case _campsiteActions.TOGGLE_AVAILABLE:
	            {
	                return state.set('showOnlyAvailable', !state.get('showOnlyAvailable'));
	            }
	        case _campsiteActions.DECREMENT_WEEK_OFFSET:
	            {
	                var current = state.get('weekOffset');
	                if (current >= 1) {
	                    return state.set('weekOffset', current - 1);
	                } else {
	                    return state;
	                }
	            }
	        case _campsiteActions.INCREMENT_WEEK_OFFSET:
	            return state.set('weekOffset', state.get('weekOffset') + 1);
	        case _campsiteActions.FETCHED_SITE_DATA:
	            {
	                var sites = action.payload.get('sites');
	                var lastUpdated = action.payload.get('lastUpdated');
	                /*
	                 normalize the dates to moment objects and sort them.
	                 */
	                var allDates = sites.get(0).get('availability').map(function (date) {
	                    return (0, _moment2.default)(date, 'M/D/YYYY');
	                });
	                var campSiteData = sites.sort();
	                return state.set('campsiteData', campSiteData).set('allDates', allDates).set('lastUpdated', lastUpdated).set('dataFetched', true);
	            }
	        case _campsiteActions.FILTER_TEXT_CHANGED:
	            return state.set('filterText', action.payload);
	
	        default:
	            return state;
	    }
	}

/***/ }),
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */,
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */,
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */,
/* 530 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.errorKey = exports.campSiteKey = undefined;
	
	var _redux = __webpack_require__(383);
	
	var _campsiteReducer = __webpack_require__(405);
	
	var _errorReducer = __webpack_require__(531);
	
	var campSiteKey = exports.campSiteKey = 'campsite'; /*eslint no-unused-vars:0 */
	var errorKey = exports.errorKey = 'error';
	
	var reducerConfig = {
	    'campsite': _campsiteReducer.campSiteReducer,
	    'error': _errorReducer.errorReducer
	};
	
	exports.default = (0, _redux.combineReducers)(reducerConfig);

/***/ }),
/* 531 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.initialState = undefined;
	exports.errorReducer = errorReducer;
	
	var _immutable = __webpack_require__(7);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _errorActions = __webpack_require__(8);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var initialState = exports.initialState = _immutable2.default.fromJS({
	    hasError: false,
	    errorMessage: ''
	});
	
	function errorReducer() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
	    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	
	    switch (action.type) {
	        case _errorActions.FETCH_ERROR:
	            return state.set('errorMessage', action.payload).set('hasError', true);
	        case _errorActions.CLEAR_ERROR:
	            return state.set('errorMessage', '').set('hasError', false);
	        default:
	            return state;
	    }
	}

/***/ }),
/* 532 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(135);
	
	var _siteContainer = __webpack_require__(375);
	
	var _siteContainer2 = _interopRequireDefault(_siteContainer);
	
	var _reducers = __webpack_require__(530);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var _reduxThunk = __webpack_require__(533);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _reactRedux = __webpack_require__(376);
	
	var _redux = __webpack_require__(383);
	
	var _themes = __webpack_require__(290);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint-disable no-unused-vars */
	var logger = function logger(store) {
	    return function (next) {
	        return function (action) {
	            /* eslint-disable no-console */
	            console.log('dispatching', action);
	            var result = next(action);
	            console.log('next state', store.getState()['campsite'].toJS());
	            /* eslint-enable no-console */
	            return result;
	        };
	    };
	};
	/* eslint-enable no-unused-vars */
	
	
	var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2.default, // lets us dispatch() functions
	logger // neat middleware that logs actions
	)(_redux.createStore);
	
	var store = createStoreWithMiddleware(_reducers2.default);
	
	(0, _reactDom.render)(_react2.default.createElement(
	    _reactRedux.Provider,
	    { store: store },
	    _react2.default.createElement(
	        _themes.ThemeProvider,
	        null,
	        _react2.default.createElement(_siteContainer2.default, null)
	    )
	), document.getElementById('root'));

/***/ }),
/* 533 */
/***/ (function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }
	
	        return next(action);
	      };
	    };
	  };
	}
	
	var thunk = createThunkMiddleware();
	thunk.withExtraArgument = createThunkMiddleware;
	
	exports['default'] = thunk;

/***/ }),
/* 534 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsx = function () { var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7; return function createRawReactElement(type, props, key, children) { var defaultProps = type && type.defaultProps; var childrenLength = arguments.length - 3; if (!props && childrenLength !== 0) { props = {}; } if (props && defaultProps) { for (var propName in defaultProps) { if (props[propName] === void 0) { props[propName] = defaultProps[propName]; } } } else if (!props) { props = defaultProps || {}; } if (childrenLength === 1) { props.children = children; } else if (childrenLength > 1) { var childArray = Array(childrenLength); for (var i = 0; i < childrenLength; i++) { childArray[i] = arguments[i + 3]; } props.children = childArray; } return { $$typeof: REACT_ELEMENT_TYPE, type: type, key: key === undefined ? null : '' + key, ref: null, props: props, _owner: null }; }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = IconDateRange;
	
	var _react = __webpack_require__(10);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Icon = __webpack_require__(90);
	
	var _Icon2 = _interopRequireDefault(_Icon);
	
	var _propTypes = __webpack_require__(82);
	
	var _propTypes2 = _interopRequireDefault(_propTypes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _ref = _jsx('g', {}, void 0, _jsx('path', {
	  d: 'M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z'
	}));
	
	/* eslint-disable prettier/prettier */
	function IconDateRange(props) {
	  var iconProps = _extends({
	    rtl: false
	  }, props);
	
	  return _react2.default.createElement(
	    _Icon2.default,
	    iconProps,
	    _ref
	  );
	}
	
	IconDateRange.propTypes = {
	  size: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.oneOf(['small']), _propTypes2.default.oneOf(['medium']), _propTypes2.default.oneOf(['large'])]),
	  color: _propTypes2.default.string,
	  rtl: _propTypes2.default.bool,
	  title: _propTypes2.default.string
	};
	IconDateRange.displayName = 'IconDateRange';
	IconDateRange.category = 'action';

/***/ })
]);
//# sourceMappingURL=bundle.js.map