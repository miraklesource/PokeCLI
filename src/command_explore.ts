import { PokeAPI } from "./pokeapi.js";
import { State } from "./state.js";
import { Location } from "./pokeapi.js";

export async function commandExplore(state: State, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("invalid number of arguments");
    }

    let location: Location;

    try {
        location = await state.pokeAPI.fetchLocation(args[0]);
    } catch (err) {
        throw new Error(`${args[0]} is not a valid location area.`);
    }

    console.log(`Exploring ${args[0]}...`);
    console.log("Found Pokemon:");

    for (const encounter of location.pokemon_encounters) {
        console.log(`- ${encounter.pokemon.name}`);
    }
}
