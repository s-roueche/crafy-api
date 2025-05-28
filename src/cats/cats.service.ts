import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
  private readonly cats: string[] = ['Feria', 'Lucky'];

  findAll(): string[] {
    return this.cats;
  }

  create(cat: string) {
    this.cats.push(cat);
  }
}
