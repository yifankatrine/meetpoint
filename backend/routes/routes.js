import { Router } from 'express';
import UserController from '../models/user/UserController.js';
import RestaurantController from "../models/restaurant/RestaurantController.js";
import MeetpointController from "../models/meetpoint/MeetpointController.js";
import EventController from "../models/event/EventController.js";
import EntertainmentController from "../models/entertainment/EntertainmentController.js";
import CityController from "../models/city/CityController.js";
import MemberController from "../models/member/MemberController.js";
import AuthController from "../controllers/AuthController.js";
import {authenticate} from "../middleware/auth.js";

const router = Router();

router.post('/registration', UserController.create);
router.post('/login', AuthController.login);
router.post('/token', authenticate, (req, res) => {
    res.json({
        isValid: true,
        user: req.user
    });
});
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getById);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

router.get('/members', MemberController.getAll);
router.post('/members', MemberController.create);
router.get('/members/meetpoint/:meetpointId', MemberController.getByMeetpoint);
router.put('/members/:id', MemberController.update);
router.delete('/members/:id', MemberController.delete);

router.post('/restaurants', RestaurantController.create);
router.get('/restaurants', RestaurantController.getAll);
router.get('/restaurants/:restaurantId', RestaurantController.getById);
router.put('/restaurants/:restaurantId', RestaurantController.update);
router.delete('/restaurants/:restaurantId', RestaurantController.delete);

router.post('/meetpoints', MeetpointController.create);
router.get('/meetpoints', MeetpointController.getAll);
router.get('/meetpoints/:meetpointId', MeetpointController.getById);
router.put('/meetpoints/:meetpointId', MeetpointController.update);
router.delete('/meetpoints/:meetpointId', MeetpointController.delete);
router.post('/meetpoints/:meetpointId/members', MeetpointController.addMember);

router.post('/events', EventController.create);
router.get('/events', EventController.getAll);
router.get('/events/:eventId', EventController.getById);
router.put('/events/:eventId', EventController.update);
router.delete('/events/:eventId', EventController.delete);
router.post('/events/:eventId/categories', EventController.addCategory);
router.post('/events/:eventId/images', EventController.addImage);

router.post('/entertainments', EntertainmentController.create);
router.get('/entertainments', EntertainmentController.getAll);
router.get('/entertainments/:entertainmentId', EntertainmentController.getById);
router.put('/entertainments/:entertainmentId', EntertainmentController.update);
router.delete('/entertainments/:entertainmentId', EntertainmentController.delete);
router.post('/entertainments/:entertainmentId/categories', EntertainmentController.addCategory);
router.post('/entertainments/:entertainmentId/images', EntertainmentController.addImage);

router.post('/cities', CityController.create);
router.get('/cities', CityController.getAll);
router.get('/cities/:cityId', CityController.getById);
router.put('/cities/:cityId', CityController.update);
router.delete('/cities/:cityId', CityController.delete);
router.post('/cities/:cityId/categories', CityController.addCategory);
router.post('/cities/:cityId/images', CityController.addImage);

export default router;