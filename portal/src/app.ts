import express, {Request, Response} from "express";
import http from "http";
import mqtt from 'mqtt';
import {mqttConfig, portalConfig} from "./config";
import bodyParser from 'body-parser';
import path from "path";
// @ts-ignore
import {SideMenu} from "../menu";
import {Authenticate, Logout, SessionRefresh} from "./middlewares/Security";
import loginController from "./controllers/LoginController";
import DashboardController from "./controllers/DashboardController";
import CompanyController from "./controllers/CompanyController";
import AdminController from "./controllers/AdminController";
import ManagerController from "./controllers/ManagerController";
import StaffController from "./controllers/StaffController";
import {GlobalVariablesHandler} from "./middlewares/Twig";
import HubController from "./controllers/HubController";
import SensorController from "./controllers/SensorController";
import ZoneController from "./controllers/ZoneController";
const cors = require("cors");
const cookieParser = require("cookie-parser");

class Portal
{
    private app: any;
    private server: any;
    private io: any;
    private mqttClient: any;

    constructor()
    {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = require('socket.io')(this.server, {cors: 'http://localhost'});

        this.app
            .set('view engine', 'twig')
            .set('views', path.join(__dirname, 'views'))
            .set('twig options', {
                allow_async: true,
                strict_variables: false
            })
            .use(
                '/',
                cors({
                    exposedHeaders: ['X-CSRF-TOKEN', 'X-Requested-With']
                }), // enable cross-origin
                bodyParser.json(), // support application/json type post data
                bodyParser.urlencoded({ extended: true }), //support application/x-www-form-urlencoded post data),
                cookieParser(),
                SessionRefresh,
                GlobalVariablesHandler,
            )
            .use('/assets', express.static(path.join(__dirname, 'public')));


        // configure twig globals
        this.app.locals.sideMenu = SideMenu;
        this.app.locals.owner = 'portal.upsense.co';
        this.app.locals.security = {
            roles: {
                admin: 'admin',
                manager: 'manager',
                users: 'user'
            }
        };

        this.app.dynamicHelpers

        // register the app routes
        this.app
            // Login/Logout route
            .get('/login', loginController.loginView)
            .post('/login', loginController.loginView)
            .post('/logout', async (request: Request, response: Response) => {
                await Logout(request, response);
            })

            // Dashboard route
            .get('/dashboard', Authenticate, DashboardController.indexView)

            // Admin route
            .get('/accounts/admin/list', Authenticate, AdminController.indexView)
            .post('/accounts/admin/list', Authenticate, AdminController.indexAction)
            .get('/accounts/admin/new', Authenticate, AdminController.createView)
            .post('/accounts/admin/new', Authenticate, AdminController.createAction)
            .get('/accounts/admin/:id(\\d+)/edit', Authenticate, AdminController.editView)
            .post('/accounts/admin/:id(\\d+)/edit', Authenticate, AdminController.editAction)

            // Manager route
            .get('/accounts/manager/list', Authenticate, ManagerController.indexView)
            .post('/accounts/manager/list', Authenticate, ManagerController.indexAction)
            .get('/accounts/manager/new', Authenticate, ManagerController.createView)
            .post('/accounts/manager/new', Authenticate, ManagerController.createAction)
            .get('/accounts/manager/:id(\\d+)/edit', Authenticate, ManagerController.editView)
            .post('/accounts/manager/:id(\\d+)/edit', Authenticate, ManagerController.editAction)

            // Staff route
            .get('/accounts/staff/list', Authenticate, StaffController.indexView)
            .post('/accounts/staff/list', Authenticate, StaffController.indexAction)
            .get('/accounts/staff/new', Authenticate, StaffController.createView)
            .post('/accounts/staff/new', Authenticate, StaffController.createAction)
            .get('/accounts/staff/:id(\\d+)/edit', Authenticate, StaffController.editView)
            .post('/accounts/staff/:id(\\d+)/edit', Authenticate, StaffController.editAction)

            // Company route
            .get('/company/list', Authenticate, CompanyController.indexView)
            .post('/company/list', Authenticate, CompanyController.indexAction)
            .get('/company/new', Authenticate, CompanyController.createView)
            .post('/company/new', Authenticate, CompanyController.createAction)
            .get('/company/:id(\\d+)/edit', Authenticate, CompanyController.editView)
            .post('/company/:id(\\d+)/edit', Authenticate, CompanyController.editAction)
            .get('/company/:id(\\d+)/view', Authenticate, CompanyController.detailView)

            // Zone route
            .post('/company/:companyId(\\d+)/zone/list', Authenticate, ZoneController.indexAction)
            .get('/company/:companyId(\\d+)/zone/new', Authenticate, ZoneController.createView)
            .post('/company/:companyId(\\d+)/zone/new', Authenticate, ZoneController.createAction)
            .get('/company/:companyId(\\d+)/zone/:id(\\d+)/edit', Authenticate, ZoneController.editView)
            .post('/company/:companyId(\\d+)/zone/:id(\\d+)/edit', Authenticate, ZoneController.editAction)

            // Hub route
            .get('/devices/hub/list', Authenticate, HubController.indexView)
            .post('/devices/hub/list', Authenticate, HubController.indexAction)
            .get('/devices/hub/new', Authenticate, HubController.createView)
            .post('/devices/hub/new', Authenticate, HubController.createAction)
            .get('/devices/hub/:id(\\d+)/edit', Authenticate, HubController.editView)
            .post('/devices/hub/:id(\\d+)/edit', Authenticate, HubController.editAction)

            // Sensor route
            .get('/devices/sensor/list', Authenticate, SensorController.indexView)
            .post('/devices/sensor/list', Authenticate, SensorController.indexAction)
            .get('/devices/sensor/new', Authenticate, SensorController.createView)
            .post('/devices/sensor/new', Authenticate, SensorController.createAction)
            .get('/devices/sensor/:id(\\d+)/edit', Authenticate, SensorController.editView)
            .post('/devices/sensor/:id(\\d+)/edit', Authenticate, SensorController.editAction)

            .use(Authenticate, (request: Request, response: Response) => {
                response
                    .status(404)
                    .render('404.html.twig');
            });

        // websocket/mqtt connection
        let MQTT_OPTIONS = {
            port: mqttConfig.port,
            host: mqttConfig.host,
            protocol: mqttConfig.protocol,
            // username: mqttConfig.username,
            // password: mqttConfig.password,
            rejectUnauthorized: false,
        };

        this.mqttClient = mqtt.connect(MQTT_OPTIONS);

        this.mqttClient.on('connect', () => {
            // make sure mqtt connection stablished before listening to ws connections
            console.log('Websocket connection to MQTT broker: OK');

            // this.io.on('connection', (socket: any) => {
            //     console.log(`Client ${socket.id} has connected`);
            // });

            this.mqttClient.subscribe('sensors/data');

            this.mqttClient.on('message', (topic: string, data: Buffer) => {
                this.io.emit('sdu', data.toString());
            });
        });

        this.server.listen(portalConfig.port, () => console.log(`Portal is running at port ${portalConfig.port}`));
    }
}

new Portal();
