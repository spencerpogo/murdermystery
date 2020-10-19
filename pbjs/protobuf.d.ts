import * as $protobuf from "protobufjs";
/** Namespace murdermystery. */
export namespace murdermystery {

    /** Properties of a Handshake. */
    interface IHandshake {

        /** Handshake error */
        error?: (string|null);
    }

    /** Represents a Handshake. */
    class Handshake implements IHandshake {

        /**
         * Constructs a new Handshake.
         * @param [properties] Properties to set
         */
        constructor(properties?: murdermystery.IHandshake);

        /** Handshake error. */
        public error: string;

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
}
