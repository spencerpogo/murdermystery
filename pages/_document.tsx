import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

export default class Document extends NextDocument {
  static getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    return NextDocument.getInitialProps(ctx);
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          {/* Chakra UI Color Mode Script */}
          <ColorModeScript initialColorMode="dark" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
