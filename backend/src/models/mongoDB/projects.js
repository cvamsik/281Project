`use strict`

import mongoose from 'mongoose'

const Project = new mongoose.Schema({
    managerId: {
		type: mongoose.Types.ObjectId,
		required: true,
    },
	name: {
		type: String,
		maxlength: 50,
		required: true,
    },
    ARN: {
        type: String
    },
	shortDescription: {
		type: String,
		required: true
	},
	detailedDescription: {
		type: String
	},
	companyName: {
		type: String,
		default: null
	},
	address: {
		type: String,
	},
	city: {
		type: String,
	},
	state: {
		type: String,
	},
	zip: {
		type: String,
	},
	testCases: {
		type: String,
	},
	technologies: {
		type: String,
    },
    file: {
        file: String,
	},
	createdTime: {
		type: Date,
		default: Date.now,
	},
	requestedTesters: [ mongoose.Types.ObjectId ],
	acceptedTesters: [ mongoose.Types.ObjectId ],
	rejectedTesters: [ mongoose.Types.ObjectId ],
}, { versionKey: false })

export default mongoose.model('projects', Project)