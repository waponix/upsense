/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/^\/app/)) {
    // paths under app will be restricted
    page.matchPath = '/app/*';
    craetePage(page);
  }

  if (page.path.match(/auth/)) {
    page.context.layout = 'auth';
    createPage(page);
  }
};
