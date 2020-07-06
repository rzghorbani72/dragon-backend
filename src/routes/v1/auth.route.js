const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const resetPasswordController = require('../../controllers/resetPassword.controller');
const { authorize, oAuth: oAuthLogin } = require('../../middlewares/auth');
const {
  login,
  register,
  oAuth,
  refresh,
  fireBaseToken,
  logout,
  updatePassword,
  resetByEmail,
  resetPassword,
  confirmByEmail,
} = require('../../validations/auth.validation');

const router = express.Router();
/**
 * @swagger
 * definitions:
 *   Auth:
 *     properties:
 *              email:
 *                type: string
 *                format: email
 *                description: User's email
 *              username:
 *                type: string
 *                format: email
 *                required: true
 *                description: User's email
 *              password:
 *                type: string
 *                minLength: 6
 *                maxLength: 128
 *                description: User's password
 *              src:
 *                type: object
 *                required: true
 *                description: User's src version and platform
 *                properties:
 *                  platform:
 *                    type: string
 *                    enum:
 *                      - 'android'
 *                      - 'ios'
 *                      - 'web'
 *                    default: 'android'
 *                  version:
 *                    type: string
 *                    required: true
 */
/**
 * @swagger
 * definitions:
 *   Token:
 *     properties:
 *              tokenType:
 *                type: string
 *                default: 'Bearer'
 *                description: Access Token's type
 *              access_token:
 *                type: string
 *                description: Authorization Token
 *              refresh_token:
 *                type: string
 *                description: Token to get a new accessToken after expiration time
 *              expiresIn:
 *                type: string
 *                format: date-time
 *                description: Access Token's expiration time in miliseconds
 */
/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: register new user
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: user
 *          description: User object
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                $ref: '#/definitions/Auth'
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       200:
 *         description: created new user
 *         schema:
 *           type: object
 *           properties:
 *            user:
 *              type: object
 *              $ref: '#/definitions/User'
 *            token:
 *              type: object
 *              $ref: '#/definitions/Token'
 *
 */
router.route('/register')
  .post(validate(register), controller.register);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: login registered user
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: user
 *          description: User object
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              user:
 *                type: object
 *                $ref: '#/definitions/Auth'
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Incorrect email or password
 *       200:
 *         description: created new user
 *         schema:
 *           type: object
 *           properties:
 *            user:
 *              type: object
 *              $ref: '#/definitions/User'
 *            token:
 *              type: object
 *              $ref: '#/definitions/Token'
 *
 */
router.route('/login')
  .post(validate(login), controller.login);


/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     description: logout registered user
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: refreshToken
 *          description: User refreshToken
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *                required: true
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Refresh token not valid
 *       204:
 *         description: logout successfully
 *
 */
router.route('/logout')
  .post(validate(logout), controller.logout);

/**
 * @swagger
 * /v1/auth/token:
 *   post:
 *     tags:
 *       - Auth
 *     description: Refresh expired accessToken
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: refreshToken
 *          description: User refreshToken
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *                required: true
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Refresh token not valid
 *       200:
 *         description: Refresh Token
 *         schema:
 *           type: object
 *           properties:
 *            token:
 *              type: object
 *              $ref: '#/definitions/Token'
 *
 *
 */
router.route('/token')
  .post(validate(refresh), controller.refresh);


/**
 * TODO: POST /v1/auth/reset-password
 */


/**
 * @swagger
 * /v1/auth/facebook:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login with facebook. Creates a new user if it does not exist
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: access_token
 *          description: Facebook's access_token
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *        - name: src
 *          description: User's src version and platform
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *                platform:
 *                  type: string
 *                  enum:
 *                    - 'android'
 *                    - 'ios'
 *                    - 'web'
 *                  default: 'android'
 *                version:
 *                  type: string
 *                  required: true
 *
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Refresh token not valid
 *       200:
 *         description: created new user
 *         schema:
 *           type: object
 *           properties:
 *            user:
 *              type: object
 *              $ref: '#/definitions/User'
 *            token:
 *              type: object
 *              $ref: '#/definitions/Token'
 *
 */
router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

/**
 * @swagger
 * /v1/auth/google:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login with google. Creates a new user if it does not exist
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: access_token
 *          description: Google's access_token
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *        - name: src
 *          description: User's src version and platform
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *                platform:
 *                  type: string
 *                  enum:
 *                    - 'android'
 *                    - 'ios'
 *                    - 'web'
 *                  default: 'android'
 *                version:
 *                  type: string
 *                  required: true
 *
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Refresh token not valid
 *       200:
 *         description: created new user
 *         schema:
 *           type: object
 *           properties:
 *            user:
 *              type: object
 *              $ref: '#/definitions/User'
 *            token:
 *              type: object
 *              $ref: '#/definitions/Token'
 *
 */
router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);

/**
 * @swagger
 * /v1/auth/firebase:
 *   post:
 *     tags:
 *       - Auth
 *     description: Save user firebase token based on his/her platform and version
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: Authorization
 *          description: User token
 *          in: header
 *          required: true
 *        - name: refreshToken
 *          description: User refreshToken
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *            required: true
 *        - name: firebase_token
 *          description: User firebase token
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *            required: true
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Refresh token not valid
 *       200:
 *         description: saved Refresh Token
 *
 *
 */
router.post('/firebase', authorize(), validate(fireBaseToken), controller.saveFireBaseToken);

/**
 * @swagger
 * /v1/auth/password/change:
 *   patch:
 *     tags:
 *       - Auth
 *     description: Change user password
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: Authorization
 *          description: User token
 *          in: header
 *          required: true
 *        - name: old
 *          description: User current password
 *          in: body
 *          schema:
 *            type: string
 *            required: true
 *        - name: new
 *          description: User new password
 *          in: body
 *          required: true
 *          schema:
 *            type: string
 *            required: true
 *        - name: src
 *          description: User src version and platform.
 *          required: true
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              version:
 *                type: string
 *                required: true
 *              platform:
 *                type: string
 *                required: true
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Refresh token not valid
 *       200:
 *         description: saved Refresh Token
 *
 *
 */
router.patch('/password/change', authorize(), validate(updatePassword), controller.updatePassword);


/**
 * @swagger
 * /v1/auth/password/forget:
 *   post:
 *     tags:
 *       - Auth
 *     description: send valid token to user email if email was valid for reset password.
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: email
 *          description: User registered email.
 *          required: true
 *          in: body
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     email was not valid
 *       200:
 *         description: Email successfully sent.
 *
 *
 */
router.post('/password/forget', validate(resetPassword), resetPasswordController.forgetPassword);
/**
 * @swagger
 * /v1/auth/password/reset:
 *   post:
 *     tags:
 *       - Auth
 *     description: take emailed token and set new enterd password as new password for user
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: resetToken
 *          description: emailed token.
 *          required: true
 *          in: body
 *        - name: password
 *          description: new user password.
 *          required: true
 *          in: body
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Invalid or expired reset token
 *       200:
 *         description: Password reset successfully.
 *
 *
 */
router.post('/password/reset', validate(resetByEmail), resetPasswordController.resetByEmail);
/**
 * @swagger
 * /v1/auth/confirmation/confirm-by-email:
 *   post:
 *     tags:
 *       - Auth
 *     description: confirm user email when signed by entering email and password.
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: token
 *          description: confirem token.
 *          required: true
 *          in: body
 *     responses:
 *       400:
 *        description: ValidationError  Some parameters may contain invalid values
 *       401:
 *        description: Unauthorized     Invalid confirme token.
 *       200:
 *         description: Confirmed User email verification.
 *
 *
 */
router.post('/confirmation/confirm-by-email', validate(confirmByEmail), resetPasswordController.confirmByEmail);

module.exports = router;
