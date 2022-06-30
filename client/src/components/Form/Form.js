import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase64 from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', description: '', tags: [], selectedFile: '', eventDate : '', location: '', contactInformation: ''  });
  const post = useSelector((state) => (currentId ? state.posts.posts.find((description) => description._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();
  const [hideForm, setHideForm] = useState(true);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', description: '', tags: [], selectedFile: '', eventDate : '', location: '', contactInformation: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own events, like and join other's events.
        </Typography>
      </Paper>
    );
  }

  const handleVisibility = () => {
        setHideForm(prevVal => !prevVal)
  };
  
   if (!hideForm){
    return (
      <Paper className={classes.paper} elevation={6}>
        <IconButton onClick={handleVisibility}>
          {!hideForm ? <Visibility /> : <VisibilityOff />}
        </IconButton>
        <Typography variant="h6" align="center">
          Click to create an event.
        </Typography>
      </Paper>
    );
   }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
      <IconButton className={classes.hideButton} onClick={handleVisibility}>
          {!hideForm ? <Visibility /> : <VisibilityOff />}
        </IconButton> 
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating an Event'}</Typography>
        <TextField required name="title" variant="outlined" label="Title"  fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField required name="tags" variant="outlined" label="Tags (coma separated)"  fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
        <TextField required name="description" variant="outlined" label="Description" fullWidth  value={postData.description} onChange={(e) => setPostData({ ...postData, description: e.target.value })} />
        <TextField required name="eventDate" variant="outlined" label="Event Date" fullWidth  value={postData.eventDate} onChange={(e) => setPostData({ ...postData, eventDate: e.target.value })} />
        <TextField required name="location" variant="outlined" label="Location" fullWidth  value={postData.location} onChange={(e) => setPostData({ ...postData, location: e.target.value })} />
        <TextField required name="contactInformation" variant="outlined"  label="Your contact information (instagram, phone etc.)" fullWidth multiline rows={4} value={postData.contactInformation} onChange={(e) => setPostData({ ...postData, contactInformation: e.target.value })} />
        <FileBase64 required className={classes.fileInput} multiple={false}  onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;

