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
