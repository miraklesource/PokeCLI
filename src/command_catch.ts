import { Pokemon } from "./pokeapi.js";
import { State } from "./state.js";

export async function commandCatch(state: State, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("invalid number of arguments");
    }

    const pokemonName = args[0].toLowerCase();
    let pokemonInfo: Pokemon;

    try {
        pokemonInfo = await state.pokeAPI.fetchPokemon(pokemonName);
    } catch (err) {
        throw new Error(`${pokemonName} is not a valid Pokemon name.`);
    }

    console.log(`Throwing a Pokeball at ${pokemonName}...`);
    const roll = Math.floor(Math.random() * pokemonInfo.base_experience);
    const success = roll < 50;

    if (success) {
        console.log(`${pokemonName} was caught!`);
        console.log("You may now inspect it with the inspect command.");
    } else {
        console.log(`${pokemonName} escaped!`);
    }

    if (success && !(pokemonName in state.pokedex)) {
        state.pokedex[pokemonName] = pokemonInfo;
    }
}
