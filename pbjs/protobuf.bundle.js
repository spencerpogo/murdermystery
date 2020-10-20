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
         * @property {murdermystery.Handshake.Error|null} [err] Handshake err
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
         * Handshake err.
         * @member {murdermystery.Handshake.Error} err
         * @memberof murdermystery.Handshake
         * @instance
         */
        Handshake.prototype.err = 0;

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
            if (message.err != null && Object.hasOwnProperty.call(message, "err"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.err);
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
                    message.err = reader.int32();
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
            if (message.err != null && message.hasOwnProperty("err"))
                switch (message.err) {
                default:
                    return "err: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
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
            switch (object.err) {
            case "UNKNOWN":
            case 0:
                message.err = 0;
                break;
            case "OK":
            case 1:
                message.err = 1;
                break;
            case "STARTED":
            case 2:
                message.err = 2;
                break;
            }
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
                object.err = options.enums === String ? "UNKNOWN" : 0;
            if (message.err != null && message.hasOwnProperty("err"))
                object.err = options.enums === String ? $root.murdermystery.Handshake.Error[message.err] : message.err;
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

        /**
         * Error enum.
         * @name murdermystery.Handshake.Error
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} OK=1 OK value
         * @property {number} STARTED=2 STARTED value
         */
        Handshake.Error = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "OK"] = 1;
            values[valuesById[2] = "STARTED"] = 2;
            return values;
        })();

        return Handshake;
    })();

    murdermystery.Host = (function() {

        /**
         * Properties of a Host.
         * @memberof murdermystery
         * @interface IHost
         * @property {boolean|null} [isHost] Host isHost
         */

        /**
         * Constructs a new Host.
         * @memberof murdermystery
         * @classdesc Represents a Host.
         * @implements IHost
         * @constructor
         * @param {murdermystery.IHost=} [properties] Properties to set
         */
        function Host(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Host isHost.
         * @member {boolean} isHost
         * @memberof murdermystery.Host
         * @instance
         */
        Host.prototype.isHost = false;

        /**
         * Creates a new Host instance using the specified properties.
         * @function create
         * @memberof murdermystery.Host
         * @static
         * @param {murdermystery.IHost=} [properties] Properties to set
         * @returns {murdermystery.Host} Host instance
         */
        Host.create = function create(properties) {
            return new Host(properties);
        };

        /**
         * Encodes the specified Host message. Does not implicitly {@link murdermystery.Host.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.Host
         * @static
         * @param {murdermystery.IHost} message Host message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Host.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.isHost != null && Object.hasOwnProperty.call(message, "isHost"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isHost);
            return writer;
        };

        /**
         * Encodes the specified Host message, length delimited. Does not implicitly {@link murdermystery.Host.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.Host
         * @static
         * @param {murdermystery.IHost} message Host message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Host.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Host message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.Host
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.Host} Host
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Host.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.Host();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.isHost = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Host message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.Host
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.Host} Host
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Host.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Host message.
         * @function verify
         * @memberof murdermystery.Host
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Host.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.isHost != null && message.hasOwnProperty("isHost"))
                if (typeof message.isHost !== "boolean")
                    return "isHost: boolean expected";
            return null;
        };

        /**
         * Creates a Host message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.Host
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.Host} Host
         */
        Host.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.Host)
                return object;
            var message = new $root.murdermystery.Host();
            if (object.isHost != null)
                message.isHost = Boolean(object.isHost);
            return message;
        };

        /**
         * Creates a plain object from a Host message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.Host
         * @static
         * @param {murdermystery.Host} message Host
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Host.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.isHost = false;
            if (message.isHost != null && message.hasOwnProperty("isHost"))
                object.isHost = message.isHost;
            return object;
        };

        /**
         * Converts this Host to JSON.
         * @function toJSON
         * @memberof murdermystery.Host
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Host.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Host;
    })();

    murdermystery.Players = (function() {

        /**
         * Properties of a Players.
         * @memberof murdermystery
         * @interface IPlayers
         * @property {Array.<murdermystery.Players.IPlayer>|null} [players] Players players
         * @property {number|null} [hostId] Players hostId
         */

        /**
         * Constructs a new Players.
         * @memberof murdermystery
         * @classdesc Represents a Players.
         * @implements IPlayers
         * @constructor
         * @param {murdermystery.IPlayers=} [properties] Properties to set
         */
        function Players(properties) {
            this.players = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Players players.
         * @member {Array.<murdermystery.Players.IPlayer>} players
         * @memberof murdermystery.Players
         * @instance
         */
        Players.prototype.players = $util.emptyArray;

        /**
         * Players hostId.
         * @member {number} hostId
         * @memberof murdermystery.Players
         * @instance
         */
        Players.prototype.hostId = 0;

        /**
         * Creates a new Players instance using the specified properties.
         * @function create
         * @memberof murdermystery.Players
         * @static
         * @param {murdermystery.IPlayers=} [properties] Properties to set
         * @returns {murdermystery.Players} Players instance
         */
        Players.create = function create(properties) {
            return new Players(properties);
        };

        /**
         * Encodes the specified Players message. Does not implicitly {@link murdermystery.Players.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.Players
         * @static
         * @param {murdermystery.IPlayers} message Players message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Players.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.players != null && message.players.length)
                for (var i = 0; i < message.players.length; ++i)
                    $root.murdermystery.Players.Player.encode(message.players[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.hostId != null && Object.hasOwnProperty.call(message, "hostId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.hostId);
            return writer;
        };

        /**
         * Encodes the specified Players message, length delimited. Does not implicitly {@link murdermystery.Players.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.Players
         * @static
         * @param {murdermystery.IPlayers} message Players message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Players.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Players message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.Players
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.Players} Players
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Players.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.Players();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.players && message.players.length))
                        message.players = [];
                    message.players.push($root.murdermystery.Players.Player.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.hostId = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Players message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.Players
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.Players} Players
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Players.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Players message.
         * @function verify
         * @memberof murdermystery.Players
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Players.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.players != null && message.hasOwnProperty("players")) {
                if (!Array.isArray(message.players))
                    return "players: array expected";
                for (var i = 0; i < message.players.length; ++i) {
                    var error = $root.murdermystery.Players.Player.verify(message.players[i]);
                    if (error)
                        return "players." + error;
                }
            }
            if (message.hostId != null && message.hasOwnProperty("hostId"))
                if (!$util.isInteger(message.hostId))
                    return "hostId: integer expected";
            return null;
        };

        /**
         * Creates a Players message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.Players
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.Players} Players
         */
        Players.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.Players)
                return object;
            var message = new $root.murdermystery.Players();
            if (object.players) {
                if (!Array.isArray(object.players))
                    throw TypeError(".murdermystery.Players.players: array expected");
                message.players = [];
                for (var i = 0; i < object.players.length; ++i) {
                    if (typeof object.players[i] !== "object")
                        throw TypeError(".murdermystery.Players.players: object expected");
                    message.players[i] = $root.murdermystery.Players.Player.fromObject(object.players[i]);
                }
            }
            if (object.hostId != null)
                message.hostId = object.hostId | 0;
            return message;
        };

        /**
         * Creates a plain object from a Players message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.Players
         * @static
         * @param {murdermystery.Players} message Players
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Players.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.players = [];
            if (options.defaults)
                object.hostId = 0;
            if (message.players && message.players.length) {
                object.players = [];
                for (var j = 0; j < message.players.length; ++j)
                    object.players[j] = $root.murdermystery.Players.Player.toObject(message.players[j], options);
            }
            if (message.hostId != null && message.hasOwnProperty("hostId"))
                object.hostId = message.hostId;
            return object;
        };

        /**
         * Converts this Players to JSON.
         * @function toJSON
         * @memberof murdermystery.Players
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Players.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        Players.Player = (function() {

            /**
             * Properties of a Player.
             * @memberof murdermystery.Players
             * @interface IPlayer
             * @property {string|null} [name] Player name
             * @property {number|null} [id] Player id
             */

            /**
             * Constructs a new Player.
             * @memberof murdermystery.Players
             * @classdesc Represents a Player.
             * @implements IPlayer
             * @constructor
             * @param {murdermystery.Players.IPlayer=} [properties] Properties to set
             */
            function Player(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Player name.
             * @member {string} name
             * @memberof murdermystery.Players.Player
             * @instance
             */
            Player.prototype.name = "";

            /**
             * Player id.
             * @member {number} id
             * @memberof murdermystery.Players.Player
             * @instance
             */
            Player.prototype.id = 0;

            /**
             * Creates a new Player instance using the specified properties.
             * @function create
             * @memberof murdermystery.Players.Player
             * @static
             * @param {murdermystery.Players.IPlayer=} [properties] Properties to set
             * @returns {murdermystery.Players.Player} Player instance
             */
            Player.create = function create(properties) {
                return new Player(properties);
            };

            /**
             * Encodes the specified Player message. Does not implicitly {@link murdermystery.Players.Player.verify|verify} messages.
             * @function encode
             * @memberof murdermystery.Players.Player
             * @static
             * @param {murdermystery.Players.IPlayer} message Player message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Player.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.id);
                return writer;
            };

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link murdermystery.Players.Player.verify|verify} messages.
             * @function encodeDelimited
             * @memberof murdermystery.Players.Player
             * @static
             * @param {murdermystery.Players.IPlayer} message Player message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Player.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @function decode
             * @memberof murdermystery.Players.Player
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {murdermystery.Players.Player} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.Players.Player();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.id = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof murdermystery.Players.Player
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {murdermystery.Players.Player} Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Player.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Player message.
             * @function verify
             * @memberof murdermystery.Players.Player
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Player.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                return null;
            };

            /**
             * Creates a Player message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof murdermystery.Players.Player
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {murdermystery.Players.Player} Player
             */
            Player.fromObject = function fromObject(object) {
                if (object instanceof $root.murdermystery.Players.Player)
                    return object;
                var message = new $root.murdermystery.Players.Player();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.id != null)
                    message.id = object.id | 0;
                return message;
            };

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @function toObject
             * @memberof murdermystery.Players.Player
             * @static
             * @param {murdermystery.Players.Player} message Player
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Player.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.id = 0;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                return object;
            };

            /**
             * Converts this Player to JSON.
             * @function toJSON
             * @memberof murdermystery.Players.Player
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Player.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Player;
        })();

        return Players;
    })();

    murdermystery.Error = (function() {

        /**
         * Properties of an Error.
         * @memberof murdermystery
         * @interface IError
         * @property {murdermystery.Error.E_type|null} [msg] Error msg
         */

        /**
         * Constructs a new Error.
         * @memberof murdermystery
         * @classdesc Represents an Error.
         * @implements IError
         * @constructor
         * @param {murdermystery.IError=} [properties] Properties to set
         */
        function Error(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Error msg.
         * @member {murdermystery.Error.E_type} msg
         * @memberof murdermystery.Error
         * @instance
         */
        Error.prototype.msg = 0;

        /**
         * Creates a new Error instance using the specified properties.
         * @function create
         * @memberof murdermystery.Error
         * @static
         * @param {murdermystery.IError=} [properties] Properties to set
         * @returns {murdermystery.Error} Error instance
         */
        Error.create = function create(properties) {
            return new Error(properties);
        };

        /**
         * Encodes the specified Error message. Does not implicitly {@link murdermystery.Error.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.Error
         * @static
         * @param {murdermystery.IError} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.msg);
            return writer;
        };

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link murdermystery.Error.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.Error
         * @static
         * @param {murdermystery.IError} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.Error();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.msg = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Error message.
         * @function verify
         * @memberof murdermystery.Error
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Error.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                switch (message.msg) {
                default:
                    return "msg: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.Error
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.Error} Error
         */
        Error.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.Error)
                return object;
            var message = new $root.murdermystery.Error();
            switch (object.msg) {
            case "UNKNOWN":
            case 0:
                message.msg = 0;
                break;
            case "DISCONNECT":
            case 1:
                message.msg = 1;
                break;
            case "BADNAME":
            case 2:
                message.msg = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.Error
         * @static
         * @param {murdermystery.Error} message Error
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Error.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.msg = options.enums === String ? "UNKNOWN" : 0;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = options.enums === String ? $root.murdermystery.Error.E_type[message.msg] : message.msg;
            return object;
        };

        /**
         * Converts this Error to JSON.
         * @function toJSON
         * @memberof murdermystery.Error
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Error.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * E_type enum.
         * @name murdermystery.Error.E_type
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} DISCONNECT=1 DISCONNECT value
         * @property {number} BADNAME=2 BADNAME value
         */
        Error.E_type = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "DISCONNECT"] = 1;
            values[valuesById[2] = "BADNAME"] = 2;
            return values;
        })();

        return Error;
    })();

    murdermystery.Alert = (function() {

        /**
         * Properties of an Alert.
         * @memberof murdermystery
         * @interface IAlert
         * @property {murdermystery.Alert.Msg|null} [msg] Alert msg
         */

        /**
         * Constructs a new Alert.
         * @memberof murdermystery
         * @classdesc Represents an Alert.
         * @implements IAlert
         * @constructor
         * @param {murdermystery.IAlert=} [properties] Properties to set
         */
        function Alert(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Alert msg.
         * @member {murdermystery.Alert.Msg} msg
         * @memberof murdermystery.Alert
         * @instance
         */
        Alert.prototype.msg = 0;

        /**
         * Creates a new Alert instance using the specified properties.
         * @function create
         * @memberof murdermystery.Alert
         * @static
         * @param {murdermystery.IAlert=} [properties] Properties to set
         * @returns {murdermystery.Alert} Alert instance
         */
        Alert.create = function create(properties) {
            return new Alert(properties);
        };

        /**
         * Encodes the specified Alert message. Does not implicitly {@link murdermystery.Alert.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.Alert
         * @static
         * @param {murdermystery.IAlert} message Alert message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Alert.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.msg);
            return writer;
        };

        /**
         * Encodes the specified Alert message, length delimited. Does not implicitly {@link murdermystery.Alert.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.Alert
         * @static
         * @param {murdermystery.IAlert} message Alert message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Alert.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Alert message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.Alert
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.Alert} Alert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Alert.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.Alert();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.msg = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Alert message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.Alert
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.Alert} Alert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Alert.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Alert message.
         * @function verify
         * @memberof murdermystery.Alert
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Alert.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                switch (message.msg) {
                default:
                    return "msg: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates an Alert message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.Alert
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.Alert} Alert
         */
        Alert.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.Alert)
                return object;
            var message = new $root.murdermystery.Alert();
            switch (object.msg) {
            case "UNKNOWN":
            case 0:
                message.msg = 0;
                break;
            case "NEEDMOREPLAYERS":
            case 1:
                message.msg = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from an Alert message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.Alert
         * @static
         * @param {murdermystery.Alert} message Alert
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Alert.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.msg = options.enums === String ? "UNKNOWN" : 0;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = options.enums === String ? $root.murdermystery.Alert.Msg[message.msg] : message.msg;
            return object;
        };

        /**
         * Converts this Alert to JSON.
         * @function toJSON
         * @memberof murdermystery.Alert
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Alert.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Msg enum.
         * @name murdermystery.Alert.Msg
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} NEEDMOREPLAYERS=1 NEEDMOREPLAYERS value
         */
        Alert.Msg = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "NEEDMOREPLAYERS"] = 1;
            return values;
        })();

        return Alert;
    })();

    murdermystery.SetCharacter = (function() {

        /**
         * Properties of a SetCharacter.
         * @memberof murdermystery
         * @interface ISetCharacter
         * @property {murdermystery.SetCharacter.Character|null} [character] SetCharacter character
         */

        /**
         * Constructs a new SetCharacter.
         * @memberof murdermystery
         * @classdesc Represents a SetCharacter.
         * @implements ISetCharacter
         * @constructor
         * @param {murdermystery.ISetCharacter=} [properties] Properties to set
         */
        function SetCharacter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetCharacter character.
         * @member {murdermystery.SetCharacter.Character} character
         * @memberof murdermystery.SetCharacter
         * @instance
         */
        SetCharacter.prototype.character = 0;

        /**
         * Creates a new SetCharacter instance using the specified properties.
         * @function create
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {murdermystery.ISetCharacter=} [properties] Properties to set
         * @returns {murdermystery.SetCharacter} SetCharacter instance
         */
        SetCharacter.create = function create(properties) {
            return new SetCharacter(properties);
        };

        /**
         * Encodes the specified SetCharacter message. Does not implicitly {@link murdermystery.SetCharacter.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {murdermystery.ISetCharacter} message SetCharacter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetCharacter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.character != null && Object.hasOwnProperty.call(message, "character"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.character);
            return writer;
        };

        /**
         * Encodes the specified SetCharacter message, length delimited. Does not implicitly {@link murdermystery.SetCharacter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {murdermystery.ISetCharacter} message SetCharacter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetCharacter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetCharacter message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.SetCharacter} SetCharacter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetCharacter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.SetCharacter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.character = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetCharacter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.SetCharacter} SetCharacter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetCharacter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetCharacter message.
         * @function verify
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetCharacter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.character != null && message.hasOwnProperty("character"))
                switch (message.character) {
                default:
                    return "character: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            return null;
        };

        /**
         * Creates a SetCharacter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.SetCharacter} SetCharacter
         */
        SetCharacter.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.SetCharacter)
                return object;
            var message = new $root.murdermystery.SetCharacter();
            switch (object.character) {
            case "NONE":
            case 0:
                message.character = 0;
                break;
            case "CITIZEN":
            case 1:
                message.character = 1;
                break;
            case "WEREWOLF":
            case 2:
                message.character = 2;
                break;
            case "HEALER":
            case 3:
                message.character = 3;
                break;
            case "PROPHET":
            case 4:
                message.character = 4;
                break;
            case "HUNTER":
            case 5:
                message.character = 5;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SetCharacter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.SetCharacter
         * @static
         * @param {murdermystery.SetCharacter} message SetCharacter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetCharacter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.character = options.enums === String ? "NONE" : 0;
            if (message.character != null && message.hasOwnProperty("character"))
                object.character = options.enums === String ? $root.murdermystery.SetCharacter.Character[message.character] : message.character;
            return object;
        };

        /**
         * Converts this SetCharacter to JSON.
         * @function toJSON
         * @memberof murdermystery.SetCharacter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetCharacter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Character enum.
         * @name murdermystery.SetCharacter.Character
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} CITIZEN=1 CITIZEN value
         * @property {number} WEREWOLF=2 WEREWOLF value
         * @property {number} HEALER=3 HEALER value
         * @property {number} PROPHET=4 PROPHET value
         * @property {number} HUNTER=5 HUNTER value
         */
        SetCharacter.Character = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "CITIZEN"] = 1;
            values[valuesById[2] = "WEREWOLF"] = 2;
            values[valuesById[3] = "HEALER"] = 3;
            values[valuesById[4] = "PROPHET"] = 4;
            values[valuesById[5] = "HUNTER"] = 5;
            return values;
        })();

        return SetCharacter;
    })();

    murdermystery.FellowWolves = (function() {

        /**
         * Properties of a FellowWolves.
         * @memberof murdermystery
         * @interface IFellowWolves
         * @property {Array.<number>|null} [ids] FellowWolves ids
         */

        /**
         * Constructs a new FellowWolves.
         * @memberof murdermystery
         * @classdesc Represents a FellowWolves.
         * @implements IFellowWolves
         * @constructor
         * @param {murdermystery.IFellowWolves=} [properties] Properties to set
         */
        function FellowWolves(properties) {
            this.ids = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FellowWolves ids.
         * @member {Array.<number>} ids
         * @memberof murdermystery.FellowWolves
         * @instance
         */
        FellowWolves.prototype.ids = $util.emptyArray;

        /**
         * Creates a new FellowWolves instance using the specified properties.
         * @function create
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {murdermystery.IFellowWolves=} [properties] Properties to set
         * @returns {murdermystery.FellowWolves} FellowWolves instance
         */
        FellowWolves.create = function create(properties) {
            return new FellowWolves(properties);
        };

        /**
         * Encodes the specified FellowWolves message. Does not implicitly {@link murdermystery.FellowWolves.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {murdermystery.IFellowWolves} message FellowWolves message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FellowWolves.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ids != null && message.ids.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.ids.length; ++i)
                    writer.int32(message.ids[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified FellowWolves message, length delimited. Does not implicitly {@link murdermystery.FellowWolves.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {murdermystery.IFellowWolves} message FellowWolves message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FellowWolves.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FellowWolves message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.FellowWolves} FellowWolves
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FellowWolves.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.FellowWolves();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.ids && message.ids.length))
                        message.ids = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.ids.push(reader.int32());
                    } else
                        message.ids.push(reader.int32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FellowWolves message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.FellowWolves} FellowWolves
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FellowWolves.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FellowWolves message.
         * @function verify
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FellowWolves.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ids != null && message.hasOwnProperty("ids")) {
                if (!Array.isArray(message.ids))
                    return "ids: array expected";
                for (var i = 0; i < message.ids.length; ++i)
                    if (!$util.isInteger(message.ids[i]))
                        return "ids: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a FellowWolves message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.FellowWolves} FellowWolves
         */
        FellowWolves.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.FellowWolves)
                return object;
            var message = new $root.murdermystery.FellowWolves();
            if (object.ids) {
                if (!Array.isArray(object.ids))
                    throw TypeError(".murdermystery.FellowWolves.ids: array expected");
                message.ids = [];
                for (var i = 0; i < object.ids.length; ++i)
                    message.ids[i] = object.ids[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a FellowWolves message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.FellowWolves
         * @static
         * @param {murdermystery.FellowWolves} message FellowWolves
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FellowWolves.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.ids = [];
            if (message.ids && message.ids.length) {
                object.ids = [];
                for (var j = 0; j < message.ids.length; ++j)
                    object.ids[j] = message.ids[j];
            }
            return object;
        };

        /**
         * Converts this FellowWolves to JSON.
         * @function toJSON
         * @memberof murdermystery.FellowWolves
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FellowWolves.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FellowWolves;
    })();

    murdermystery.ServerMessage = (function() {

        /**
         * Properties of a ServerMessage.
         * @memberof murdermystery
         * @interface IServerMessage
         * @property {murdermystery.IHandshake|null} [handshake] ServerMessage handshake
         * @property {murdermystery.IHost|null} [host] ServerMessage host
         * @property {murdermystery.IPlayers|null} [players] ServerMessage players
         * @property {murdermystery.IError|null} [error] ServerMessage error
         * @property {murdermystery.IAlert|null} [alert] ServerMessage alert
         * @property {murdermystery.ISetCharacter|null} [setCharacter] ServerMessage setCharacter
         * @property {murdermystery.IFellowWolves|null} [fellowWolves] ServerMessage fellowWolves
         */

        /**
         * Constructs a new ServerMessage.
         * @memberof murdermystery
         * @classdesc Represents a ServerMessage.
         * @implements IServerMessage
         * @constructor
         * @param {murdermystery.IServerMessage=} [properties] Properties to set
         */
        function ServerMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerMessage handshake.
         * @member {murdermystery.IHandshake|null|undefined} handshake
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.handshake = null;

        /**
         * ServerMessage host.
         * @member {murdermystery.IHost|null|undefined} host
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.host = null;

        /**
         * ServerMessage players.
         * @member {murdermystery.IPlayers|null|undefined} players
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.players = null;

        /**
         * ServerMessage error.
         * @member {murdermystery.IError|null|undefined} error
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.error = null;

        /**
         * ServerMessage alert.
         * @member {murdermystery.IAlert|null|undefined} alert
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.alert = null;

        /**
         * ServerMessage setCharacter.
         * @member {murdermystery.ISetCharacter|null|undefined} setCharacter
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.setCharacter = null;

        /**
         * ServerMessage fellowWolves.
         * @member {murdermystery.IFellowWolves|null|undefined} fellowWolves
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        ServerMessage.prototype.fellowWolves = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * ServerMessage data.
         * @member {"handshake"|"host"|"players"|"error"|"alert"|"setCharacter"|"fellowWolves"|undefined} data
         * @memberof murdermystery.ServerMessage
         * @instance
         */
        Object.defineProperty(ServerMessage.prototype, "data", {
            get: $util.oneOfGetter($oneOfFields = ["handshake", "host", "players", "error", "alert", "setCharacter", "fellowWolves"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @function create
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {murdermystery.IServerMessage=} [properties] Properties to set
         * @returns {murdermystery.ServerMessage} ServerMessage instance
         */
        ServerMessage.create = function create(properties) {
            return new ServerMessage(properties);
        };

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link murdermystery.ServerMessage.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {murdermystery.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.handshake != null && Object.hasOwnProperty.call(message, "handshake"))
                $root.murdermystery.Handshake.encode(message.handshake, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.host != null && Object.hasOwnProperty.call(message, "host"))
                $root.murdermystery.Host.encode(message.host, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.players != null && Object.hasOwnProperty.call(message, "players"))
                $root.murdermystery.Players.encode(message.players, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.murdermystery.Error.encode(message.error, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.alert != null && Object.hasOwnProperty.call(message, "alert"))
                $root.murdermystery.Alert.encode(message.alert, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.setCharacter != null && Object.hasOwnProperty.call(message, "setCharacter"))
                $root.murdermystery.SetCharacter.encode(message.setCharacter, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.fellowWolves != null && Object.hasOwnProperty.call(message, "fellowWolves"))
                $root.murdermystery.FellowWolves.encode(message.fellowWolves, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link murdermystery.ServerMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {murdermystery.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.ServerMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.handshake = $root.murdermystery.Handshake.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.host = $root.murdermystery.Host.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.players = $root.murdermystery.Players.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.error = $root.murdermystery.Error.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.alert = $root.murdermystery.Alert.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.setCharacter = $root.murdermystery.SetCharacter.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.fellowWolves = $root.murdermystery.FellowWolves.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerMessage message.
         * @function verify
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.handshake != null && message.hasOwnProperty("handshake")) {
                properties.data = 1;
                {
                    var error = $root.murdermystery.Handshake.verify(message.handshake);
                    if (error)
                        return "handshake." + error;
                }
            }
            if (message.host != null && message.hasOwnProperty("host")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.Host.verify(message.host);
                    if (error)
                        return "host." + error;
                }
            }
            if (message.players != null && message.hasOwnProperty("players")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.Players.verify(message.players);
                    if (error)
                        return "players." + error;
                }
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.Error.verify(message.error);
                    if (error)
                        return "error." + error;
                }
            }
            if (message.alert != null && message.hasOwnProperty("alert")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.Alert.verify(message.alert);
                    if (error)
                        return "alert." + error;
                }
            }
            if (message.setCharacter != null && message.hasOwnProperty("setCharacter")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.SetCharacter.verify(message.setCharacter);
                    if (error)
                        return "setCharacter." + error;
                }
            }
            if (message.fellowWolves != null && message.hasOwnProperty("fellowWolves")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.FellowWolves.verify(message.fellowWolves);
                    if (error)
                        return "fellowWolves." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.ServerMessage} ServerMessage
         */
        ServerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.ServerMessage)
                return object;
            var message = new $root.murdermystery.ServerMessage();
            if (object.handshake != null) {
                if (typeof object.handshake !== "object")
                    throw TypeError(".murdermystery.ServerMessage.handshake: object expected");
                message.handshake = $root.murdermystery.Handshake.fromObject(object.handshake);
            }
            if (object.host != null) {
                if (typeof object.host !== "object")
                    throw TypeError(".murdermystery.ServerMessage.host: object expected");
                message.host = $root.murdermystery.Host.fromObject(object.host);
            }
            if (object.players != null) {
                if (typeof object.players !== "object")
                    throw TypeError(".murdermystery.ServerMessage.players: object expected");
                message.players = $root.murdermystery.Players.fromObject(object.players);
            }
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".murdermystery.ServerMessage.error: object expected");
                message.error = $root.murdermystery.Error.fromObject(object.error);
            }
            if (object.alert != null) {
                if (typeof object.alert !== "object")
                    throw TypeError(".murdermystery.ServerMessage.alert: object expected");
                message.alert = $root.murdermystery.Alert.fromObject(object.alert);
            }
            if (object.setCharacter != null) {
                if (typeof object.setCharacter !== "object")
                    throw TypeError(".murdermystery.ServerMessage.setCharacter: object expected");
                message.setCharacter = $root.murdermystery.SetCharacter.fromObject(object.setCharacter);
            }
            if (object.fellowWolves != null) {
                if (typeof object.fellowWolves !== "object")
                    throw TypeError(".murdermystery.ServerMessage.fellowWolves: object expected");
                message.fellowWolves = $root.murdermystery.FellowWolves.fromObject(object.fellowWolves);
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.ServerMessage
         * @static
         * @param {murdermystery.ServerMessage} message ServerMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.handshake != null && message.hasOwnProperty("handshake")) {
                object.handshake = $root.murdermystery.Handshake.toObject(message.handshake, options);
                if (options.oneofs)
                    object.data = "handshake";
            }
            if (message.host != null && message.hasOwnProperty("host")) {
                object.host = $root.murdermystery.Host.toObject(message.host, options);
                if (options.oneofs)
                    object.data = "host";
            }
            if (message.players != null && message.hasOwnProperty("players")) {
                object.players = $root.murdermystery.Players.toObject(message.players, options);
                if (options.oneofs)
                    object.data = "players";
            }
            if (message.error != null && message.hasOwnProperty("error")) {
                object.error = $root.murdermystery.Error.toObject(message.error, options);
                if (options.oneofs)
                    object.data = "error";
            }
            if (message.alert != null && message.hasOwnProperty("alert")) {
                object.alert = $root.murdermystery.Alert.toObject(message.alert, options);
                if (options.oneofs)
                    object.data = "alert";
            }
            if (message.setCharacter != null && message.hasOwnProperty("setCharacter")) {
                object.setCharacter = $root.murdermystery.SetCharacter.toObject(message.setCharacter, options);
                if (options.oneofs)
                    object.data = "setCharacter";
            }
            if (message.fellowWolves != null && message.hasOwnProperty("fellowWolves")) {
                object.fellowWolves = $root.murdermystery.FellowWolves.toObject(message.fellowWolves, options);
                if (options.oneofs)
                    object.data = "fellowWolves";
            }
            return object;
        };

        /**
         * Converts this ServerMessage to JSON.
         * @function toJSON
         * @memberof murdermystery.ServerMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ServerMessage;
    })();

    murdermystery.SetName = (function() {

        /**
         * Properties of a SetName.
         * @memberof murdermystery
         * @interface ISetName
         * @property {string|null} [name] SetName name
         */

        /**
         * Constructs a new SetName.
         * @memberof murdermystery
         * @classdesc Represents a SetName.
         * @implements ISetName
         * @constructor
         * @param {murdermystery.ISetName=} [properties] Properties to set
         */
        function SetName(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SetName name.
         * @member {string} name
         * @memberof murdermystery.SetName
         * @instance
         */
        SetName.prototype.name = "";

        /**
         * Creates a new SetName instance using the specified properties.
         * @function create
         * @memberof murdermystery.SetName
         * @static
         * @param {murdermystery.ISetName=} [properties] Properties to set
         * @returns {murdermystery.SetName} SetName instance
         */
        SetName.create = function create(properties) {
            return new SetName(properties);
        };

        /**
         * Encodes the specified SetName message. Does not implicitly {@link murdermystery.SetName.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.SetName
         * @static
         * @param {murdermystery.ISetName} message SetName message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetName.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified SetName message, length delimited. Does not implicitly {@link murdermystery.SetName.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.SetName
         * @static
         * @param {murdermystery.ISetName} message SetName message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetName.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetName message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.SetName
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.SetName} SetName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetName.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.SetName();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetName message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.SetName
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.SetName} SetName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetName.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetName message.
         * @function verify
         * @memberof murdermystery.SetName
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetName.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a SetName message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.SetName
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.SetName} SetName
         */
        SetName.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.SetName)
                return object;
            var message = new $root.murdermystery.SetName();
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a SetName message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.SetName
         * @static
         * @param {murdermystery.SetName} message SetName
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetName.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.name = "";
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this SetName to JSON.
         * @function toJSON
         * @memberof murdermystery.SetName
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetName.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SetName;
    })();

    murdermystery.StartGame = (function() {

        /**
         * Properties of a StartGame.
         * @memberof murdermystery
         * @interface IStartGame
         */

        /**
         * Constructs a new StartGame.
         * @memberof murdermystery
         * @classdesc Represents a StartGame.
         * @implements IStartGame
         * @constructor
         * @param {murdermystery.IStartGame=} [properties] Properties to set
         */
        function StartGame(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new StartGame instance using the specified properties.
         * @function create
         * @memberof murdermystery.StartGame
         * @static
         * @param {murdermystery.IStartGame=} [properties] Properties to set
         * @returns {murdermystery.StartGame} StartGame instance
         */
        StartGame.create = function create(properties) {
            return new StartGame(properties);
        };

        /**
         * Encodes the specified StartGame message. Does not implicitly {@link murdermystery.StartGame.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.StartGame
         * @static
         * @param {murdermystery.IStartGame} message StartGame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartGame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified StartGame message, length delimited. Does not implicitly {@link murdermystery.StartGame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.StartGame
         * @static
         * @param {murdermystery.IStartGame} message StartGame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StartGame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StartGame message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.StartGame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.StartGame} StartGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartGame.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.StartGame();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StartGame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.StartGame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.StartGame} StartGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StartGame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StartGame message.
         * @function verify
         * @memberof murdermystery.StartGame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StartGame.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a StartGame message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.StartGame
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.StartGame} StartGame
         */
        StartGame.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.StartGame)
                return object;
            return new $root.murdermystery.StartGame();
        };

        /**
         * Creates a plain object from a StartGame message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.StartGame
         * @static
         * @param {murdermystery.StartGame} message StartGame
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StartGame.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this StartGame to JSON.
         * @function toJSON
         * @memberof murdermystery.StartGame
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StartGame.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StartGame;
    })();

    murdermystery.ClientMessage = (function() {

        /**
         * Properties of a ClientMessage.
         * @memberof murdermystery
         * @interface IClientMessage
         * @property {murdermystery.ISetName|null} [setName] ClientMessage setName
         * @property {murdermystery.IStartGame|null} [startGame] ClientMessage startGame
         */

        /**
         * Constructs a new ClientMessage.
         * @memberof murdermystery
         * @classdesc Represents a ClientMessage.
         * @implements IClientMessage
         * @constructor
         * @param {murdermystery.IClientMessage=} [properties] Properties to set
         */
        function ClientMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClientMessage setName.
         * @member {murdermystery.ISetName|null|undefined} setName
         * @memberof murdermystery.ClientMessage
         * @instance
         */
        ClientMessage.prototype.setName = null;

        /**
         * ClientMessage startGame.
         * @member {murdermystery.IStartGame|null|undefined} startGame
         * @memberof murdermystery.ClientMessage
         * @instance
         */
        ClientMessage.prototype.startGame = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * ClientMessage data.
         * @member {"setName"|"startGame"|undefined} data
         * @memberof murdermystery.ClientMessage
         * @instance
         */
        Object.defineProperty(ClientMessage.prototype, "data", {
            get: $util.oneOfGetter($oneOfFields = ["setName", "startGame"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @function create
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {murdermystery.IClientMessage=} [properties] Properties to set
         * @returns {murdermystery.ClientMessage} ClientMessage instance
         */
        ClientMessage.create = function create(properties) {
            return new ClientMessage(properties);
        };

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link murdermystery.ClientMessage.verify|verify} messages.
         * @function encode
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {murdermystery.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.setName != null && Object.hasOwnProperty.call(message, "setName"))
                $root.murdermystery.SetName.encode(message.setName, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.startGame != null && Object.hasOwnProperty.call(message, "startGame"))
                $root.murdermystery.StartGame.encode(message.startGame, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link murdermystery.ClientMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {murdermystery.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @function decode
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {murdermystery.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.murdermystery.ClientMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.setName = $root.murdermystery.SetName.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.startGame = $root.murdermystery.StartGame.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {murdermystery.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClientMessage message.
         * @function verify
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.setName != null && message.hasOwnProperty("setName")) {
                properties.data = 1;
                {
                    var error = $root.murdermystery.SetName.verify(message.setName);
                    if (error)
                        return "setName." + error;
                }
            }
            if (message.startGame != null && message.hasOwnProperty("startGame")) {
                if (properties.data === 1)
                    return "data: multiple values";
                properties.data = 1;
                {
                    var error = $root.murdermystery.StartGame.verify(message.startGame);
                    if (error)
                        return "startGame." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {murdermystery.ClientMessage} ClientMessage
         */
        ClientMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.murdermystery.ClientMessage)
                return object;
            var message = new $root.murdermystery.ClientMessage();
            if (object.setName != null) {
                if (typeof object.setName !== "object")
                    throw TypeError(".murdermystery.ClientMessage.setName: object expected");
                message.setName = $root.murdermystery.SetName.fromObject(object.setName);
            }
            if (object.startGame != null) {
                if (typeof object.startGame !== "object")
                    throw TypeError(".murdermystery.ClientMessage.startGame: object expected");
                message.startGame = $root.murdermystery.StartGame.fromObject(object.startGame);
            }
            return message;
        };

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof murdermystery.ClientMessage
         * @static
         * @param {murdermystery.ClientMessage} message ClientMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (message.setName != null && message.hasOwnProperty("setName")) {
                object.setName = $root.murdermystery.SetName.toObject(message.setName, options);
                if (options.oneofs)
                    object.data = "setName";
            }
            if (message.startGame != null && message.hasOwnProperty("startGame")) {
                object.startGame = $root.murdermystery.StartGame.toObject(message.startGame, options);
                if (options.oneofs)
                    object.data = "startGame";
            }
            return object;
        };

        /**
         * Converts this ClientMessage to JSON.
         * @function toJSON
         * @memberof murdermystery.ClientMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ClientMessage;
    })();

    return murdermystery;
})();

module.exports = $root;
