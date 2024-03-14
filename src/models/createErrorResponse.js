/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorWithMessage:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Always false. This model is only used for failures.
 *         message:
 *           type: any
 *           description: Information about why the request failed.
 *       example:
 *         success: false
 *         message: start date cannot be after end date.
 */
module.exports = function(errMessage) {
	return {
		success : false,
		message : errMessage
	};
};