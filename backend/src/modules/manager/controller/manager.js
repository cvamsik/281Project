'use strict'

import Projects from '../../../models/mongoDB/projects'
import constants from '../../../utils/constants'
const multiparty = require('multiparty');
import deviceFarm from '../../deviceFarm/controller/deviceFarm';

/**
 * Create user and save data in database.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.addProject = async (req, res) => {

	try {
		var form = new multiparty.Form();
		var newObj = {}
		form.parse(req, async function(err, fields, files) {
			let temp = newObj
			Object.keys(fields).forEach(function(name) {
				let that = temp
				let key = String(name), value = String(fields[name])
				that[key] = value
			});
			
			let projectObj,
			newProject,
			createdProject
			
			projectObj= temp;
			
			var params = {
				name : projectObj.name
			}
			var ARN = deviceFarm.createProject(params);
			projectObj.ARN = ARN;
			newProject = new Projects(projectObj);
			createdProject = await newProject.save();
			createdProject = createdProject.toJSON();
			return res
				.status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
				.send(createdProject)
		});

	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}


/**
 * Returns list of all projects created by the manager.
 * @param  {Object} req request object
 * @param  {Object} res response object
 */
exports.allProjects = async (req, res) => {

	try {
		let filter

		filter = {
			managerId: req.params.managerId
		}
		
		let allProjects = await Projects.find(filter)
		// console.log(allProjects)
		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(allProjects)
	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}
