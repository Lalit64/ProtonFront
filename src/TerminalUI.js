import { Terminal } from "xterm";
import "./xterm.css";
import {FitAddon} from "xterm-addon-fit"

export class TerminalUI {
    constructor(socket) {
        this.terminal = new Terminal();

        /** You can make your terminals colorful */
        this.terminal.setOption("theme", {
            background: "#242C36",
            foreground: "#A5B3C2",
            brightBlue: "#00B4F6",
            brightCyan: "#EF925C",
            brightRed: "#FF4E74",
            brightGreen: "#78C86E",
            green: "#78C86E",
            brightYellow: "#FCBC6F",
            yellow: "#FCBC6F"
        });

        this.terminal.setOption('cursorStyle', 'underline')

        this.terminal.setOption("fontFamily", "JetBrains Mono")

        this.socket = socket;

        let fitAddon = new FitAddon()
        this.terminal.loadAddon(fitAddon)
        fitAddon.fit()
    }

    /**
     * Attach event listeners for terminal UI and socket.io client
     */
    startListening() {
        this.terminal.onData(data => this.sendInput(data));
        this.socket.on("output", data => {
            // When there is data from PTY on server, print that on Terminal.
            this.write(data);
        });
    }

    /**
     * Print something to terminal UI.
     */
    write(text) {
        this.terminal.write(text);
    }

    /**
     * Utility function to print new line on terminal.
     */
    prompt() {
        this.terminal.write(`\r\n$ `);
    }

    /**
     * Send whatever you type in Terminal UI to PTY process in server.
     * @param {*} input Input to send to server
     */
    sendInput(input) {
        this.socket.emit("input", input);
    }

    /**
     *
     * @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
     */
    attachTo(container) {
        this.terminal.open(container);
        // Default text to display on terminal.
    }

    clear() {
        this.terminal.clear();
    }
}
