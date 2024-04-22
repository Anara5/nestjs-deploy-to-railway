import {
    Controller,
    Get,
    Put,
    Delete,
    Post,
    Param,
    ParseIntPipe,
    Body,
    Scope,
    Query,
    DefaultValuePipe,
    UseGuards,
    Request
  } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song.dto';
import { Song } from './song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/auth/artists-jwt-guard';
import { ApiTags } from '@nestjs/swagger';
  
  @Controller('songs')
  @ApiTags('songs')
  export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    @UseGuards(ArtistJwtGuard)
    create(
      @Body() createSongDTO: CreateSongDTO,
      @Request() request
    ) : Promise<Song> {
      console.log('request.user: ', request.user);
      return this.songsService.create(createSongDTO);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
    ) : Promise<Pagination<Song>> {
        limit = limit > 100 ? 100 : limit;
        return this.songsService.paginate({
          page,
          limit
        });
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number
      ) : Promise<Song> {
      return this.songsService.findOne(id);
    }
  
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateSongDTO: UpdateSongDTO,
    ) : Promise<UpdateResult> {
      return this.songsService.update(id, updateSongDTO);
    }
  
    @Delete(':id')
    delete(
      @Param('id', ParseIntPipe) id: number
    ) : Promise<DeleteResult> {
      return this.songsService.remove(id);
    }
  }