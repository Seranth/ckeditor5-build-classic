import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import signaturesIcon from '@fortawesome/fontawesome-free/svgs/solid/signature.svg';

export default class Signatures extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'signatures', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Insert signature',
				icon: signaturesIcon,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {

			} );

			return view;
		} );
	}
}
