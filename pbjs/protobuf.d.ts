import * as $protobuf from "protobufjs";
/** Namespace murdermystery. */
export namespace murdermystery {

    /** Properties of a Handshake. */
    interface IHandshake {

        /** Handshake err */
        err?: (murdermystery.Handshake.Error|null);
    }

    /** Represents a Handshake. */
    class Handshake implements IHandshake {

        /**
         * Constructs a new Handshake.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IHandshake);

        /** Handshake err. */
        public err: murdermystery.Handshake.Error;

        /**
         * Creates a new Handshake instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Handshake instance
         */
        public static create(properties?: murdermystery.IHandshake): murdermystery.Handshake;

        /**
         * Encodes the specified Handshake message. Does not implicitly {@link murdermystery.Handshake.verify|verify} messages.
         * @param message Handshake message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IHandshake, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Handshake message, length delimited. Does not implicitly {@link murdermystery.Handshake.verify|verify} messages.
         * @param message Handshake message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IHandshake, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Handshake message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Handshake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.Handshake;

        /**
         * Decodes a Handshake message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Handshake
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.Handshake;

        /**
         * Verifies a Handshake message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Handshake message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Handshake
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.Handshake;

        /**
         * Creates a plain object from a Handshake message. Also converts values to other types if specified.
         * @param message Handshake
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.Handshake, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Handshake to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Handshake {

        /** Error enum. */
        enum Error {
            UNKNOWN = 0,
            OK = 1,
            STARTED = 2
        }
    }

    /** Properties of a Host. */
    interface IHost {

        /** Host isHost */
        isHost?: (boolean|null);
    }

    /** Represents a Host. */
    class Host implements IHost {

        /**
         * Constructs a new Host.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IHost);

        /** Host isHost. */
        public isHost: boolean;

        /**
         * Creates a new Host instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Host instance
         */
        public static create(properties?: murdermystery.IHost): murdermystery.Host;

        /**
         * Encodes the specified Host message. Does not implicitly {@link murdermystery.Host.verify|verify} messages.
         * @param message Host message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IHost, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Host message, length delimited. Does not implicitly {@link murdermystery.Host.verify|verify} messages.
         * @param message Host message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IHost, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Host message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Host
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.Host;

        /**
         * Decodes a Host message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Host
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.Host;

        /**
         * Verifies a Host message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Host message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Host
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.Host;

        /**
         * Creates a plain object from a Host message. Also converts values to other types if specified.
         * @param message Host
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.Host, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Host to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetName. */
    interface ISetName {

        /** SetName name */
        name?: (string|null);
    }

    /** Represents a SetName. */
    class SetName implements ISetName {

        /**
         * Constructs a new SetName.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.ISetName);

        /** SetName name. */
        public name: string;

        /**
         * Creates a new SetName instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetName instance
         */
        public static create(properties?: murdermystery.ISetName): murdermystery.SetName;

        /**
         * Encodes the specified SetName message. Does not implicitly {@link murdermystery.SetName.verify|verify} messages.
         * @param message SetName message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.ISetName, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetName message, length delimited. Does not implicitly {@link murdermystery.SetName.verify|verify} messages.
         * @param message SetName message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.ISetName, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetName message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.SetName;

        /**
         * Decodes a SetName message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetName
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.SetName;

        /**
         * Verifies a SetName message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetName message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetName
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.SetName;

        /**
         * Creates a plain object from a SetName message. Also converts values to other types if specified.
         * @param message SetName
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.SetName, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetName to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StartGame. */
    interface IStartGame {
    }

    /** Represents a StartGame. */
    class StartGame implements IStartGame {

        /**
         * Constructs a new StartGame.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IStartGame);

        /**
         * Creates a new StartGame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StartGame instance
         */
        public static create(properties?: murdermystery.IStartGame): murdermystery.StartGame;

        /**
         * Encodes the specified StartGame message. Does not implicitly {@link murdermystery.StartGame.verify|verify} messages.
         * @param message StartGame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IStartGame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StartGame message, length delimited. Does not implicitly {@link murdermystery.StartGame.verify|verify} messages.
         * @param message StartGame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IStartGame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StartGame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StartGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.StartGame;

        /**
         * Decodes a StartGame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StartGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.StartGame;

        /**
         * Verifies a StartGame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StartGame message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StartGame
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.StartGame;

        /**
         * Creates a plain object from a StartGame message. Also converts values to other types if specified.
         * @param message StartGame
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.StartGame, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StartGame to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Players. */
    interface IPlayers {

        /** Players players */
        players?: (murdermystery.Players.IPlayer[]|null);

        /** Players hostId */
        hostId?: (number|null);
    }

    /** Represents a Players. */
    class Players implements IPlayers {

        /**
         * Constructs a new Players.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IPlayers);

        /** Players players. */
        public players: murdermystery.Players.IPlayer[];

        /** Players hostId. */
        public hostId: number;

        /**
         * Creates a new Players instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Players instance
         */
        public static create(properties?: murdermystery.IPlayers): murdermystery.Players;

        /**
         * Encodes the specified Players message. Does not implicitly {@link murdermystery.Players.verify|verify} messages.
         * @param message Players message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IPlayers, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Players message, length delimited. Does not implicitly {@link murdermystery.Players.verify|verify} messages.
         * @param message Players message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IPlayers, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Players message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Players
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.Players;

        /**
         * Decodes a Players message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Players
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.Players;

        /**
         * Verifies a Players message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Players message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Players
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.Players;

        /**
         * Creates a plain object from a Players message. Also converts values to other types if specified.
         * @param message Players
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.Players, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Players to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Players {

        /** Properties of a Player. */
        interface IPlayer {

            /** Player name */
            name?: (string|null);

            /** Player id */
            id?: (number|null);
        }

        /** Represents a Player. */
        class Player implements IPlayer {

            /**
             * Constructs a new Player.
             * @param [properties] Properties to set
             */
            constructor(properties?: murdermystery.Players.IPlayer);

            /** Player name. */
            public name: string;

            /** Player id. */
            public id: number;

            /**
             * Creates a new Player instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Player instance
             */
            public static create(properties?: murdermystery.Players.IPlayer): murdermystery.Players.Player;

            /**
             * Encodes the specified Player message. Does not implicitly {@link murdermystery.Players.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: murdermystery.Players.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Player message, length delimited. Does not implicitly {@link murdermystery.Players.Player.verify|verify} messages.
             * @param message Player message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: murdermystery.Players.IPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Player message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.Players.Player;

            /**
             * Decodes a Player message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Player
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.Players.Player;

            /**
             * Verifies a Player message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Player message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Player
             */
            public static fromObject(object: { [k: string]: any }): murdermystery.Players.Player;

            /**
             * Creates a plain object from a Player message. Also converts values to other types if specified.
             * @param message Player
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: murdermystery.Players.Player, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Player to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of an Error. */
    interface IError {

        /** Error msg */
        msg?: (murdermystery.Error.E_type|null);
    }

    /** Represents an Error. */
    class Error implements IError {

        /**
         * Constructs a new Error.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IError);

        /** Error msg. */
        public msg: murdermystery.Error.E_type;

        /**
         * Creates a new Error instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Error instance
         */
        public static create(properties?: murdermystery.IError): murdermystery.Error;

        /**
         * Encodes the specified Error message. Does not implicitly {@link murdermystery.Error.verify|verify} messages.
         * @param message Error message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link murdermystery.Error.verify|verify} messages.
         * @param message Error message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.Error;

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.Error;

        /**
         * Verifies an Error message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Error
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.Error;

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @param message Error
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Error to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Error {

        /** E_type enum. */
        enum E_type {
            UNKNOWN = 0,
            DISCONNECT = 1,
            BADNAME = 2
        }
    }

    /** Properties of an Alert. */
    interface IAlert {

        /** Alert msg */
        msg?: (murdermystery.Alert.Msg|null);
    }

    /** Represents an Alert. */
    class Alert implements IAlert {

        /**
         * Constructs a new Alert.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IAlert);

        /** Alert msg. */
        public msg: murdermystery.Alert.Msg;

        /**
         * Creates a new Alert instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Alert instance
         */
        public static create(properties?: murdermystery.IAlert): murdermystery.Alert;

        /**
         * Encodes the specified Alert message. Does not implicitly {@link murdermystery.Alert.verify|verify} messages.
         * @param message Alert message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IAlert, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Alert message, length delimited. Does not implicitly {@link murdermystery.Alert.verify|verify} messages.
         * @param message Alert message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IAlert, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Alert message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Alert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.Alert;

        /**
         * Decodes an Alert message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Alert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.Alert;

        /**
         * Verifies an Alert message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Alert message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Alert
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.Alert;

        /**
         * Creates a plain object from an Alert message. Also converts values to other types if specified.
         * @param message Alert
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.Alert, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Alert to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace Alert {

        /** Msg enum. */
        enum Msg {
            UNKNOWN = 0,
            NEEDMOREPLAYERS = 1
        }
    }

    /** Properties of a SetCharacter. */
    interface ISetCharacter {

        /** SetCharacter character */
        character?: (murdermystery.SetCharacter.Character|null);
    }

    /** Represents a SetCharacter. */
    class SetCharacter implements ISetCharacter {

        /**
         * Constructs a new SetCharacter.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.ISetCharacter);

        /** SetCharacter character. */
        public character: murdermystery.SetCharacter.Character;

        /**
         * Creates a new SetCharacter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetCharacter instance
         */
        public static create(properties?: murdermystery.ISetCharacter): murdermystery.SetCharacter;

        /**
         * Encodes the specified SetCharacter message. Does not implicitly {@link murdermystery.SetCharacter.verify|verify} messages.
         * @param message SetCharacter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.ISetCharacter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetCharacter message, length delimited. Does not implicitly {@link murdermystery.SetCharacter.verify|verify} messages.
         * @param message SetCharacter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.ISetCharacter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetCharacter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetCharacter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.SetCharacter;

        /**
         * Decodes a SetCharacter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetCharacter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.SetCharacter;

        /**
         * Verifies a SetCharacter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetCharacter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetCharacter
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.SetCharacter;

        /**
         * Creates a plain object from a SetCharacter message. Also converts values to other types if specified.
         * @param message SetCharacter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.SetCharacter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetCharacter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace SetCharacter {

        /** Character enum. */
        enum Character {
            NONE = 0,
            CITIZEN = 1,
            WEREWOLF = 2,
            HEALER = 3,
            PROPHET = 4,
            HUNTER = 5
        }
    }

    /** Properties of a FellowWolves. */
    interface IFellowWolves {

        /** FellowWolves ids */
        ids?: (number[]|null);
    }

    /** Represents a FellowWolves. */
    class FellowWolves implements IFellowWolves {

        /**
         * Constructs a new FellowWolves.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IFellowWolves);

        /** FellowWolves ids. */
        public ids: number[];

        /**
         * Creates a new FellowWolves instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FellowWolves instance
         */
        public static create(properties?: murdermystery.IFellowWolves): murdermystery.FellowWolves;

        /**
         * Encodes the specified FellowWolves message. Does not implicitly {@link murdermystery.FellowWolves.verify|verify} messages.
         * @param message FellowWolves message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: murdermystery.IFellowWolves, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FellowWolves message, length delimited. Does not implicitly {@link murdermystery.FellowWolves.verify|verify} messages.
         * @param message FellowWolves message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: murdermystery.IFellowWolves, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FellowWolves message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FellowWolves
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): murdermystery.FellowWolves;

        /**
         * Decodes a FellowWolves message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FellowWolves
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): murdermystery.FellowWolves;

        /**
         * Verifies a FellowWolves message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FellowWolves message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FellowWolves
         */
        public static fromObject(object: { [k: string]: any }): murdermystery.FellowWolves;

        /**
         * Creates a plain object from a FellowWolves message. Also converts values to other types if specified.
         * @param message FellowWolves
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: murdermystery.FellowWolves, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FellowWolves to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
