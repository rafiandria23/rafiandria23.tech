import type {
  NextPage,
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { NextSeo } from 'next-seo';
import { gql } from '@apollo/client';
import { makeStyles, createStyles } from '@mui/styles';
import { Theme, Grid, Typography, Chip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';

// Types
import type { IGraphQLModelResponse } from '@/types/graphql';
import type { IPageInitialProps } from '@/types/page';
import type { IArticle } from '@/types/article';

// GraphQL
import { client } from '@/graphql';

// Components
import { Layout } from '@/components/shared/layout';
import markdownComponents from '@/components/markdown';

interface IArticlePageProps extends IPageInitialProps {
  article: IArticle;
}

const ArticlePage: NextPage<IArticlePageProps> = ({ article }) => {
  const router = useRouter();
  const classes = useStyles();

  if (router.isFallback) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  return (
    <>
      <NextSeo
        title={article.attributes.title}
        description={article.attributes.overview}
        openGraph={{
          images: [
            {
              url: article.attributes.cover.data.attributes.url,
            },
          ],
        }}
      />

      <Layout>
        <Grid
          className={classes.wrapper}
          component='article'
          container
          direction='column'
          justifyContent='space-between'
          alignItems='stretch'
        >
          <Grid className={classes.header} item container direction='column'>
            <Grid item>
              <Typography
                className={classes.title}
                variant='h4'
                component='h1'
                align='left'
                gutterBottom
              >
                {article.attributes.title}
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                variant='caption'
                component='p'
                align='left'
                color='textSecondary'
              >
                {dayjs(article.attributes.updatedAt).format('MMMM D, YYYY')}
              </Typography>
            </Grid>
          </Grid>

          <Grid className={classes.content} item>
            <ReactMarkdown components={markdownComponents}>
              {article.attributes.content}
            </ReactMarkdown>
          </Grid>

          <Grid
            className={classes.tags}
            item
            container
            direction='row'
            wrap='wrap'
            justifyContent='flex-start'
          >
            {article.attributes.tags.data.length > 0 &&
              article.attributes.tags.data.map((tag) => (
                <Grid item key={tag.id}>
                  <NextLink href={`/blog/tags/${tag.attributes.slug}`} passHref>
                    <Chip
                      className={classes.tag}
                      component='a'
                      label={tag.attributes.name}
                      clickable
                    />
                  </NextLink>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.query<{
    articles: IGraphQLModelResponse<IArticle[]>;
  }>({
    query: gql`
      query {
        articles {
          data {
            id
            attributes {
              slug
            }
          }
        }
      }
    `,
  });

  const slugs: GetStaticPathsResult['paths'] = data.articles.data.map(
    (article) => ({
      params: {
        slug: article.attributes.slug,
      },
    }),
  );

  return {
    paths: slugs,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  IArticlePageProps,
  { slug: IArticle['attributes']['slug'] }
> = async ({ params }) => {
  const slug = String(params?.slug);
  const { data } = await client.query<
    { articles: IGraphQLModelResponse<IArticle[]> },
    { slug: IArticle['attributes']['slug'] }
  >({
    variables: {
      slug,
    },
    query: gql`
      query ($slug: String!) {
        articles(filters: { slug: { eq: $slug } }) {
          data {
            id
            attributes {
              title
              slug
              overview
              cover {
                data {
                  id
                  attributes {
                    url
                    width
                    height
                  }
                }
              }
              content
              tags {
                data {
                  id
                  attributes {
                    name
                    slug
                  }
                }
              }
              publishedAt
            }
          }
        }
      }
    `,
  });

  if (!data.articles.data.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article: data.articles.data[0],
    },
    revalidate: 1,
  };
};

export default ArticlePage;

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    wrapper: {
      padding: theme.spacing(2, 4),
      '& > *': {
        margin: theme.spacing(0.8, 0),
      },
    },
    header: {
      '& > *': {
        margin: theme.spacing(0.4, 0),
      },
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
    },
    content: {},
    tags: {
      '& > *': {
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    tag: {
      color: theme.palette.text.secondary,
    },
  }),
);
