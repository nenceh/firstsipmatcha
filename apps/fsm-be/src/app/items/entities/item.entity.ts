import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => String)
  itemId!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => [String])
  tags!: string[];

  @Field()
  img!: string;
  
  @Field()
  catId!: string;
}
