import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

const CanvasHelper = ({ handleModalClose, open }) => (
    <Dialog
        style={{ zIndex: 99999999999 }}
        aria-labelledby="simple-dialog-title"
        open={open}
    >
        <DialogTitle>Tutorial</DialogTitle>
        <DialogContent>
            <DialogContentText>
                <div style={{ fontSize: '1.13rem' }}>
                    <span style={{ fontWeight: 650 }}>You can:</span>
                    <ul>
                        <li>
                            Change the color of the brush/text
                        </li>
                        <li>
                            Create a textbox
                        </li>
                        <li>
                            Move the textboxes
                        </li>
                        <li>
                            Remove the textboxes by dropping them out of the image
                        </li>
                        <li>
                            Modify the color alpha
                        </li>
                        <li>
                            Modify the text size
                        </li>
                        <li>
                            Erase what you drew
                        </li>
                        <li>
                            Modify the eraser size
                        </li>
                        <li>
                            Remove everything you drew
                        </li>
                        <li>
                            Display/hide the text or the draw
                        </li>
                    </ul>
                    <p>
                        The textboxes are created at the top left of the image,
                    </p>
                </div>
            </DialogContentText>
        </DialogContent>
    </Dialog>
);

export default withMobileDialog()(CanvasHelper);