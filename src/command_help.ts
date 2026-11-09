import { type State } from "./state.js";

export async function commandHelp(state: State): Promise<void> {
    console.log("Welcome to the Pokedex!");
    console.log("Usage:\n");

    for (const [commandName, command] of Object.entries(state.commands)) {
        console.log(`${commandName}: ${command.description}`);
  }
}
