import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CONFIG } from "./config.js";
import { createDb } from "./prisma/db.js";
import { createPostModule } from "./modules/post.js";
import { ROUTES } from "./shared/constant/routes.js";
import { createCategoryModule } from "./modules/category.js";
import { createAuthModule } from "./modules/auth.js";

const db = createDb(CONFIG.databaseUrl);
const app = express();

app.use(express.json());
app.use(cors({ origin: CONFIG.corsAllowedUrl, credentials: true }));
app.use(cookieParser());

app.use(ROUTES.POSTS, createPostModule(db, CONFIG));
app.use(ROUTES.CATEGORIES, createCategoryModule(db));
app.use(ROUTES.AUTH, createAuthModule(db, CONFIG));

app.listen(CONFIG.port, CONFIG.host, () => {
	console.log(`http://${CONFIG.host}:${CONFIG.port}/`);
});
