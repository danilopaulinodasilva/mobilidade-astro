import { API_BASE_URL } from "../constants";

export const getAllAuthors = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query AllAuthors {
          users (first:100, after: null) {
            nodes {
              slug
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
          `,
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();
  //  assign the array of nodes to "posts" variable for usability
  return data.users.nodes;
};

export const getAllCategories = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query AllCategories {
            categories(first:100, after: null) {
              nodes {
                name
                slug
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
          `,
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();
  //  assign the array of nodes to "posts" variable for usability
  return data.categories.nodes;
};

export const getAllPosts = async () => {
  let allPosts = [];
  let endCursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query getAllPosts {
          posts(first: 100, after: "${endCursor}", where: {orderby: {field: DATE, order: DESC}}) {
            nodes {
              slug
              date
              categories {
                edges {
                  node {
                    name
                    slug
                  }
                }
              }
              author {
                node {
                  databaseId
                  slug
                }
              }
              tags {
                nodes {
                  slug
                }
              }
              title
              excerpt
              featuredImage {
                node {
                  sourceUrl
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        `,
      }),
    });

    const { data } = await response.json();
    const posts = data.posts.nodes;
    hasNextPage = data.posts.pageInfo.hasNextPage;
    endCursor = data.posts.pageInfo.endCursor;

    allPosts = allPosts.concat(posts);
  }

  return allPosts;
};

export const getAllTags = async () => {
  let allTags = [];
  let endCursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query AllTags {
          tags (first: 100, after: ${endCursor ? `"${endCursor}"` : null}) {
            nodes {
              name
              slug
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        `,
      }),
    });

    const { data } = await response.json();
    const newTags = data.tags.nodes;
    allTags = [...allTags, ...newTags];
    hasNextPage = data.tags.pageInfo.hasNextPage;
    endCursor = data.tags.pageInfo.endCursor;
  }

  return allTags;
};

export const getAllPages = async () => {
  let allPages = [];
  let endCursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query getAllPages {
          pages (first: 100, after: ${endCursor ? `"${endCursor}"` : null}) {
            nodes {
              slug
              id
              uri
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        `,
      }),
    });

    const { data } = await response.json();
    const newPages = data.pages.nodes;
    allPages = [...allPages, ...newPages];
    hasNextPage = data.pages.pageInfo.hasNextPage;
    endCursor = data.pages.pageInfo.endCursor;
  }

  return allPages;
};

export const getSinglePostBySlug = async (slug) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query SinglePost($id: ID = "${slug}") {
          post(idType: SLUG, id: $id) {
            date
            content
            title
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
        `,
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();

  return data.post;
};

export const getSinglePageBySlug = async (slug) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query SinglePage($id: ID = "${slug}") {
          page(idType: URI, id: $id) {
            date
            content
            title
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      `,
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();

  return data.page;
};

export const getTypeByUri = async (uri) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query getTypeByUri($id: String!) {
          nodeByUri(uri: $id) {
            __typename
            uri
            ... on Page {
              content
              title
              date
              featuredImage {
                node {
                  sourceUrl
                }
              }
      uri
            }
            ... on Post {
              content
              title
              date
              featuredImage {
                node {
                  sourceUrl
                }
              }
      uri
            }
          }
        }
      `,
      variables: {
        id: uri, // Valor da variável $id
      },
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();
  return data;
};

export const getAllPostSlugs = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query AllSlugs {
          posts {
            nodes {
              slug
            }
          }
          pages {
            nodes {
              slug
            }
          }
        }
      `,
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();

  //  assign the array of nodes to "posts" variable for usability
  return [...data.posts.nodes, ...data.pages.nodes];
};

export const getPostsByTag = async (tag) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query SingleTag($id: ID = "${tag}") {
            tag(idType: SLUG, id: $id) {
              posts(where: {orderby: {field: DATE, order: DESC}}) {
                nodes {
                  date
                  content
                  title
                  slug
                  excerpt
                  featuredImage {
                    node {
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
        `,
    }),
  });

  // destructure data from our JSON
  const { data } = await response.json();

  const posts = data.tag.posts.nodes;

  return posts;
};
