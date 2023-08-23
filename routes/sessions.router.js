import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import passport from 'passport';

const sessions = Router();

sessions.post("/login", passport.authenticate('login'), sessionsController.login);
sessions.post("/loginjwt", passport.authenticate('jwt'), sessionsController.loginjwt);
sessions.post("/register", passport.authenticate('register'), sessionsController.register);
sessions.post("/logout", sessionsController.logout);
sessions.post("/current", passport.authenticate('register'), sessionsController.current);
sessions.get("/github", passport.authenticate('github'), sessionsController.github);
sessions.get("/githubCallback", passport.authenticate('github'), sessionsController.githubCallback);

export default sessions;