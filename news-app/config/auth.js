module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()){
            req.flash('error_msg', 'Log in to view this page');
            res.redirect('/users/login');
        }
    }
}