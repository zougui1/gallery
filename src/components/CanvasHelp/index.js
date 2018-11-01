import React from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

class CanvasHelper extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Overlay's helper</DialogTitle>
        <div>
          You can:
          <ul>
              <li>
                  Change the color of your brush/text
              </li>
              <li>
                  Double click on the image and write texts
              </li>
              <li>
                  Modify the color's alpha
              </li>
              <li>
                  Modify the text's size
              </li>
              <li>
                  Erase what you drew
              </li>
              <li>
                  Modify the eraser's size
              </li>
              <li>
                  Remove everything you drew
              </li>
              <li>
                  Display/hide the text or the draw
              </li>
          </ul>
        </div>
      </Dialog>
    );
  }
}
