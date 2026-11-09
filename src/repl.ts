import { createInterface } from "node:readline";
import { initState, type State } from "./state.js";

export function cleanInput(input: string): string[] {
    const formattedInput = input.trim().toLowerCase();
    const tokens = formattedInput.split(/\s+/);
    return tokens[0].length > 0 ? tokens : [];
}

export async function startREPL(state: State) {
    state.rl.prompt();
    state.rl.on("line", async (line) => {
        const tokens = cleanInput(line);
        if (tokens.length === 0) {
            state.rl.prompt();
            return;
        }

        const userCommand = tokens[0];
        const args = tokens.slice(1);

        if (userCommand in state.commands) {
            try {
                await state.commands[userCommand].callback(state, ...args);
            } catch (err) {
                if (err instanceof Error) {
                    console.log(`${userCommand}: ${err}`);
                }
            }
        } else {
            console.log("Unknown command");
        }

        state.rl.prompt();
    });
}
