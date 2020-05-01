'use strict'

import mongoose from 'mongoose';
import Bugs from '../../../models/mongoDB/bugs'
import Users from '../../../models/mongoDB/users';
import constants from '../../../utils/constants';
import deviceFarmController from '../../deviceFarm/controller/deviceFarm';

const fetch = require("node-fetch");

exports.createBug = async (req, res) => {
	try {
        var bugObject = {
            name: req.body.name,
            subject : req.body.subject,
            projectId : req.body.projectId,
            status : req.body.status,
            severity : req.body.severity,
            tester : req.body.tester
		}
		console.log(bugObject)
        var newBug = new Bugs(bugObject);
        var createdBug = await newBug.save();
        return res
                .status(constants.STATUS_CODE.CREATED_SUCCESSFULLY_STATUS)
                .send(createdBug);
	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.getAllBugs = async (req, res) => {
	try {
        let details = await Users.findById(
			mongoose.Types.ObjectId(req.params.userId)
		)
		if (details) {
			let projects = details.toJSON().acceptedProjects;
            let bugs = await Bugs.find({
                projectId : {
                    $in : projects
                }
			})
            return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
            .send(bugs)
        }
	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.getBug = async (req, res) => {

	try {
		let filter = {
			_id: req.params.bugId
		}
		let bug = await Bugs.find(filter)
		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(bug[0])
	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.updateBug = async (req, res) => {
	try {
		await Bugs.findByIdAndUpdate(
            { _id : req.params.bugId},
			{
                    name: req.body.name,
                    subject : req.body.subject,
                    severity : req.body.severity,
                    status : req.body.status,
                    tester : req.body.tester
			},
			function(err, result) {
				if (err) {
				  res.send(err);
				} else {
				  res.status(200).send(result)
				}
			  }
		)
	} catch (error) {
		console.log(`Error while updating bug: ${error}`)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.getBugsInProject = async (req, res) => {

	try {
		let filter = {
			projectId: req.params.projectId
		}
		let bugs = await Bugs.find(filter)
		return res
			.status(constants.STATUS_CODE.SUCCESS_STATUS)
			.send(bugs)
	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.deleteBug = async (req,res) => {
	try{
		Bugs.deleteOne({ _id: req.body.bugId }, 
			function(err, result) {
				if (err) {
				res.send(err);
				} else {
				res.status(200).send()
				}
			  }
		)
	}
	catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

exports.getBugsCountInProject = async (req,res) => {
	try {
		let filter = {
			projectId: req.params.projectId
		}
		Bugs.count(filter,function(err,count){
			if(err){
				return res
				.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
				.send(error.message)
			}
			else{
				return res
				.status(constants.STATUS_CODE.SUCCESS_STATUS)
				.send({count})
			}
		})
	} catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.status(500)
			.send(error.message)
	}
}

exports.getErrorReports = async (req,res) => {
	try{
		let listArtifacts = await deviceFarmController.listArtifactsInternal(req.query.runArn,req.query.type);
		let resultObject = {}
		let artifactsObject = []
		let promises = [] 
		let runDetails = listArtifacts["runDetails"];
		resultObject["arn"] = runDetails["arn"];
		let allArtifacts = listArtifacts["allArtifacts"];

		allArtifacts.forEach(item => {

			let errorObjects = [];
			let artifactObject = {};
			let artifacts = item.artifacts
			artifactObject["job"] = item.job;

			artifacts.forEach( element =>{
				promises.push( getUrlContent(element.url,errorObjects));
			})

			artifactObject["errors"] = errorObjects;
			artifactsObject.push(artifactObject);
		});
		Promise.all(promises)
		.then( result => {
			return res.status(constants.STATUS_CODE.SUCCESS_STATUS).send(artifactsObject)
		})
	}
	catch (error) {
		console.log(error.message)
		return res
			.status(constants.STATUS_CODE.INTERNAL_SERVER_ERROR_STATUS)
			.send(error.message)
	}
}

let getUrlContent =  (artifactURL,errorObjects) =>{
	return new Promise(function (resolve, reject) {
	fetch(artifactURL, {
		mode: 'no-cors',
		headers: {
		  'Access-Control-Allow-Origin':'*'
		}
	})
	.then( response => {
		return response.json();
	})
	.then( response => {
		response.map(element => {
			if(element.level==="Error"){
				errorObjects.push({
					"pid" : element.pid,
					"data" : element.data
				})
			}
		})
		resolve(errorObjects);
	})
	.catch(error => {
		console.log("error",error.message);
		reject();
	})
})
}

