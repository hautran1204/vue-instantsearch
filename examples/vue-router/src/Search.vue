<template>
  <ais-instant-search
    :search-client="searchClient"
    index-name="instant_search"
    :routing="instantSearchRouting"
  >
    <ais-configure :hitsPerPage="16" />

    <header class="header">
      <img class="logo" src="https://res.cloudinary.com/hilnmyskv/image/upload/w_100,h_100,dpr_2.0//v1461180087/logo-instantsearchjs-avatar.png" width="40">
      <ais-search-box placeholder="Search a product" />
    </header>

    <main>
      <aside>
        <ais-clear-refinements>
          <template slot="resetLabel">Clear all filters</template>
        </ais-clear-refinements>

        <ais-panel>
          <template slot="header">Categories</template>
          <ais-hierarchical-menu
            :attributes="[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
            ]"
          />
        </ais-panel>

        <ais-panel>
          <template slot="header">Brands</template>
          <ais-refinement-list attribute="brand" />
        </ais-panel>

        <ais-panel>
          <template slot="header">Rating</template>
          <ais-rating-menu attribute="rating" :max="5" />
        </ais-panel>

        <ais-panel>
          <template slot="header">Price</template>
          <ais-range-input attribute="price" />
        </ais-panel>

        <div class="thank-you">
          Data courtesy of <a href="https://developer.bestbuy.com/">Best Buy</a>
        </div>
      </aside>

      <section>
        <header class="section-header">
          <ais-stats />
          <div class="sort-by">
            <label>Sort by</label>
            <ais-sort-by
              :items="[
                { name: 'instant_search', label: 'Featured' },
                { name: 'instant_search_price_asc', label: 'Price asc.' },
                { name: 'instant_search_price_desc', label: 'Price desc.' },
              ]"
            />
          </div>
        </header>

        <button @click="push">test out</button>
        <button @click="log">log out</button>

        <ais-search-state>
          <template slot-scope="{ query, hits }">
            <p class="no-results" v-if="hits.length === 0">
              No results found matching <em>{{ query }}</em>.
            </p>
          </template>
        </ais-search-state>

        <ais-hits>
          <article
            slot="item"
            slot-scope="{ item }"
            class="hit"
          >
            <div class="product-desc-wrapper">
              <div class="product-name">
                <ais-highlight attribute="name" :hit="item" />
              </div>
              <div class="product-type">
                <ais-highlight attribute="type" :hit="item" />
              </div>
              <div class="product-footer">
                <div class="ais-RatingMenu-link">
                  <svg
                    v-for="(_,i) in 5"
                    :key="i"
                    :class="[
                      'ais-RatingMenu-starIcon',
                      i >= item.rating && 'ais-RatingMenu-starIcon--empty'
                    ]"
                    aria-hidden="true"
                    width="24"
                    height="24"
                  >
                    <use
                      :xlink:href="`#ais-RatingMenu-star${i >= item.rating ? 'Empty' : ''}Symbol`"
                    />
                  </svg>
                </div>
                <div class="product-price">${{ item.price }}</div>
              </div>
            </div>
          </article>
        </ais-hits>
        <footer>
          <ais-pagination />
        </footer>
      </section>
    </main>
  </ais-instant-search>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import { router } from './main.js';
import objectFromEntries from 'object.fromentries';

export default {
  data() {
    return {
      searchClient: algoliasearch(
        'latency',
        '6be0576ff61c053d5f9a3225e2a90f76'
      ),
      instantSearchRouting: {
        router: {
          read() {
            return router.currentRoute.query;
          },
          write(routeState) {
            router.push({
              query: routeState
            });
          },
          createURL(routeState) {
            return router.resolve({
              query: routeState
            }).href;
          },
          onUpdate() {},
          dispose() {}
        },
        stateMapping: {
          stateToRoute(uiState) {
            return objectFromEntries(
              Object.entries(uiState).map(([widgetName, value]) => {
                if (typeof value === 'object') {
                  return [widgetName, Object.entries(value)];
                }
                return [widgetName, value];
              })
            );
          },
          routeToState(routeState) {
            return objectFromEntries(
              Object.entries(routeState).map(([widgetName, value]) => {
                if (value.includes(',')) {
                  const [attribute, ...values] = value.split(',');
                  // works for hierarchical menu and refinement list, since they wrap in array
                  return [widgetName, { [attribute]: values }];
                }
                return [widgetName, value];
              })
            );
          }
        }
      }
    };
  },
  methods: {
    log() {
      // eslint-disable-next-line no-console
      console.log(this.$router);
      // eslint-disable-next-line no-console
      console.log(this.$router.currentRoute);
    },
    push() {
      this.$router.push({
        query: {
          hi: 'there',
          lol: [1, 2],
          obj: { yeah: 'no' }
        }
      });
    }
  }
};
</script>

<style>
.thank-you {
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}

.ais-Panel {
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sort-by {
  display: flex;
  align-items: center;
}

.sort-by label {
  margin-right: 5px;
}

.no-results {
  text-align: center;
}
</style>
