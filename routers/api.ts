    import express from 'express';
    import GET_COURSES_TITLES_ROUTER from './get-course-titles';
    import GET_COURSE_ROUTER from './get-course';
    import CREATE_COURSE_ROUTER from './create-course';
    import DELETE_COURSE from './delete-course';
    import MODIFY_COURSE from './modify-course';
    import ADD_USER from './add-user';
    import LOGIN from './login/login';
    import LOGIN_SESSION from './login/login-session';
    import LOGOUT_SESSION from './logout';
    import DELETE_USER from './delete-user';
    import GET_ALL_USERNAMES from './get-all-usernames';
    import MODIFY_USER from './modify-user';

    const APIROUTER = express.Router();
        
    APIROUTER.use('/', GET_COURSES_TITLES_ROUTER);

    APIROUTER.use('/', GET_COURSE_ROUTER);

    APIROUTER.use('/', CREATE_COURSE_ROUTER);

    APIROUTER.use('/', DELETE_COURSE);

    APIROUTER.use('/', MODIFY_COURSE);

    APIROUTER.use('/', MODIFY_USER);

    APIROUTER.use('/', ADD_USER);

    APIROUTER.use('/', LOGIN);

    APIROUTER.use('/', LOGIN_SESSION);

    APIROUTER.use('/', LOGOUT_SESSION);

    APIROUTER.use('/', DELETE_USER);

    APIROUTER.use('/', GET_ALL_USERNAMES);

    export default APIROUTER;