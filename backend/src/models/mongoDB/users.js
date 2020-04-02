`use strict`

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import config from '../../../config'
require('mongoose-type-email');

const Users = new mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
		required: true,
	},
	email: {
		type: mongoose.SchemaTypes.Email,
		required: true
	},
	password: {
		type: String,
		required: true,
	},
	isActive: {
		type : Boolean,
		default : true,
	},
	type: {
		type: String,
		required: true
	},
	project_involved: [String],
	applied_project:{type:Array},
	rejected_projects:{type:Array},
}, { versionKey: false })

Users.pre('save', function preSave(next) {
	try {
		const user = this
		if (!user.isModified('password')) {
			return next()
		}
		let salt = bcrypt.genSaltSync(10)
		var hash = bcrypt.hashSync(user.password, salt)
		user.password = hash
		next(null)
	} catch (error) {
		next(error)
	}
})

Users.methods.validatePassword = function validatePassword(password) {
	const user = this
	return new Promise((resolve) => {
		try {
			let isMatch = bcrypt.compareSync(password, user.password)
			resolve(isMatch)
		} catch (error) {
			resolve(false)
		}
	})
}

Users.methods.generateToken = function generateToken() {
	const user = this

	return jwt.sign({
		id: user._id
	}, config.token)
}

export default mongoose.model('users', Users)