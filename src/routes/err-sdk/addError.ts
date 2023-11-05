import { body, validationResult } from 'express-validator';
import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/addError',
		[
			body('userCode').notEmpty().withMessage('userCode cannot be empty'),
			body('typeValue').isInt().withMessage('typeValue must be a number').notEmpty().withMessage('typeValue cannot be empty'),
			body('errorContent').notEmpty().withMessage('errorContent cannot be empty'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			const { typeValue, userCode, errorContent } = req.body;

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			mysqlUTils.query<string, number>(
				'INSERT INTO `errors`(type_value,user_code,error_content) VALUES(?,?,?);',
				[typeValue, userCode, errorContent],
				function (results) {
					return res.status(200).json({
						status: 1,
						message: 'success',
						content: results,
					});
				}
			);
		}
	);
};
