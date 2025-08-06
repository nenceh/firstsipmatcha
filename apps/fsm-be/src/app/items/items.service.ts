import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService){}

  create(createItemInput: CreateItemInput) {
    return 'This action adds a new item';
  }

  findAll() {
    return this.prisma.item.findMany();
  }

  findOne(itemId: string) {
    return this.prisma.item.findFirst({
      where: {
        itemId,
      }
    });
  }

  async searchItems(term: string): Promise<Item[]> {
    const lowercaseTerm = term.toLowerCase();
    return this.prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: lowercaseTerm, mode: 'insensitive' } },
          { description: { contains: lowercaseTerm, mode: 'insensitive' } },
        ],
      },
    });
  }

  async searchTag(tag: string): Promise<Item[]> {
    const lowercaseTerm = tag.toLowerCase();
    
    return this.prisma.item.findMany({
      where: {
        tags:{ has: lowercaseTerm }
      },
    });
  }
}
