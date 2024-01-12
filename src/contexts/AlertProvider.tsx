import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { createContext, useMemo, useState } from "react";

const autoHideDuration = 2000;

export type AlertInfo = {
  text: string;
  severity?: AlertColor; // "success" as default
  duration?: number;
};

const AlertContext = createContext({
  showAlert: (text: string, severity?: AlertColor) => {
    console.log(`alert(${severity}): ${text}`);
  },
});

export const AlertProvider = ({ children }: React.PropsWithChildren) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alert, setAlert] = useState<AlertInfo>({
    text: "",
  });

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const alertContext = useMemo(
    () => ({
      showAlert: (text: string, severity?: AlertColor) => {
        setAlert({
          text: text,
          severity: severity,
        });
        setOpenSnackbar(true);
      },
    }),
    []
  );

  const { text, severity, duration } = alert;

  return (
    <AlertContext.Provider value={alertContext}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={duration ?? autoHideDuration}
        onClose={handleSnackbarClose}
      >
        {
          <Alert
            onClose={handleSnackbarClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {text}
          </Alert>
        }
      </Snackbar>
    </AlertContext.Provider>
  );
};

export default AlertContext;
