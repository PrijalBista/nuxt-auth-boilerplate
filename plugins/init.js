export default function({ store }) {
	if(process.browser){
		console.log('initialize authentication')
		store.dispatch('asyncInitAuth');
	}
}