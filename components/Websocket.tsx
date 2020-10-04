/* Adapted from https://github.com/mehmetkose/react-websocket */
import { Component } from "react";

class Websocket extends Component {
  props: {
    onMessage: (msg: string) => void;
    onOpen?: (ws: WebSocket) => void;
    onClose?: (c: CloseEvent) => void;
    onError?: (e: Event) => void;
    url: string;
    protocol?: string;
  };
  state: {
    ws: WebSocket;
  };

  constructor(props: {
    onMessage: (msg: string) => void;
    onOpen?: (ws: WebSocket) => void;
    onClose?: (c: CloseEvent) => void;
    onError?: (e: Event) => void;
    url: string;
    protocol?: string;
  }) {
    super(props);
    this.state = {
      ws: new window.WebSocket(this.props.url, this.props.protocol),
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.setupWebsocket = this.setupWebsocket.bind(this);
  }

  sendMessage(message: string) {
    let websocket = this.state.ws;
    websocket.send(message);
  }

  setupWebsocket() {
    let websocket = this.state.ws;

    websocket.onopen = () => {
      if (typeof this.props.onOpen === "function") this.props.onOpen(websocket);
    };

    websocket.onerror = (e) => {
      if (typeof this.props.onError === "function") this.props.onError(e);
    };

    websocket.onmessage = (evt) => {
      this.props.onMessage(evt.data);
    };

    websocket.onclose = (evt) => {
      if (typeof this.props.onClose === "function") this.props.onClose(evt);
    };
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    try {
      this.state.ws.close();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return null;
  }
}

export default Websocket;
