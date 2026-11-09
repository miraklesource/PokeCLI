import { Cache } from "./pokecache.js";

export class PokeAPI {
    static readonly baseURL = "https://pokeapi.co/api/v2";
    private cache: Cache;

    constructor(cacheInterval: number) {
        this.cache = new Cache(cacheInterval);
    }

    closeCache() {
        this.cache.stopReapLoop();
    }

    async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
        const url = pageURL ?? `${PokeAPI.baseURL}/location-area`;
        const cachedResult = this.cache.get<ShallowLocations>(url);

        if (cachedResult !== undefined) {
            return cachedResult;
        }

        const response = await fetch(url);
        const locations: ShallowLocations = await response.json();
        this.cache.add(url, locations);

        return locations;
    }

    async fetchLocation(locationName: string): Promise<Location> {
        const url = `${PokeAPI.baseURL}/location-area/${locationName}/`;
        const cachedResult = this.cache.get<Location>(url);

        if (cachedResult !== undefined) {
            return cachedResult;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("invalid location area");
        }

        const location = await response.json();
        this.cache.add(url, location);

        return location;
    }

    async fetchPokemon(pokemonName: string): Promise<Pokemon> {
        const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}/`;
        const cachedResult = this.cache.get<Pokemon>(url);

        if (cachedResult !== undefined) {
            return cachedResult;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("invalid Pokemon name");
        }

        const pokemon = await response.json();
        this.cache.add(url, pokemon);

        return pokemon;
    }
}

export type ShallowLocations = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
        name: string;
        url: string;
    }>;
};

export type Location = {
    id: number;
    name: string;
    game_index: number;
    encounter_method_rates: Array<{
        encounter_method: {
            name: string;
            url: string;
        };
        version_details: Array<{
            rate: number;
            version: {
                name: string;
                url: string;
            };
        }>;
    }>;
    location: {
        name: string;
        url: string;
    };
    names: Array<{
        name: string;
        language: {
            name: string;
            url: string;
        };
    }>;
    pokemon_encounters: Array<{
        pokemon: {
            name: string;
            url: string;
        };
        version_details: Array<{
            version: {
                name: string;
                url: string;
            };
            max_chance: number;
            encounter_details: Array<{
                min_level: number;
                max_level: number;
                chance: number;
                method: {
                    name: string;
                    url: string;
                };
                condition_values: Array<{
                    name: string;
                    url: string;
                }>;
                pokemon_details: any;
            }>;
        }>;
    }>;
};

export type Pokemon = {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    stats: {
        base_stat: number;
        stat: {
            name: string;
        };
    }[];
    types: {
        type: {
            name: string;
        };
    }[];
};
