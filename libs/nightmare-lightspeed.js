/**
 * Login to a Lightspeed account.
 *
 * @param {String} email
 * @param {String} password
 */
exports.login = (email, password) => {
  return (nightmare) => {
    return nightmare
      .type('#auth_login_email', email)
      .insert('#auth_login_password', password)
      .click('.btn.primary.fill')
      .wait(50)
      .end();
  }
}

exports.update = (content) => {
  return (nightmare) => {
    return nightmare
      .wait('.editor-editor textarea')
      .evaluate(function(content, done) {
        var editor = document.querySelector('[id^="ace_themes_"]')
        ace.edit(editor).setValue(content);
        jQuery('.btn.primary').trigger('click');
        done(null);
      }, content )
      .end();
  }
}