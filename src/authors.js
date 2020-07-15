import AuthorBoxEditing from './authorboxediting';
import AuthorBoxUI from './authorboxui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class SimpleBox extends Plugin {
	static get requires() {
		return [ AuthorBoxEditing, AuthorBoxUI ];
	}
}
