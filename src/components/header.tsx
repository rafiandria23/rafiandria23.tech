import { FC, useState, forwardRef, Ref, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useTheme, makeStyles, createStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  ButtonGroup,
  Button,
  IconButton,
  Grid,
  Dialog,
  Slide,
  useScrollTrigger,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  LinkedIn as LinkedInLogo,
  GitHub as GitHubLogo,
} from '@material-ui/icons';
import clsx from 'clsx';

const Transition = forwardRef(
  (props: TransitionProps & { children?: ReactElement }, ref: Ref<unknown>) => {
    return <Slide direction={`right`} ref={ref} {...props} />;
  },
);
Transition.displayName = 'Transition';

export interface HeaderProps {
  elevate?: boolean;
}

const Header: FC<HeaderProps> = ({ elevate = false }) => {
  const router = useRouter();
  const theme = useTheme();
  const classes = useStyles();
  const scrollTriggered = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <AppBar
        className={clsx({
          [classes.transparentHeader]: elevate && !scrollTriggered,
        })}
        position='fixed'
        elevation={elevate ? (scrollTriggered ? 8 : 0) : undefined}
      >
        <Toolbar variant={`dense`}>
          <IconButton edge={`start`} onClick={handleOpen}>
            <MenuIcon className={classes.menuIcon} />
          </IconButton>

          <Typography className={classes.title} variant='h6'>
            rafiandria23.me
          </Typography>

          <div className={classes.grow} />

          {/* <Button
            variant={`outlined`}
            style={{
              borderColor: theme.palette.primary.contrastText,
              color: theme.palette.primary.contrastText,
            }}
          >{`Hire me`}</Button> */}
        </Toolbar>
      </AppBar>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Toolbar>
          <IconButton
            edge={`start`}
            color={theme.palette.type === 'light' ? 'primary' : undefined}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <div className={classes.grow} />

          {/* <Button
            variant={`outlined`}
            color={theme.palette.type === 'light' ? 'primary' : undefined}
            style={{
              borderColor:
                theme.palette.type === 'light'
                  ? theme.palette.primary.main
                  : theme.palette.primary.contrastText,
              color:
                theme.palette.type === 'light'
                  ? theme.palette.primary.main
                  : theme.palette.primary.contrastText,
            }}
          >
            Hire Me
          </Button> */}
        </Toolbar>

        <Grid
          className={classes.wrapper}
          container
          direction={`column`}
          justifyContent={`space-between`}
          alignItems={`stretch`}
        >
          <Grid
            item
            container
            direction={`column`}
            justifyContent={`space-between`}
            alignItems={`stretch`}
          >
            <Grid item>
              <Button
                fullWidth
                variant='text'
                color={theme.palette.type === 'light' ? 'primary' : undefined}
                onClick={() =>
                  router.push({
                    pathname: '/',
                  })
                }
              >
                Home
              </Button>
            </Grid>

            <Grid item>
              <Button
                fullWidth
                variant='text'
                color={theme.palette.type === 'light' ? 'primary' : undefined}
                onClick={() =>
                  router.push({
                    pathname: '/projects',
                  })
                }
              >
                Projects
              </Button>
            </Grid>

            <Grid item>
              <Button
                fullWidth
                variant='text'
                color={theme.palette.type === 'light' ? 'primary' : undefined}
                onClick={() =>
                  router.push({
                    pathname: '/blog',
                  })
                }
              >
                Blog
              </Button>
            </Grid>
          </Grid>

          <Grid
            item
            container
            direction={`row`}
            justifyContent={`center`}
            alignItems={`center`}
          >
            <Grid item>
              <ButtonGroup
                variant='text'
                color={theme.palette.type === 'light' ? 'primary' : undefined}
              >
                <IconButton
                  href={`https://linkedin.com/in/rafiandria23`}
                  target={`_blank`}
                >
                  <LinkedInLogo />
                </IconButton>

                <IconButton
                  href={`https://github.com/rafiandria23`}
                  target={`_blank`}
                >
                  <GitHubLogo />
                </IconButton>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default Header;

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      padding: theme.spacing(0, 4),
      '& > *': {
        margin: theme.spacing(1, 0),
      },
    },
    transparentHeader: {
      backgroundColor: 'transparent',
    },
    grow: {
      flexGrow: 1,
    },
    menuIcon: {
      color: theme.palette.primary.contrastText,
    },
    title: {
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);
