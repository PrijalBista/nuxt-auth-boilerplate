export default function({ $axios, redirect, store }) {

  // configuration on each axios request
  $axios.onRequest(config => {
    // set isLoading true
    store.commit('setLoading', true);

    // set bearer token if available
    if (store.state.accessToken) {
      config.headers.common['Authorization'] = `Bearer ${store.state.accessToken}`;
    }
  });

  $axios.onResponse(response => {
    // set isLoading false
    store.commit('setLoading', false);
  });

  $axios.onError(error => {
    store.commit('setLoading', false);
  });

}