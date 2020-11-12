const path = require(`path`);

const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = function({ node, getNode, actions }) {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

exports.createPages = async function({ graphql, actions }) {
    const { createPage } = actions;

    const result = await graphql(`
      query {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `);
    result.data.allMarkdownRemark.edges
    .forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/blog.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.fields.slug,
        },
      });
    });
  };

// Create blog-list pages
const posts = result.data.allMarkdownRemark.edges;
const pageSize = 2;
const pageCount = Math.ceil(posts.length / pageSize);

const templatePath = path.resolve('src/templates/blog-list.js');

for (let i =0; i<pageCount;i++) {
  let path = '/blog';
  if (i >0 ){
    path += `/${i+1}`
  }
  createPage({
    path,
    component: templatePath,
    context: {
      limit: pageSize,
      skip: i * pageSize,
      pageCount,
      currentPage: i + 1,
    },
  });
}

