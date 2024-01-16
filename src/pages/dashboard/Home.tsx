import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {selectUser} from "../../features/auth/authSlice";
import {useAppSelector} from "../../app/hook";
import {Grid} from "@mui/material";

const dailyPrompts: string[] = [
    "Good day! 🌞 Ready to conquer your tasks? What can we assist you with today? 😊",
    "Greetings! 🚀 Let's make today awesome! How can we help you shine? ✨",
    "Hello there! 🌈 Your digital adventure awaits! What brings you to our control panel today? 🚀",
    "Welcome! 🎉 Excited to have you on board! What's on your to-do list? Let's tackle it together! 💪",
    "Hey! 👋 Brighten your day with some control panel magic! How can we assist you in making things amazing today? ✨",
    "Good vibes only! 🌟 What's your mission for today? Let's navigate it with a smile! 😄",
    "Greetings, friend! 🌺 Ready for a fantastic day in our control panel wonderland? How can we make your experience delightful today? 🌟",
    "Hello Explorer! 🚀 What new horizons are we reaching for today? Let's set sail together! ⛵️",
    "Warm welcome! 🌞 What exciting journey shall we embark upon in the realm of our control panel today? Share your quest! 🗺️",
    "Hola! 👋 Ready for a seamless control panel experience? What can we assist you with to make your day extraordinary? 🌈",
];

const getRandomPrompt = (): string => {
    const index = Math.floor(Math.random() * dailyPrompts.length);
    return dailyPrompts[index];
};

const Home = () => {
    const user = useAppSelector(selectUser);

    return (
        <Box display="flex" flexDirection="column" width="100%">
            <Paper
                elevation={5}
                sx={{
                    width: {xs: "auto", sm: "100vh"},
                    borderRadius: "8px",
                    py: "20px",
                    px: "30px",
                }}
            >
                <Typography
                    align="left"
                    variant="h1"
                    fontSize="30px"
                    color="text.primary"
                >
                    {getRandomPrompt()}
                </Typography>
            </Paper>
            <Paper
                elevation={5}
                sx={{
                    width: {xs: "auto", sm: "400px"},
                    //borderRadius: "8px",
                    py: "20px",
                    px: "20px",
                    mt: "10px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography
                            align="left"
                            variant="h1"
                            fontSize="25px"
                            color="primary.main"
                        >
                            {user?.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            align="left"
                            variant="body1"
                            fontSize="20px"
                            color="secondary.main"
                        >
                            {user?.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            align="right"
                            variant="body2"
                            fontSize="20px"
                            color="text.primary"
                        >
                            {user?.groupID === 1 ? "Administrator" : "User"}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Home;
