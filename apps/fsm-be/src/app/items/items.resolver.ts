import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/create-item.input';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('itemId', { type: () => String }) itemId: string) {
    return this.itemsService.findOne(itemId);
  }

  @Query(() => [Item], { name: 'searchItems' })
  searchItems(@Args('term', { type: () => String }) term: string) {
    return this.itemsService.searchItems(term);
  }

  @Query(() => [Item], { name: 'searchTag' })
  searchTag(@Args('tag', { type: () => String }) tag: string) {
    return this.itemsService.searchTag(tag);
  }
}
