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

