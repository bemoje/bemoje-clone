(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@bemoje/is-array'), require('@bemoje/type-of')) :
	typeof define === 'function' && define.amd ? define(['@bemoje/is-array', '@bemoje/type-of'], factory) :
	(global = global || self, global.clone = factory(global.isArray, global.typeOf));
}(this, (function (isArray, typeOf) { 'use strict';

	isArray = isArray && Object.prototype.hasOwnProperty.call(isArray, 'default') ? isArray['default'] : isArray;
	typeOf = typeOf && Object.prototype.hasOwnProperty.call(typeOf, 'default') ? typeOf['default'] : typeOf;

	/**
	 * Deep and shallow clone.
	 * Merged forks of https://github.com/jonschlinkert/shallow-clone and https://github.com/jonschlinkert/clone-deep.
	 * @param {*} value - The value to clone
	 * @param {boolean} [deep=false] - Whether or not to do a deep clone
	 * @param {boolean} [instanceClone=true] - Whether or not to deep clone custom objects.
	 */
	function clone(value, deep = false, instanceClone = true) {
		if (deep) {
			return clone.deep(value, instanceClone)
		}

		const type = typeOf(value);

		if (typeof clone[type] === 'function') {
			return clone[type](value)
		}

		return cloneDefault(value)
	}

	/**
	 * Shallow clone an array.
	 * @param {Array} arr
	 * @returns {Array}
	 */
	clone.Array = function (arr) {
		return arr.slice()
	};

	/**
	 * Shallow clone an object.
	 * @param {object} obj
	 * @returns {object}
	 */
	clone.Object = function (obj) {
		return Object.assign({}, obj)
	};

	/**
	 * Shallow clone a Date-object.
	 * @param {Date} date
	 * @returns {Date}
	 */
	clone.Date = function (date) {
		return new date.constructor(Number(date))
	};

	/**
	 * Shallow clone a Map object.
	 * @param {Map} map
	 * @returns {Map}
	 */
	clone.Map = function (map) {
		return new Map(map)
	};

	/**
	 * Shallow clone a Set.
	 * @param {Set} set
	 * @returns {Set}
	 */
	clone.Set = function (set) {
		return new Set(set)
	};

	/**
	 * Shallow clone an Error object.
	 * @param {Error} err
	 * @returns {Error}
	 */
	clone.Error = function (err) {
		return Object.create(err)
	};

	/**
	 * Shallow clone an RegExp object.
	 * @param {RegExp} regex
	 * @returns {RegExp}
	 */
	clone.RegExp = function (regex) {
		const flags =
			regex.flags !== void 0 ? regex.flags : /\w+$/.exec(regex) || void 0;
		const ret = new regex.constructor(regex.source, flags);
		ret.lastIndex = regex.lastIndex;
		return ret
	};

	/**
	 * Shallow clone an ArrayBuffer.
	 * @param {ArrayBuffer} arrBuf
	 * @returns {ArrayBuffer}
	 */
	clone.ArrayBuffer = function (arrBuf) {
		const res = new arrBuf.constructor(arrBuf.byteLength);
		new Uint8Array(res).set(new Uint8Array(arrBuf));
		return res
	};

	/**
	 * Shallow clone a TypedArray
	 * @param {TypedArray} arrTyped
	 * @returns {TypedArray}
	 */
	clone.TypedArray = function (arrTyped) {
		return new arrTyped.constructor(
			arrTyped.buffer,
			arrTyped.byteOffset,
			arrTyped.length,
		)
	};

	/**
	 * Shallow clone a Buffer.
	 * @param {Buffer} buf
	 * @returns {Buffer}
	 */
	clone.Buffer = function (buf) {
		const len = buf.length;
		const ret = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
		ret.copy(buf);
		return ret
	};

	/**
	 * Shallow clone a Symbol.
	 * @param {Symbol} sym
	 * @returns {Symbol}
	 */
	clone.Symbol = function (sym) {
		return Object(Symbol.prototype.valueOf.call(sym))
	};

	/**
	 * Deep clone a value
	 * @param {*} value - The value to clone.
	 * @param {boolean} [instanceClone=true] - Whether or not to deep clone custom objects.
	 * @returns {*}
	 */
	clone.deep = function (value, instanceClone = true) {
		if (typeof value === 'object') {
			if (isArray(value)) {
				return cloneArrayDeep(value, instanceClone)
			}

			return cloneObjectDeep(value, instanceClone)
		}

		return clone(value)
	};

	function cloneObjectDeep(value, instanceClone) {
		if (typeof instanceClone === 'function') {
			return instanceClone(value)
		}
		if (instanceClone || isPlainObject(value)) {
			const res = new value.constructor();
			for (let key in value) {
				res[key] = clone.deep(value[key], instanceClone);
			}
			return res
		}
		return value
	}

	function cloneArrayDeep(value, instanceClone) {
		const res = new value.constructor(value.length);
		for (let i = 0; i < value.length; i++) {
			res[i] = clone.deep(value[i], instanceClone);
		}
		return res
	}

	function cloneDefault(value) {
		if (typeof value.clone === 'function') {
			return value.clone()
		}

		return value
	}

	return clone;

})));
