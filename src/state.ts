import { createInterface, type Interface } from "readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap, commandMapBack } from "./command_map.js";
import { PokeAPI, Pokemon } from "./pokeapi.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { commandInspect } from "./command_inspect.js";
import { commandPokedex } from "./command_pokedex.js";

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
    prevLocationsURL: string | null;
    nextLocationsURL: string | null;
    pokeAPI: PokeAPI;
    pokedex: Record<string, Pokemon>;
};

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
};

export function initState(cacheInterval: number): State {
    const commandList = {
        help: {
            name: "help",
            description: "Displays a help message",
            callback: commandHelp,
        },
        exit: {
            name: "exit",
            description: "Exit the Pokedex",
            callback: commandExit,
        },
        map: {
            name: "map",
            description:
                "Show the next 20 locations from the Pokemon world (each call scrolls foward in the list)",
            callback: commandMap,
        },
        mapb: {
            name: "mapb",
            description:
                "Show the previous 20 locations from the Pokemon world (each call goes scrolls backward in the list)",
            callback: commandMapBack,
        },
        explore: {
            name: "explore",
            description: "Show all the pokemon that appear in a given location",
            callback: commandExplore,
        },
        catch: {
            name: "catch",
            description: "Attempt to catch a given Pokemon",
            callback: commandCatch,
        },
        inspect: {
            name: "inspect",
            description: "Show info about a Pokemon you have caught",
            callback: commandInspect,
        },
        pokedex: {
            name: "pokedex",
            description: "Show the list of all the Pokemon you have caught",
            callback: commandPokedex,
        },
    };

    const prompt = "Pokedex > ";
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: prompt,
    });

    return {
        rl: rl,
        commands: commandList,
        prevLocationsURL: null,
        nextLocationsURL: null,
        pokeAPI: new PokeAPI(cacheInterval),
        pokedex: {},
    };
}
