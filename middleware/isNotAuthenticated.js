export default function({ store, redirect }) {
	console.log('isNotAuthenticated middleware accessToken', store.state.accessToken)
	if (store.state.accessToken) {
		redirect('/');
	}
}