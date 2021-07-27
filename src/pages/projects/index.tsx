import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { gql } from '@apollo/client';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Typography, Divider } from '@material-ui/core';

// Types
import { Project } from '@/types/project';

// GraphQL
import { client } from '@/graphql';

// Components
import { Layout } from '@/components';
import { ProjectCard } from '@/components/project';

interface ProjectsPageProps {
  projects: Project[];
}

const ProjectsPage: NextPage<ProjectsPageProps> = ({ projects }) => {
  const classes = useStyles();

  return (
    <>
      <NextSeo
        title={`My Projects`}
        description={`All the projects I'm currently doing or already done, ranging from Back-End, Front-End, to Full-Stack`}
      />

      <Layout>
        <Grid
          className={classes.wrapper}
          container
          direction={`column`}
          justifyContent={`flex-start`}
          alignItems={`stretch`}
        >
          <Grid item>
            <Typography
              className={classes.title}
              component={`h1`}
              variant={`h5`}
              gutterBottom
            >
              {`My Projects`}
            </Typography>
          </Grid>

          <Grid item>
            <Divider />
          </Grid>

          <Grid
            className={classes.list}
            item
            container
            direction={`row`}
            wrap={`wrap`}
            justifyContent={`space-evenly`}
            alignItems={`stretch`}
          >
            {projects !== undefined && projects.length > 0
              ? projects.map((project) => {
                  return (
                    <Grid item key={project._id}>
                      <ProjectCard project={project} />
                    </Grid>
                  );
                })
              : ''}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

ProjectsPage.getInitialProps = async () => {
  const { data } = await client.query<{ projects: Project[] }>({
    query: gql`
      query {
        projects {
          _id
          title
          slug
          overview
          cover {
            url
            width
            height
          }
          tags {
            id
            name
            slug
          }
        }
      }
    `,
  });

  return {
    projects: data.projects,
  };
};

export default ProjectsPage;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      padding: theme.spacing(2),
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
    },
    list: {
      marginTop: theme.spacing(2),
      '& > *': {
        width: '100%',
        margin: theme.spacing(1.5, 0),
      },
    },
  }),
);
