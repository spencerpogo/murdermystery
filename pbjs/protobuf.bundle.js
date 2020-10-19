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

    murdermystery.Players = (function() {

        /**
         * Properties of a Players.
         * @memberof murdermystery
         * @interface IPlayers
         * @property {Array.<murdermystery.Players.IPlayer>|null} [players] Players players
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
            if (message.players && message.players.length) {
                object.players = [];
                for (var j = 0; j < message.players.length; ++j)
                    object.players[j] = $root.murdermystery.Players.Player.toObject(message.players[j], options);
            }
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
             * @property {boolean|null} [isHost] Player isHost
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
             * Player isHost.
             * @member {boolean} isHost
             * @memberof murdermystery.Players.Player
             * @instance
             */
            Player.prototype.isHost = false;

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
                if (message.isHost != null && Object.hasOwnProperty.call(message, "isHost"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isHost);
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
                if (message.isHost != null && message.hasOwnProperty("isHost"))
                    if (typeof message.isHost !== "boolean")
                        return "isHost: boolean expected";
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
                if (object.isHost != null)
                    message.isHost = Boolean(object.isHost);
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
                    object.isHost = false;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.isHost != null && message.hasOwnProperty("isHost"))
                    object.isHost = message.isHost;
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
         * @property {string|null} [msg] Error msg
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
         * @member {string} msg
         * @memberof murdermystery.Error
         * @instance
         */
        Error.prototype.msg = "";

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
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.msg);
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
                    message.msg = reader.string();
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
                if (!$util.isString(message.msg))
                    return "msg: string expected";
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
            if (object.msg != null)
                message.msg = String(object.msg);
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
                object.msg = "";
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
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

        return Error;
    })();

    murdermystery.Alert = (function() {

        /**
         * Properties of an Alert.
         * @memberof murdermystery
         * @interface IAlert
         * @property {string|null} [msg] Alert msg
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
         * @member {string} msg
         * @memberof murdermystery.Alert
         * @instance
         */
        Alert.prototype.msg = "";

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
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.msg);
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
                    message.msg = reader.string();
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
                if (!$util.isString(message.msg))
                    return "msg: string expected";
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
            if (object.msg != null)
                message.msg = String(object.msg);
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
                object.msg = "";
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
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

    return murdermystery;
})();

module.exports = $root;
