import _ from 'lodash';
import type { FC } from 'react';
import type { Metadata } from 'next';
import { gql } from '@apollo/client';

// Types
import type { IGraphQLModelResponse } from '@/types/graphql';
import type { IPagination } from '@/types/page';
import type { ITag } from '@/types/tag';

// GraphQL
import { client } from '@/graphql';

// Client Page
import TagPage from '.';

export interface IPageProps {
  params: {
    slug: ITag['attributes']['slug'];
  };
}

const Page: FC<IPageProps> = async ({ params }) => {
  const { tag } = await getData(params.slug);

  return <TagPage tag={tag} />;
};

export default Page;

export interface IPageData {
  tag: ITag;
}

async function getData(slug: ITag['attributes']['slug']): Promise<IPageData> {
  const { data } = await client.query<
    {
      tags: IGraphQLModelResponse<ITag[]>;
    },
    { slug: ITag['attributes']['slug'] } & IPagination
  >({
    variables: {
      slug,
    },
    query: gql`
      query ($slug: String!) {
        tags(filters: { slug: { eq: $slug } }) {
          data {
            attributes {
              name
              overview
              slug
            }
          }
        }
      }
    `,
  });

  return {
    tag: data.tags.data[0],
  };
}

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata | null> {
  const { slug } = params;

  const { data } = await client.query<
    {
      tags: IGraphQLModelResponse<ITag[]>;
    },
    { slug: ITag['attributes']['slug'] } & IPagination
  >({
    variables: {
      slug,
    },
    query: gql`
      query ($slug: String!) {
        tags(filters: { slug: { eq: $slug } }) {
          data {
            attributes {
              name
              overview
            }
          }
        }
      }
    `,
  });

  const tag = _.get(data, 'tags.data[0]');

  if (!tag) {
    return null;
  }

  return {
    title: tag.attributes.name,
    description: tag.attributes.overview,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: tag.attributes.name,
      description: tag.attributes.overview,
      images: [],
    },
    twitter: {
      title: tag.attributes.name,
      description: tag.attributes.overview,
      images: [],
    },
  };
}
