const keystone = require('keystone');
const router = require('express').Router();

function authResponse(success, status, message) {
  return res.status(status).json({ success, message });
}

function signin(req, res) {
  
  if (!req.body.username || !req.body.password) return res.json({ success: false });
  
  keystone.list('User').model.findOne({ email: req.body.username }).exec(function(err, user) {

		let message = 'Sorry, there were some issues under the hood; please try again.';
    
    if (err) {
    	message = (err && err.message ? err.message : false) || message;
      return authResponse(false, 500, message);
    }

    if (!user) {
      return authResponse(false, 404, 'Sorry, no user exists with that username!');
    }
    
    keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {

			if (process.env.NODE_ENV !== 'production') {
				console.log('------------------------------------------------');
				console.log(`Auth: User ${ user.email } logged in successfully!`);
				console.log('------------------------------------------------');
			}

      return res.status(200).json({
        success: true,
        date: new Date().getTime(),
        user: user
      });
      
    }, function(err) {
	    if (err) {
	      return authResponse(false, 500, message);
	    }
    });
  });
}

function signout(req, res) {
  keystone.session.signout(req, res, function() {
    res.status(200).json({ 'success': true });
  }, function(err) {
    if (err) {
    	message = (err && err.message ? err.message : false) || message;
      return authResponse(false, 500, message);
    }
  });
}

function checkAuth(req, res, next) {
  if (req.user) return next();
  return authResponse(false, 403, 'Sorry, this resource requires a user access! Please log in.');
}

exports.router = routes => {

	router.post('/signin', signin);
	router.post('/signout', signout);

	// router.all('*', checkAuth);
	router.get('/me', checkAuth, (req, res) => {
	  return res.json({ 'user': req.user });
	});

	return router;
}