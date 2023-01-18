import React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box } from '@mui/material';

const BasicDialog = ({  
  openBasicDiag,
  closeBasicDiag,
  dialogTitle,
  dialogContentText,
  confirmBtnText,
  declineBtnText,
  confirmOnClick,
  declineOnClick
}) => {

  const basicDialogOpts = {
    openBasicDiag: openBasicDiag,
    closeBasicDiag: closeBasicDiag,
    dialogTitle: dialogTitle,
    dialogContentText: dialogContentText,
    confirmBtnText: confirmBtnText,
    declineBtnText: declineBtnText,
    confirmOnClick: confirmOnClick,
    declineOnClick: declineOnClick
  };
  
  return (

    <Dialog
      open={basicDialogOpts.openBasicDiag}
      onClose={basicDialogOpts.closeBasicDiag}
    >
      <Box m={1} width={400}>
        <DialogTitle>{basicDialogOpts.dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText component={Box}>
            {basicDialogOpts.dialogContentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={basicDialogOpts.declineOnClick}>
            {basicDialogOpts.declineBtnText}
          </Button>
          <Button
            variant={confirmBtnText == "Delete" ? "delete" : "contained"}
            onClick={basicDialogOpts.confirmOnClick}>
            {basicDialogOpts.confirmBtnText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>

  );
};

export default BasicDialog;