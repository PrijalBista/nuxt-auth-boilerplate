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
            href="https://github.com/PrijalBista/nuxt-auth-boilerplate"
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
