import express from "express";
import router from "./routes/UserRoutes";

const app = express();
const UserRoutes = router;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/users", UserRoutes);

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
