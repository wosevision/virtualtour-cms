const keystone = require('keystone');
const Building = keystone.list('Building');
const Scene = keystone.list('Scene');

exports.applySchemaUpdates = function (callback) {
  /*
  // For moving schema properties
  Scene.model.find().snapshot().exec((err, docs) => {
  	docs.forEach(doc => {
  		const oldProp = (doc.panorama || doc.image) || false; // check for old
  		if (oldProp.url) { // check for non-empty object
  			Scene.model.findOneAndUpdate(
  				{ _id: doc._id },
  				{ $set: { 'sky.panorama': oldProp }, $unset: { panorama: 1, image: 1 } }
  			).exec((err, item) => callback(item));
  		}
  	});
  });
  */

  Scene.model.find().snapshot().exec((err, docs) => {
    docs.forEach(doc => {
      const isDraft = doc.state === 'draft'; // check for old
      if (isDraft) {
        doc.visible = false;
        doc.state = 'published';
      }
      return doc.save();
    });
  });
  Building.model.find().snapshot().exec((err, docs) => {
    docs.forEach(doc => doc.save());
  });

  /*
  // For removing schema properties

  const Building = keystone.list('Building');
  Building.model.update({},
  	{ $unset: { location: 1, locationRef: 1, downtown: 1, geo: 1, scenes: 1 }},
  	{ multi: true, safe: true}, err => {
  		console.log(err);
  	}
  );
  */

};
