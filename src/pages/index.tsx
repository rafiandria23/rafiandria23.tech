import { NextPage, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { gql } from '@apollo/client';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import clsx from 'clsx';

// Types
import { Company } from '@/types/company';
import { SkillType } from '@/types/skill';
import { Education } from '@/types/education';

// GraphQL
import { client } from '@/graphql';

// Components
import { Layout } from '@/components';
import { WorkExperienceTimeline } from '@/components/work-experience';
import { SkillProgressList } from '@/components/skill';
import { EducationTimeline } from '@/components/education';

interface HomePageProps {
  companies: Company[];
  skillTypes: SkillType[];
  educations: Education[];
}

const HomePage: NextPage<HomePageProps> = ({
  companies,
  skillTypes,
  educations,
}) => {
  const classes = useStyles();

  return (
    <>
      <NextSeo
        title={`Adam Rafiandri's Personal Web`}
        description={`Adam Rafiandri is a Software Engineer who's passionate about Computer Science`}
      />

      <Layout elevate>
        {/* Introduction */}
        <Grid
          className={clsx(classes.banner, classes.coloredBanner)}
          container
          component='section'
          direction='column'
          justifyContent='space-evenly'
          alignItems='stretch'
        >
          <Grid item>
            <Typography
              className={clsx(classes.title, classes.text)}
              variant={`h2`}
              component={`h1`}
              gutterBottom
            >
              {`Hey, I'm Adam.`}
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              className={classes.text}
              variant={`h6`}
              component='p'
              paragraph
            >
              {`Software engineer from Bogor, Indonesia. I develop web, mobile,
                and desktop applications to help businesses grow online.`}
            </Typography>
          </Grid>
        </Grid>

        {/* Work Experiences */}
        <Grid
          className={clsx(classes.banner, classes.workExperienceBanner)}
          container
          component='section'
          direction='column'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item>
            <Typography
              className={classes.title}
              variant='h5'
              component='h2'
              align='left'
              gutterBottom
            >
              Work Experiences
            </Typography>
          </Grid>

          <Grid item>
            <WorkExperienceTimeline companies={companies} />
          </Grid>
        </Grid>

        {/* Skill Progress */}
        <Grid
          className={clsx(
            classes.banner,
            classes.coloredBanner,
            classes.skillProgressBanner,
          )}
          container
          component='section'
          direction={`column`}
          justifyContent={`space-evenly`}
          alignItems={`flex-start`}
        >
          <Grid item>
            <Typography
              className={clsx(classes.title, classes.text)}
              variant='h5'
              component='h2'
              align='left'
              gutterBottom
            >
              Skills
            </Typography>
          </Grid>

          <Grid item>
            <SkillProgressList skillTypes={skillTypes} />
          </Grid>
        </Grid>

        {/* Educations */}
        <Grid
          className={clsx(classes.banner, classes.educationBanner)}
          container
          component='section'
          direction={`column`}
          justifyContent={`space-evenly`}
          alignItems={`flex-start`}
        >
          <Grid item>
            <Typography
              className={clsx(classes.title)}
              variant='h5'
              component='h2'
              align='left'
              gutterBottom
            >
              Educations
            </Typography>
          </Grid>

          <Grid item>
            <EducationTimeline educations={educations} />
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const { data } = await client.query<{
    companies: Company[];
    skillTypes: SkillType[];
    educations: Education[];
  }>({
    query: gql`
      query {
        companies {
          _id
          name
          logo {
            url
            width
            height
          }
          link
          workExperiences {
            _id
            title
            employmentType
            company {
              _id
            }
            location
            current
            startDate
            endDate
            description
          }
        }

        skillTypes {
          _id
          name
          skills {
            _id
            name
            level
          }
        }

        educations {
          _id
          degree
          field
          startDate
          endDate
          grade
          description
          school {
            _id
            name
            logo {
              url
              width
              height
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      companies: data.companies,
      skillTypes: data.skillTypes,
      educations: data.educations,
    },
    revalidate: 1,
  };
};

export default HomePage;

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      fontWeight: theme.typography.fontWeightBold,
    },
    text: {
      color: theme.palette.primary.contrastText,
    },
    banner: {
      padding: theme.spacing(2, 1),
    },
    coloredBanner: {
      backgroundColor: theme.palette.primary.light,
    },
    introductionBanner: {},
    workExperienceBanner: {
      '& > *': {
        width: '100%',
      },
    },
    skillProgressBanner: {},
    educationBanner: {},
  }),
);
