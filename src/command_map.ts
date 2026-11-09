import { type State } from "./state.js";
import { PokeAPI } from "./pokeapi.js";

export async function commandMap(state: State) {
    const locations = await state.pokeAPI.fetchLocations(
        state.nextLocationsURL,
    );

    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;

    for (const location of locations.results) {
        console.log(location.name);
    }
}

export async function commandMapBack(state: State) {
    if (!state.prevLocationsURL) {
        throw new Error("you're on the first page");
    }

    const locations = await state.pokeAPI.fetchLocations(
        state.prevLocationsURL,
    );

    state.nextLocationsURL = locations.next;
    state.prevLocationsURL = locations.previous;

    for (const location of locations.results) {
        console.log(location.name);
    }
}
