import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import authorsIcon from '@fortawesome/fontawesome-free/svgs/solid/user.svg';

export default class Authors extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'authors', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Insert author',
				icon: authorsIcon,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {
				editor.model.change( writer => {
					const authorElement = writer.createElement( 'image', {
						src: 'Simon Hyll'
					} );

					// Insert the image in the current selection location.
					editor.model.insertContent( authorElement, editor.model.document.selection );
				} );
			} );

			return view;
		} );
	}
}
