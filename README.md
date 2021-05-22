# nuxt-auth-boilerplate
nuxt-auth-boilerplate (ssr:false)

This is build from scratch using store and custom plugins. no use of prebuilt package like @nuxt/auth.
Couple of things to note about the implementation:
- works only on ssr mode set to false `ssr:false` on nuxt.config.js
- only basic auth flow is set up, i.e sign in with email,password. Other things like Social logins(eg- login with google), forgot password, is not present in this repo
- assumes api endpoint for login on backend is `/api/auth/login` which u can change on `pages/auth/login.vue`

> Special thanks to [kritish dhaubanjar](https://github.com/kritish-dhaubanjar)
### Structure for authentication 
```
... typical nuxt directory structure with following added files
|-layouts
  |-default.vue
  |-blank.vue    -> blank layout for login page
|-middleware
  |-isAuthenticated.js -> for pages that are accessible to authenticated users only (eg- profile page)
  |-isNotAuthenticated.js -> for pages that are accessible to guest users only (eg- login page)
|-pages
  |-auth
    |-login.vue   -> login page (uses blank layout)
|-plugins
  |-axios.js   -> setup axios configuration (headers, setIsLoading, etc)
  |-init.js    -> initializeAuth (populate user and accessToken state of store if accessToken available in localstorage)
|-store
  |-index.js  -> contains state for user, accessToken, isLoading, mutations, actions, etc for authentication
```

#### These settings are applied on nuxt.config that are to be considered
```js
export default {
  ssr: false, // server side rendering set to false (changing this may cause problem in authentication)
  //...
  plugins: ['~/plugins/init.js', '~plugins/axios.js'], // order is important here init.js plugin should come before axios.js plugin
  modules: [
    '@nuxtjs/axios',
  ],
  
  axios: {
    baseURL:
    process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : 'http://localhost:8000/api' // url for backend which will be used by axios on request
  },
}
```
### Note
1. `ssr: false` is required because, not setting this will result in unusual behavior of middleware. This is due to execution of middleware on server side
read more [here](https://nuxtjs.org/docs/2.x/directory-structure/middleware)
2. init.js should come before axios.js because axios.js sets authorization header (bearer token) which is available only after init.js is executed
as it sets the accessToken state of store.


### Usage

You can clone this repo for starter template:


`git clone git@github.com:PrijalBista/nuxt-auth-boilerplate.git`


`cd nuxt-auth-boilerplate`


`npm install`


`npm run dev`


Or you can implement this authentication using the steps below:

1. add axios if not already added

`npm install @nuxtjs/axios`

2. Configure axios on `nuxt.config.js`
```js
export default {

  modules: [
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL:
    process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : 'http://localhost:8000/api' // url for backend which will be used by axios on request
  },
}
```

3. Add `/store/index.js` file with following code
```js
export const state = () => ({
	user: null,
	accessToken: null,
	isLoading: true,
});

export const mutations = {
	setAccessToken(state, payload) {
		state.accessToken = payload;
		localStorage.setItem('access_token', payload);
	},

	setUser(state, payload) {
		state.user = payload;
	},

	setLoading(state, payload) {
		state.isLoading = payload || false;
	},

	resetTokenAndUser(state) {
		state.accessToken = null;
		state.user = null;
		localStorage.removeItem('access_token');
		this.$router.replace('/auth/login');
	}
};

export const actions = {

	asyncInitAuth() {
		const accessToken = localStorage.getItem('access_token');

		if (accessToken) {
				this.commit('setAccessToken', accessToken);

				this.$axios
					.get('/auth/user', {
						headers: {
						Authorization: `Bearer ${accessToken}`
					}
					})
					.then(({ data }) => {
						this.commit('setUser', data);
					})
					.catch(error => {
						console.log('errorhere', error);
						// this.commit('resetTokenAndUser');
					});
			}
	},

	asyncResetAuth() {
		const accessToken = localStorage.getItem('access_token');
		this.$axios
			.post('/auth/logout', null, {
				headers: {
				Authorization: `Bearer ${accessToken}`
				}
			})
			.finally(() => {
				this.commit('resetTokenAndUser');
			});
	}

};

```
4.  Add init.js file inside plugins directory `/plugins/init.js` and add following code
```js
export default function({ store }) {
	if(process.browser){
		console.log('initialize authentication')
		store.dispatch('asyncInitAuth');
	}
}
```
5. Add axios.js plugin as well `plugins/axios.js` and add following code
```js
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

```
6. Add these plugins in following order in `nuxt.config.js`
```js
export default {
  //...
  plugins: ['~/plugins/init.js', '~plugins/axios.js'],
}
```
7. Add a simple blank layout on `/layouts/blank.vue` with following code:
```js
<template>
  <div>
    <Nuxt />
  </div>
</template>
```
8. Add isAuthentiated.js middleware /middleware/isAuthentiated.js` with following code
```js
export default function({ store, redirect }) {
	if (!store.state.accessToken) {
		redirect('/auth/login');
	}
}
```
9. Add isNotAuthentiated.js middleware /middleware/isNotAuthentiated.js` with following code
```js
export default function({ store, redirect }) {
	console.log('isNotAuthenticated middleware accessToken', store.state.accessToken)
	if (store.state.accessToken) {
		redirect('/');
	}
}
```
10. Add ssr:false to `nuxt.config.js` on first line.
```js
export default {
  ssr: false,
  //...
}
```
11. Create a simple login page to test out authentication module on `/pages/auth/login.vue` with following code
```js
<template>
	<div class="container center">
		<div class="login-form">
			<h3 class="form-title">LOGIN PAGE</h3>
			<br>
			<form @submit.prevent="login">
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" required v-model="email">
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" required v-model="password">
				</div>
				<div class="form-group text-center">
					<button class="btn btn-submit">Submit</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
	export default {
		layout: 'blank',

		middleware: ['isNotAuthenticated'],

		data() {
			return {
				email: '',
				password: '',
				errors: {},
			};
		},

		methods: {
			login() {
				// todo 
				console.log('logging in in the backend');
				const data = {
					email: this.email,
					password: this.password,
				}
				this.$axios
					.post('auth/login', data)
					.then(({ data }) => {
						// assuming data recieved is of structure
						//{ access_token: 'ACCESS_TOKEN', user: {} }
						console.log(data);
						this.$store.commit('setAccessToken', data.access_token);
						this.$store.commit('setUser', data.user);
						this.$router.push('/');
					})
					.catch(err => {
						// handle err
						console.log(err);
					});
			}
		}
	};
</script>

<style scoped>
	.container {
		height: 99vh;
		background: #eee;
	}
	.center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-form {
		background: #fff;
		box-shadow: 1px 2px 4px #eee;
		padding: 40px;
	}

	.form-group {
		padding: 5px 0;
	}
	.form-group input {
		width: 100%;
		margin: 2px 0 5px;
		border: 1px solid #ccc;
		padding: 10px;
		border-radius: 0;
		color: #333;
	}
	.form-group label {
		color: #333;
		font-size: 14px;
	}

	.btn {
		padding: 10px;
		border: 0;
		background: #c7c7c7;
		cursor: pointer;
	}
	.btn-submit {
		background: #028762;
		margin-top: 5px;
		color: #fff;
	}
	.btn-submit:hover {
		background: #028752;
		color: #ccc;
	}
	.text-center {
		text-align: center;
	}

	.form-title {
		margin-bottom: 8px;
		color: #333;
		text-align: center;
	}
</style>
```
12. Add login/logout btn and update `/index.vue` page with following code
```js
<template>
  <div class="container">
    <nav class="navbar">
        <div class="" v-if="$store.state.user">
          <span class="welcome-text">Welcome, {{ $store.state.user.name ? $store.state.user.name: ''}}</span>
          <a @click.prevent="() => {$store.dispatch('asyncResetAuth');}" class="nav-link">
            Logout
          </a>
        </div>
        <div class="" v-else>
          <nuxt-link class="nav-link" to="/auth/login">Login</nuxt-link>
        </div>
    </nav>
    <div class="d-center">
      <div>
        <Logo />
        <h1 class="title">
          nuxt-auth-boilerplate
        </h1>
        <div class="description">
          <p>build from scratch using store and custom plugins. no use of prebuilt package like @nuxt/auth</p>
          <p class="danger">works only on ssr disabled mode (ssr:false) on nuxt.config.js</p>
        </div>
        <div class="links">
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank"
            rel="noopener noreferrer"
            class="button--grey"
          >
            GitHub
          </a>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.container {
  margin: 0 auto;
}
.navbar {
  text-align: right;
  padding: 20px;
}
.navbar .nav-link {
  padding: 10px 15px;
  margin-left: 10px;
  text-decoration: none;
  color: #35495e;
  border: 1px solid #eee;
  cursor: pointer;
}
.navbar .nav-link:active {
  text-decoration: none;
  color: #0a1622;
}
.navbar .nav-link:hover {
  color: #0a1622;
  border: 1px solid #ccc;
}
.navbar .welcome-text {
  color: #aaa;
}
.d-center {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}

.description {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 20px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.danger {
  color: tomato;
}
</style>
```
End !
