import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import forge from "node-forge"; // Import the missing package
import {useAlert} from "../../app/hook";

const SSHkey = () => {
    const alert = useAlert();
    const [selected, setSelected] = useState<string>(""); // The selected index of the dropdown menu
    const [keypair, setKeypair] = useState("");

    const generateKeyPair = async () => {
        try {
            // Generate a RSA key pair
            alert("Generating RSA key pair...", "info");
            console.log("Generating RSA key pair...");
            const {privateKey, publicKey} = forge.pki.rsa.generateKeyPair(2048); // Use the forge package to generate the key pair
            // Convert keys to PEM format
            const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
            const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
            setKeypair(`${publicKeyPem} \n ${privateKeyPem}`);
            console.log("Public Key:", publicKeyPem);
            console.log("Private Key:", privateKeyPem);
            alert("RSA key pair generated!", "success");
        } catch (error) {
            console.error("Error generating RSA key pair:", error);
            alert("Error generating RSA key pair", "error");
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        if (event.target.value === "generate") {
            generateKeyPair();
            return;
        }
        setSelected(event.target.value as string);
    };

    return (
        <Box width="100%">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" fontSize={22}>
                        SSH Keys
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl sx={{minWidth: "60vh"}}>
                        <InputLabel id="select-index-label">Key Index</InputLabel>
                        <Select
                            labelId="select-index-label"
                            id="select-index"
                            value={selected}
                            //defaultValue="generate"
                            label="Index"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="generate">Generate</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h1" fontSize={22}>
                        SSH Keys
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        //disabled
                        id="multiline-textfield"
                        label="RSA-KEYPAIR"
                        multiline
                        rows={10}
                        value={keypair}
                        variant="outlined"
                        fullWidth
                        inputProps={{style: {fontSize: 15}}} // font size of input text
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default SSHkey;
