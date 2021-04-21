import { Router } from "express"
import UserCtrl from "./userController"
import AuthCtrl from "./authController"
import FileUploader from "../../storage"

const authRouter = new Router();
const userRouter = new Router();

// Authentication Router
authRouter.route('/register')
  .post(AuthCtrl.register)

authRouter.route('/signin')
  .post(AuthCtrl.signIn)

authRouter.route('/signout')
  .get(AuthCtrl.signOut)

authRouter.route('/password')
  .put(AuthCtrl.updatePassword)


// User Router
userRouter.route('/')
  .get(UserCtrl.getUsers)

userRouter.route('/:username')
  .get(UserCtrl.getUser)
  .delete(UserCtrl.deleteUser)
  .put(UserCtrl.updateUser)

userRouter.route('/:username/photos')
  .post(FileUploader.single("data"), UserCtrl.addPhoto)

userRouter.route('/:username/photos/:id')
  .get(UserCtrl.getPhoto)
  .delete(UserCtrl.deletePhoto)

userRouter.route('/:username/degrees')
  .get(UserCtrl.getDegrees)
  .post(UserCtrl.addDegree)

userRouter.route('/:username/degrees/:id')
  .delete(UserCtrl.deleteDegree)

userRouter.route('/:username/jobs')
  .get(UserCtrl.getJobs)
  .post(UserCtrl.addJob)

userRouter.route('/:username/jobs/:id')
  .delete(UserCtrl.deleteJob)

userRouter.route('/:username/services')
  .get(UserCtrl.getServices)
  .post(UserCtrl.addService)

userRouter.route('/:username/services/:id')
  .delete(UserCtrl.deleteService)

userRouter.route('/:username/insurances')
  .get(UserCtrl.getInsurances)
  .post(UserCtrl.addInsurance)

userRouter.route('/:username/insurances/:id')
  .delete(UserCtrl.deleteInsurance)

  userRouter.route('/:username/payments')
    .get(UserCtrl.getPayments)

userRouter.route('/:username/labReports')
  .get(UserCtrl.getReports)

userRouter.route('/:username/medications')
  .get(UserCtrl.getMedications)

// router.get('/user/:username', utils.limiter, utils.speedLimiter, authCtrl.getUser);
// router.use('/example-path', example); ==> to be routed to: api/chosen_path for example

export { authRouter, userRouter }
