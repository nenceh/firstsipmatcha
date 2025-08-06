import { inject, Injectable } from '@angular/core';
import { Item } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, map } from 'rxjs';

const GET_ITEMS = gql`
  query GetItems {
    items {
      itemId
      name
      description
      price
      tags
      img
      catId
    }
  }
`;

const GET_ITEM = gql`
  query GetItem ($itemId: String!) {
    item(itemId: $itemId) {
      itemId
      name
      description
      price
      tags
      img
      catId
    }
  }
`;

const SEARCH_ITEMS = gql`
  query SearchItems($searchTerm: String!) {
    searchItems(term: $searchTerm) {
      itemId
      name
      description
      price
      tags
      img
      catId
    }
  }
`;

const SEARCH_TAG = gql`
  query SearchTag($searchTag: String!) {
    searchTag(tag: $searchTag) {
      itemId
      name
      description
      price
      tags
      img
      catId
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  item!: Item;
  items: Item[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private readonly apollo: Apollo){
    apollo = inject(Apollo)
  }

  loadItems(){
    this.loading = true;
    this.error = null;
    this.apollo
      .query<{ items: Item[] }>({
        query: GET_ITEMS,
      })
      .pipe(
        map(({ data }) => {
          this.items = data.items;
          this.loading = false;
        }),
        catchError((error) => {
          this.error = error.message;
          this.loading = false;
          return EMPTY;          
        })
      )
      .subscribe();
  }

  getItem(itemId: string){
    this.items = [];
    this.loading = true;
    this.error = null;
    this.apollo
      .query<{ item: Item }>({
        query: GET_ITEM,
        variables: {
          itemId: itemId,
        }
      })
      .pipe(
        map(({ data }) => {
          this.item = data.item;
          this.loading = false;
        }),
        catchError((error) => {
          this.error = error.message;
          this.loading = false;
          return EMPTY;          
        })
      )
      .subscribe();
  }

  searchItems(term: string) {
    this.items = [];
    this.loading = true;
    this.error = null;

    this.apollo
      .query<{ searchItems: Item[] }>({
        query: SEARCH_ITEMS,
        variables: {
          searchTerm: term,
        }
      })
      .pipe(
        map(({ data }) => {
          this.items = data.searchItems;
          this.loading = false;
        }),
        catchError((error) => {
          this.error = error.message;
          this.loading = false;
          return EMPTY;          
        })
      )
      .subscribe();
  }

  searchTag(tag: string) {
    this.loading = true;
    this.error = null;

    this.apollo
      .query<{ searchTag: Item[] }>({
        query: SEARCH_TAG,
        variables: {
          searchTag: tag,
        }
      })
      .pipe(
        map(({ data }) => {
          this.items = data.searchTag;
          this.loading = false;
        }),
        catchError((error) => {
          this.error = error.message;
          this.loading = false;
          return EMPTY;          
        })
      )
      .subscribe();
  }
}
