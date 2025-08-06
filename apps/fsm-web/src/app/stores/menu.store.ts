import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Item } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, map, tap } from 'rxjs';

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

export interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
};

export const MenuStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),

  withMethods((store, apollo = inject(Apollo)) => ({
    loadItems() {
      patchState(store, { loading: true, error: null });
      apollo
        .watchQuery<{ items: Item[] }>({
          query: GET_ITEMS,
        })
        .valueChanges.pipe(
          tap({
            next: ({ data }) =>
              patchState(
                store,
                {
                  items: data.items,
                  loading: false
                }
              ),
            error: (error) =>
              patchState(
                store,
                {
                  error: error.message,
                  loading: false
                }
              ),
          })
        )
        .subscribe();
    },

    getItem(itemId: string){
      patchState(store, { loading: true, error: null });
      apollo
        .query<{ item: Item }>({
          query: GET_ITEM,
          variables: {
            itemId: itemId,
          }
        })
        .pipe(
          map(({ data }) =>
            patchState(
              store,
              {
                items: [data.item],
                loading: false
              }
            )
          ),
          catchError((error) => {
            patchState(
              store,
              {
                error: error.message,
                loading: false
              }
            )
            return EMPTY;
          })
        )
        .subscribe();
    },

    searchItems(term: string) {
      patchState(store, { loading: true, error: null });
      apollo
        .query<{ searchItems: Item[] }>({
          query: SEARCH_ITEMS,
          variables: {
            searchTerm: term,
          }
        })
        .pipe(
          map(({ data }) =>
            patchState(
              store,
              {
                items: data.searchItems,
                loading: false
              }
            )
          ),
          catchError((error) => {
            patchState(
              store,
              {
                error: error.message,
                loading: false
              }
            )
            return EMPTY;
          })
        )
        .subscribe();
    },

    searchTag(tag: string) {
      patchState(store, { loading: true, error: null });
      apollo
        .query<{ searchTag: Item[] }>({
          query: SEARCH_TAG,
          variables: {
            searchTag: tag,
          }
        })
        .pipe(
          map(({ data }) =>
            patchState(
              store,
              {
                items: data.searchTag,
                loading: false
              }
            )
          ),
          catchError((error) => {
            patchState(
              store,
              {
                error: error.message,
                loading: false
              }
            )
            return EMPTY;
          })
        )
        .subscribe();
    },
  }))
);