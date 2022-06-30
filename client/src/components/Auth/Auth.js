import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {Avatar , Button , Paper, Grid, Typography, Container} from '@material-ui/core';
import { GoogleLogin} from 'react-google-login';
import { useHistory } from 'react-router-dom';
import { gapi } from 'gapi-script';
import Icon from "./icon";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles';
import Input from './Input';
import {signin, signup} from '../../actions/auth';

const initialState = { firstName : '' , lastName: '' , email: '', password : '', confirmPassword: '' };

const Auth = () => {

  useEffect(() => {
    function start() {
    gapi.client.init({
    clientId:"813788786428-2r5itttj8c8vkp63vuce8oo0vf2e0dv8.apps.googleusercontent.com",
    scope: 'email',
      });
       }
      gapi.load('client:auth2', start);
       }, []);

       const dispatch = useDispatch();
       const history = useHistory();
   

     const classes = useStyles();
     const [showPassword, setShowPassword] = useState (false);
     const [isSignup, setIsSignup] = useState(false);
     const [formData , setFormData] = useState(initialState);

      const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword );
      
      const handleSubmit = (e) =>{
            e.preventDefault();

            if(isSignup){
                dispatch(signup(formData, history))
              } else {
                dispatch(signin(formData, history))
                
            }
      };
     const handleChange = (e) =>{
            setFormData({ ...formData, [e.target.name] : e.target.value});
     }

     const switchMode = () =>{
          setIsSignup((prevSign => !prevSign));
          setShowPassword(false);
     }

     
       const onSuccess = async (response) => {
          const result = response?.profileObj;
          const token = response?.tokenId;

       try {
         dispatch({ type: 'AUTH', data : { result, token} }) ;

        history.push('/');
       } catch (error) {
         console.log(error);
       }
        };
       const onFailure = async (response) => {
         console.log('FAILED', response);
         };
        /*  const onLogoutSuccess = () => {
         console.log('SUCESS LOG OUT');
          }; */

  return (
    <Container  component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation = {3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography variant='h5'> {isSignup ? 'Sign Up' : 'Sign In'}</Typography>

            <form className={classes.form} onSubmit ={handleSubmit}> 
                  <Grid  container spacing={2} >
                          {
                            isSignup && (
                              <>
                              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half ></Input>
                              <Input name="lastName" label="Last Name" handleChange={handleChange}  half ></Input>
                              </>
                            )
                          }
                          <Input name="email" label = "Email Address" handleChange={handleChange} ></Input>
                          <Input name="password" label ="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} ></Input>
                          {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>        
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                      {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button> 
                    <GoogleLogin 
                        clientId='813788786428-2r5itttj8c8vkp63vuce8oo0vf2e0dv8.apps.googleusercontent.com'
                        render={(renderProps) => (
                          <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                            Google Sign In
                          </Button>
                        )}
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy="single_host_origin"
                      />

                    <Grid container justifyContent='flex-end' >
                      <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up "}
                            </Button>
                      </Grid>

                    </Grid>
            </form>

      </Paper>

    </Container>
  )
}

export default Auth;