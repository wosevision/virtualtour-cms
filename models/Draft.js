const keystone = require('keystone'),
			jsdiff = require('diff'),
			Schema = require('mongoose').Schema,
			Types = keystone.Field.Types;

const isArray = require('isarray'),
			isObject = require('isobject');

const listCollection = (collection, html = []) => {
  if (isObject(collection)) {
	  html.push('<ul>');
		for (const key in collection) {
		  if( collection.hasOwnProperty( key ) ) {
	      html.push(`<li>${key}: `);
			 	listCollection(collection[key], html);
	      html.push('</li>');
		  } 
		}
	  html.push('</ul>');
  } else if (isArray(collection)) {
	  html.push('<ol>');
		collection.forEach(item => {
			html.push(`<li>${item}</li>`)
		});
	  html.push('</ol>');
  } else {
    html.push(`<strong>${ collection.toString() }</strong>`);
  }
  return html.join('\n');
}

const diffText = (newData, oldData) => {
	const parsedContent = JSON.parse(newData);
	if (!parsedContent) {
		return 'Cannot parse draft!';
	}
	var diff = jsdiff.diffWords(listCollection(parsedContent), listCollection(oldData));
	const html = [];
	diff.forEach(function(part){
	  var color = part.added ? 'green' : part.removed ? 'red' : 'inherit';
	  html.push(part.added || part.removed ? `<span style="color:${color}">${part.value}</span>` : part.value)
	});
	return html;
};

const compareDraft = (newData, oldData) => `<div>
<h2>Draft comparison</h2>
<hr/>
${diffText(newData, oldData._doc)}
</div>`;

/**
 * User Model
 * ==========
 */

const Draft = new keystone.List('Draft', {
	track: true,
	// hidden: true
});

Draft.add('Relationships', {
	owner: {
		type: Types.Relationship,
		label: 'Draft owner',
		ref: 'User',
		noedit: true,
		initial: true
	}
}, 'Metadata', {
	kind: {
		type: Types.Select,
		options: 'Scene, Building, Geometry, Feature',
		noedit: true
	},
	preview: {
		type: Types.Html,
		wysiwyg: true,
		height: 400,
		noedit: true,
		watch: true,
		value: function(callback) {
			keystone.list(this.kind).model.findById(this.original).exec((err, orig) => {
				let preview = orig 
					? compareDraft(this.content, orig)
					: 'Original document not found!'
				callback(err, preview);
			});
		}
	}
});

Draft.schema.add({
	content: Schema.Types.Mixed,
	original: Schema.Types.ObjectId
});

/**
 * Registration
 */
Draft.register();