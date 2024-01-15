import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { createContext, useMemo, useState } from "react";

export interface DialogProps {
  title: string;
  content: string;
  element?: React.ReactNode;
  callback?: () => void; // if configured, ok button will trigger callback, else the Cancel button will be hidden
}

const DialogContext = createContext({
  showDialog: (
    title: string,
    content: string,
    element?: React.ReactNode,
    callback?: () => void
  ) => {
    console.log(title, content, element, callback);
  },
});

export const DialogProvider = ({ children }: React.PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogProps>({
    title: "",
    content: "",
  });

  const { title, content, element, callback } = dialog;

  const dialogContext = useMemo(
    () => ({
      showDialog: (
        title: string,
        content: string,
        element?: React.ReactNode,
        callback?: () => void
      ) => {
        setDialog({
          title: title,
          content: content,
          element: element,
          callback: callback,
        });
        handleOpen();
      },
    }),
    []
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOKClick = () => {
    if (callback) callback();
    handleClose();
  };

  return (
    <DialogContext.Provider value={dialogContext}>
      {children}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
          {element}
        </DialogContent>
        <DialogActions>
          <Button hidden={!callback} onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleOKClick} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogContext;
