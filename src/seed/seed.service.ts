import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponse } from './interfaces/pokemon-response.intreface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon as PokemonInterface } from './interfaces/pokemon.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  async executedSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokemonResponse>(`https://pokeapi.co/api/v2/pokemon?limit=850`);

    const pokemonToInsert: PokemonInterface[] = [];

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');

      const no = +segments[segments.length - 2]

      // const createdPokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no })
    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Excuted';
  }
}
