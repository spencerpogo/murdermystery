/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.murdermystery = (function() {

    /**
     * Namespace murdermystery.
     * @exports murdermystery
     * @namespace
     */
    var murdermystery = {};

    murdermystery.Handshake = (function() {

        /**
         * Properties of a Handshake.
         * @memberof murdermystery
         * @interface IHandshake
         * @property {string|null} [error] Handshake error
         */

        /**
         * Constructs a new Handshake.
         * @memberof murdermystery
         * @classdesc Represents a Handshake.
         * @implements IHandshake
         * @constructor
         * @param {murdermystery.IHandshake=} [properties] Properties to set
         */
        function Handshake(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Handshake error.
         * @member {string} error
         * @memberof murdermystery.Handshake
         * @instance
         */
        Handshake.prototype.error = "";

        /**
         * Creates a new Handshake instance using the specified properties.
         * @function create
         * @memberof murdermystery.Handshake
         * @static
         * @param {murdermystery.IHandshake=} [properties] Properties to set
         * @returns {murdermystery.Handshake} Handshake instance
         */
        Handshake.create = function create(properties) {
            return new Handshake(properties);
        };

        /**
         * Encodes the specified Handshake message. Does not implicitly {@link murdermystery.Handshake.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.Handshake
         * @static
         * @param {murdermystery.IHandshake} message Handshake message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Handshake.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.error);
            return writer;
        };

        /**
         * Encodes the specified Handshake message, length delimited. Does not implicitly {@link murdermystery.Handshake.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.Handshake
         * @static
         * @param {murdermystery.IHandshake} message Handshake message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Handshake.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Handshake message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.Handshake
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.Handshake} Handshake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Handshake.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.Handshake();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.error = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Handshake message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.Handshake
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.Handshake} Handshake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Handshake.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Handshake message.
         * @function verify
         * @memberof murdermystery.Handshake
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Handshake.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            return null;
        };

        /**
         * Creates a Handshake message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.Handshake
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.Handshake} Handshake
         */
        Handshake.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.Handshake)
                return object;
            var message = new $root.murdermystery.Handshake();
            if (object.error != null)
                message.error = String(object.error);
            return message;
        };

        /**
         * Creates a plain object from a Handshake message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.Handshake
         * @static
         * @param {murdermystery.Handshake} message Handshake
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Handshake.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.error = "";
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            return object;
        };

        /**
         * Converts this Handshake to JSON.
         * @function toJSON
         * @memberof murdermystery.Handshake
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Handshake.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Handshake;
    })();

    return murdermystery;
})();

module.exports = $root;
