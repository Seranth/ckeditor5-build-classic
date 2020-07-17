import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';

class InsertAuthorBoxCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			// Insert <authorBox>*</authorBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			this.editor.model.insertContent( createAuthorBox( writer ) );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'authorBox' );

		this.isEnabled = allowedIn !== null;
	}
}

function createAuthorBox( writer ) {
	const authorBox = writer.createElement( 'authorBox' );
	const authorBoxDescription = writer.createElement( 'authorBoxDescription' );

	writer.append( authorBoxDescription, authorBox );

	// There must be at least one paragraph for the description to be editable.
	// See https://github.com/ckeditor/ckeditor5/issues/1464.
	writer.appendElement( 'paragraph', authorBoxDescription );

	return authorBox;
}

export default class AuthorBoxEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'insertAuthorBox', new InsertAuthorBoxCommand( this.editor ) );
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'authorBox', {
			// Behaves like a self-contained object (e.g. an image).
			isObject: true,

			// Allow in places where other blocks are allowed (e.g. directly in the root).
			allowWhere: '$block'
		} );

		schema.register( 'authorBoxImage', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'authorBox',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			allowContentOf: '$block'
		} );

		schema.register( 'authorBoxTitle', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'authorBox',

			// Allow content which is allowed in blocks (i.e. text with attributes).
			allowContentOf: '$block'
		} );

		schema.register( 'authorBoxDescription', {
			// Cannot be split or left by the caret.
			isLimit: true,

			allowIn: 'authorBox',

			// Allow content which is allowed in the root (e.g. paragraphs).
			allowContentOf: '$root'
		} );

		schema.addChildCheck( ( context, childDefinition ) => {
			if ( context.endsWith( 'authorBoxDescription' ) && childDefinition.name == 'authorBox' ) {
				return false;
			}
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// <authorBox> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'authorBox',
			view: {
				name: 'section',
				classes: 'author-box'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'authorBox',
			view: {
				name: 'section',
				classes: 'author-box'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'authorBox',
			view: ( modelElement, viewWriter ) => {
				const section = viewWriter.createContainerElement( 'section', { class: 'author-box' } );

				return toWidget( section, viewWriter, { label: 'author box widget' } );
			}
		} );

		// <authorBoxImage> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'authorBoxImage',
			view: {
				name: 'img',
				classes: 'author-box-image'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'authorBoxImage',
			view: {
				name: 'img',
				classes: 'author-box-image'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'authorBoxImage',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const img = viewWriter.createEditableElement( 'img', {
					class: 'author-box-image',
					src: ''
				} );

				return toWidgetEditable( img, viewWriter );
			}
		} );

		// <authorBoxTitle> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'authorBoxTitle',
			view: {
				name: 'h1',
				classes: 'author-box-title'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'authorBoxTitle',
			view: {
				name: 'h1',
				classes: 'author-box-title'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'authorBoxTitle',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const h1 = viewWriter.createEditableElement( 'h1', { class: 'author-box-title' } );

				return toWidgetEditable( h1, viewWriter );
			}
		} );

		// <authorBoxDescription> converters
		conversion.for( 'upcast' ).elementToElement( {
			model: 'authorBoxDescription',
			view: {
				name: 'div',
				classes: 'author-box-description'
			}
		} );
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'authorBoxDescription',
			view: {
				name: 'div',
				classes: 'author-box-description'
			}
		} );
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'authorBoxDescription',
			view: ( modelElement, viewWriter ) => {
				// Note: You use a more specialized createEditableElement() method here.
				const div = viewWriter.createEditableElement( 'div', { class: 'author-box-description' } );

				return toWidgetEditable( div, viewWriter );
			}
		} );
	}
}
