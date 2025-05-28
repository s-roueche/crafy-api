import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  findAll(): string[] {
    return this.catsService.findAll();
  }

  @Get(':index')
  findOne(@Param('index') index: number): string {
    return this.catsService.findOne(index);
  }

  @Post()
  create(@Body() cat: string) {
    this.catsService.create(cat);
  }
}
