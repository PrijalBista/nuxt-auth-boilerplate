export default function({ store, redirect }) {
	if (!store.state.accessToken) {
		redirect('/auth/login');
	}
}