/*
==============================================
User Controller
----------------------------------------------
Standard Methods:
- Check
- Signup
- Patient Creation
- Login
- Read
- Readall
- Query
- Update
- Delete

Complex Methods:
- Total Reads
==============================================
*/
const NodeRSA = require('node-rsa');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const StickyNote = require('../models/stickyNote');
const MemberSurvey = require('../models/memberSurvey');
const Facility = require('../models/facility');
const Address = require('../models/address');
const signToken = require('../utils/signToken');
const axios = require('axios');
const config = require('../config/config');
const logger = require('../config/logging');
const res = require('express/lib/response');
const log = logger.users;

// ====================================================
// Encryption routes for keys and extracting keys
// ====================================================

let key_private = new NodeRSA();
let key_public = new NodeRSA();

var public = fs.readFileSync('./Keys/public.pem', 'utf8');
var private = fs.readFileSync('./Keys/private.pem', 'utf8');

key_private.importKey(private);
key_public.importKey(public);

// ====================================================
// Add Administration User if no Users Exist
// ====================================================
exports.install = (req, res, next) => {
	Facility.find()
		.exec()
		.then(facilities => {
			if (facilities.length > 0) {
				return res.status(404).json({
					message: 'Route not found.'
				});
			} else {
				/* Create Default Facility */
				const facility = new Facility({
					_id: new mongoose.Types.ObjectId(),
					name: config.server.default.facility.name,
					prefix: config.server.default.facility.prefix
				});

				facility
					.save()
					.then(newFacility => {
						/* Create Default User */
						bcrypt.hash(config.server.default.admin.password, 10, (hashError, hash) => {
							if (hashError) {
								log.error('There was an error hashing a signup password');

								return res.status(401).json({
									message: hashError
								});
							}

							/* User Object */
							const user = new User({
								_id: new mongoose.Types.ObjectId(),
								sequence_id: 1,
								email: config.server.default.admin.email,
								password: hash,
								enabled: true,
								role: 'Admin',
								patients: new Array(),
								workers: new Array(),
								projectList: new Array(),
								collectionList: new Array(),
								memberCollectionList: new Array(),
								memberSurveyList: new Array(),
								facilityId: newFacility._id,
								info: {
									name: config.server.default.admin.name,
									gender: 'Undisclosed',
									dateOfBirth: new Date(),
									language: 'English'
								}
							});

							/* Save User */
							user
								.save()
								.then(newUser => {
									if (newUser) {
										log.info('Administration User Set');
										return res.status(201).json({
											_id: newUser._id,
											request: {
												type: 'GET',
												url:
													config.server.protocol +
													'://' +
													config.server.hostname +
													':' +
													config.server.port +
													config.server.extension +
													'/users/' +
													newUser._id
											}
										});
									} else {
										return res.status(401).json({
											message: 'Email or password is invalid.'
										});
									}
								})
								.catch(error => {
									log.error(error.message);

									return res.status(500).json({
										message: error.message
									});
								});
						});
					})
					.catch(error => {
						log.error(error.message);

						return res.status(500).json({
							message: error.message
						});
					});
			}
		})
		.catch(error => {
			log.error(error.message);

			return res.status(500).json({
				message: error.message
			});
		});
};

// ====================================================
// Check if User is authenticated
// ====================================================
exports.check = (req, res, next) => {
	return res.status(200).json({
		message: 'Token Valid'
	});
};

// ====================================================
// Create a new user
// ----------------------------------------------------
// Input:
// - Email
// - Password
// ====================================================
exports.signup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const enabled = req.body.enabled;
	const role = req.body.role;
	const facility = req.body.facilityId;
	const name = key_public.encrypt(req.body.info.name, 'base64');
	const phone = req.body.info.phone;

	const gender = key_public.encrypt(req.body.info.gender, 'base64');
	const dateOfBirth = req.body.info.dateOfBirth;
	const language = req.body.info.language;

	const _address = {
		street: req.body.info.address.street,
		city: req.body.info.address.city,
		state: req.body.info.address.state,
		code: req.body.info.address.code,
		country: req.body.info.address.country
	};

	const address = new Address({
		_id: new mongoose.Types.ObjectId(),
		street: _address.street,
		city: _address.city,
		state: _address.state,
		code: _address.code,
		country: _address.country
	});

	address
		.save()
		.then(newAddress => {
			User.find({ email: email })
				.exec()
				.then(emailQuery => {
					if (emailQuery.length == 0) {
						bcrypt.hash(password, 10, (hashError, hash) => {
							if (hashError) {
								log.error('There was an error hashing a signup password');

								return res.status(401).json({
									message: hashError
								});
							}

							//Sort by -Id time-stamp in descending order which gets the last object
							User.findOne()
								.sort({ createdAt: -1 })
								.exec()
								.then(lastUser => {
									if (lastUser) {
										if (lastUser.sequence_id && lastUser.sequence_id > 0) {
											const getNextSequenceValue = lastUser.sequence_id + 1;

											const user = new User({
												_id: new mongoose.Types.ObjectId(),
												sequence_id: getNextSequenceValue,
												email: email,
												password: hash,
												enabled: enabled,
												role: role,
												facilityId: facility,
												patients: new Array(),
												workers: new Array(),
												projectList: new Array(),
												collectionList: new Array(),
												memberCollectionList: new Array(),
												memberSurveyList: new Array(),
												research: {
													full: ''
												},
												info: {
													name: name,
													gender: gender,
													dateOfBirth: dateOfBirth,
													phone: phone,
													language: language,
													currentAddress: newAddress._id
												}
											});

											user
												.save()
												.then(newUser => {
													if (newUser) {
														log.info('New user for email ' + newUser.email + ' created');

														return res.status(201).json({
															_id: newUser._id,
															request: {
																type: 'GET',
																url:
																	config.server.protocol +
																	'://' +
																	config.server.hostname +
																	':' +
																	config.server.port +
																	config.server.extension +
																	'/users/' +
																	newUser._id
															}
														});
													} else {
														return res.status(401).json({
															message: 'Email or password is invalid.'
														});
													}
												})
												.catch(error => {
													log.error(error.message);

													return res.status(500).json({
														message: error.message
													});
												});
										} else {
											log.error('There was an error forming a unique sequence id ' + sequence_id);

											return res.status(401).json({
												message: 'Invalid Sequence ID'
											});
										}
									} else {
										return res.status(401).json({
											message: 'Null Sequence ID Find'
										});
									}
								})
								.catch(error => {
									log.error(error.message);

									return res.status(500).json({
										message: error.message
									});
								});
						});
					} else {
						log.warn('Email ' + email + ' already exists in the database');

						return res.status(401).json({
							message: 'The email ' + email + ' is already in use.'
						});
					}
				})
				.catch(error => {
					log.error(error.message);

					return res.status(500).json({
						message: error.message
					});
				});
		})
		.catch(error => {
			log.error(error.message);

			return res.status(500).json({
				message: error.message
			});
		});
};

// ====================================================
// Login
// ----------------------------------------------------
// The main authorization is handled by Passport, so
// just generate a JWT!
// ====================================================
exports.login = (req, res, next) => {
	log.warn(req);

	if (req.user == null) {
		log.warn('User was not part of the request.  Unauthorized.');

		return res.status(401).json({
			message: 'Unauthorized'
		});
	}

	try {
		if (req.user.enabled) {
			if (req.user.info.name.length > 50) {
				const token = signToken(req.user);

				log.info('User ' + req.user.email + ' succesful authenticated.');

				return res.status(200).json({
					message: 'Authorized',
					user: {
						_id: req.user._id,
						info: {
							pastAddresses: req.user.info.pastAddresses,
							name: key_private.decrypt(req.user.info.name, 'utf8'),
							gender: key_private.decrypt(req.user.info.gender, 'utf8'),
							dateOfBirth: req.user.info.dateOfBirth,
							language: req.user.info.language,
							currentAddress: req.user.info.currentAddress
						},
						research: {
							enabled: req.user.research.enabled,
							full: req.user.research.full
						},
						patients: req.user.patients,
						workers: req.user.workers,
						projectList: req.user.projectList,
						collectionList: req.user.collectionList,
						memberCollectionList: req.user.memberCollectionList,
						memberSurveyList: req.user.memberSurveyList,

						sequence_id: req.user.sequence_id,
						email: req.user.email,
						password: req.user.password,
						enabled: req.user.enabled,
						role: req.user.role,
						facilityId: {
							_id: '60e1f2bd08fa9904cc62cdf5',
							name: 'Palliative IMS Facility',
							prefix: 'YQG'
						},
						createdAt: req.user.createdAt,
						updatedAt: req.user.updatedAt,
						__v: req.user.__v
					},
					token: token
				});
			} else if (req.user.info.name.length < 50) {
				const token = signToken(req.user);

				log.info('User ' + req.user.email + ' succesful authenticated.');

				return res.status(200).json({
					message: 'Authorized',
					user: req.user,
					token: token
				});
			}
		} else {
			log.warn('User ' + req.user.email + ' account disabled.  Unauthorized.');

			return res.status(401).json({
				message: 'Account disabled'
			});
		}
	} catch (error) {
		log.error('Unable to sign token: ' + error.message);

		return res.status(500).json({
			message: 'Unable to sign token'
		});
	}
};

exports.WECClogin = (req, res, next) => {
	log.info('Accessing WECC login server.  Authenticating ......');

	let _token = req.body.token;
	let token = _token.split(' ')[1];
	let url = 'https://weccc.dev/api/users/validatetoken';

	let email = req.body.email;

	axios({
		method: 'post',
		url: url,
		headers: {
			'Content-Type': 'application/json'
		},
		data: {
			token: token
		},
		timeout: 5000
	})
		.then(response => {
			if (response.status === 200 || response.status === 304) {
				log.info('Token verified VIA WECC API for ' + email);

				return User.findOne({ email: email })
					.select('-password')
					.populate('facilityId', '_id name enabled prefix')
					.exec()
					.then(user => {
						if (user) {
							if (user.info.name.length > 60) {
								const __token = signToken(user);
								log.info('User ' + email + ' succesful authenticated.');

								return res.status(200).json({
									message: 'Authorized',
									user: {
										_id: req.user._id,
										info: {
											pastAddresses: req.user.info.pastAddresses,
											name: key_private.decrypt(req.user.info.name, 'utf8'),
											gender: key_private.decrypt(req.user.info.gender, 'utf8'),
											dateOfBirth: req.user.info.dateOfBirth,
											language: req.user.info.language,
											currentAddress: req.user.info.currentAddress
										},
										research: {
											enabled: req.user.research.enabled,
											full: req.user.research.full
										},
										patients: req.user.patients,
										workers: req.user.workers,
										projectList: req.user.projectList,
										collectionList: req.user.collectionList,
										memberCollectionList: req.user.memberCollectionList,
										memberSurveyList: req.user.memberSurveyList,

										sequence_id: req.user.sequence_id,
										email: req.user.email,
										password: req.user.password,
										enabled: req.user.enabled,
										role: req.user.role,
										facilityId: {
											_id: '60e1f2bd08fa9904cc62cdf5',
											name: 'Palliative IMS Facility',
											prefix: 'YQG'
										},
										createdAt: req.user.createdAt,
										updatedAt: req.user.updatedAt,
										__v: req.user.__v
									},
									token: __token
								});
							} else if (user.info.name.length < 60) {
								const __token = signToken(user);
								log.info('User ' + email + ' succesful authenticated.');

								return res.status(200).json({
									message: 'Authorized',
									user: user,
									token: __token
								});
							}
						} else {
							log.warn('Email not found for WECC: ' + email);

							return res.status(401).json({
								message: 'Unauthorized'
							});
						}
					})
					.catch(error => {
						log.error('Unable to sign in via WECC: ' + error.message);

						return res.status(500).json({
							message: 'Unable to sign in via WECC.'
						});
					});
			} else {
				log.warn('Token unverified VIA WECC API for ' + email);

				return res.status(401).json({
					message: 'Unauthorized'
				});
			}
		})
		.catch(error => {
			log.error('Unable to sign in via WECC: ' + error.message);

			return res.status(500).json({
				message: 'Unable to sign in via WECC.'
			});
		});
};

// ====================================================
// Read
// ====================================================
exports.read = (req, res, next) => {
	const id = req.params.userID;

	log.info('Incoming read for user with id ' + id);

	User.findById(id)
		.select('-password')
		.populate('facilityId')
		.populate('patients', '_id email role info  research enabled facilityId patients workers createdAt updatedAt')
		.populate('workers', '_id email role info research enabled facilityId patients workers createdAt updatedAt')
		.populate('info.currentAddress')
		.exec()
		.then(user => {
			if (user) {
				if (user.info.name.length > 60) {
					res.status(200).json({
						user: {
							_id: req.user._id,
							info: {
								pastAddresses: req.user.info.pastAddresses,
								name: key_private.decrypt(req.user.info.name, 'utf8'),
								gender: key_private.decrypt(req.user.info.gender, 'utf8'),
								dateOfBirth: req.user.info.dateOfBirth,
								language: req.user.info.language,
								currentAddress: req.user.info.currentAddress
							},
							research: {
								enabled: req.user.research.enabled,
								full: req.user.research.full
							},
							patients: user.patients.map(patients => {
								return {
									info: {
										pastAddresses: patients.info.pastAddress,
										name: key_private.decrypt(patients.info.name, 'utf8'),
										gender: key_private.decrypt(patients.info.gender, 'utf8'),
										dateOfBirth: patients.info.dateOfBirth,
										language: patients.info.language,
										currentAddress: patients.info.currentAddress
									},
									research: patients.research,
									patients: patients.patients,
									workers: patients.workers,
									_id: patients._id,
									email: patients.email,
									enabled: patients.enabled,
									role: patients.role,
									facilityId: patients.facilityId,
									createdAt: patients.createdAt,
									updatedAt: patients.updatedAt
								};
							}),
							workers: req.user.workers,
							projectList: req.user.projectList,
							collectionList: req.user.collectionList,
							memberCollectionList: req.user.memberCollectionList,
							memberSurveyList: req.user.memberSurveyList,

							sequence_id: req.user.sequence_id,
							email: req.user.email,
							password: req.user.password,
							enabled: req.user.enabled,
							role: req.user.role,
							facilityId: {
								_id: '60e1f2bd08fa9904cc62cdf5',
								name: 'Palliative IMS Facility',
								prefix: 'YQG'
							},
							createdAt: req.user.createdAt,
							updatedAt: req.user.updatedAt,
							__v: req.user.__v
						},
						request: {
							type: 'GET',
							url:
								config.server.protocol +
								'://' +
								config.server.hostname +
								':' +
								config.server.port +
								config.server.extension +
								'/users/' +
								user._id
						}
					});
				} else if (user.info.name.length < 60) {
					res.status(200).json({
						user: user,
						request: {
							type: 'GET',
							url:
								config.server.protocol +
								'://' +
								config.server.hostname +
								':' +
								config.server.port +
								config.server.extension +
								'/users/' +
								user._id
						}
					});
				}
			} else {
				res.status(404).json({
					error: 'User not found.'
				});
			}
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({
				message: error.message
			});
		});
};

// ====================================================
// Readall
// ====================================================
exports.readall = (req, res, next) => {
	log.info('Incoming readall request');

	User.find()
		.exec()
		.then(users => {
			const response = {
				count: users.length,
				users: users.map(user => {
					if (user.info.name.length > 60) {
						return {
							_id: user._id,
							sequenceId: user.sequence_id,
							email: user.email,
							role: user.role,
							patients: user.patients,
							workers: user.workers,
							projectList: user.projectList,
							collectionList: user.collectionList,
							memberCollectionList: user.memberCollectionList,
							memberSurveyList: user.memberSurveyList,
							enabled: user.enabled,
							info: {
								pastAddresses: user.info.pastAddresses,
								name: key_private.decrypt(user.info.name, 'utf8'),
								gender: key_private.decrypt(user.info.gender, 'utf8'),
								dateOfBirth: user.info.dateOfBirth,
								language: user.info.language,
								currentAddress: user.info.currentAddress
							},
							research: user.research,
							createdAt: user.createdAt,
							createdBy: user.createdBy,
							updatedAt: user.updatedAt,
							modifiedBy: user.modifiedBy,
							request: {
								type: 'GET',
								url:
									config.server.protocol +
									'://' +
									config.server.hostname +
									':' +
									config.server.port +
									config.server.extension +
									'/users/' +
									user._id
							}
						};
					}
					return {
						_id: user._id,
						sequenceId: user.sequence_id,
						email: user.email,
						role: user.role,
						patients: user.patients,
						workers: user.workers,
						projectList: user.projectList,
						collectionList: user.collectionList,
						memberCollectionList: user.memberCollectionList,
						memberSurveyList: user.memberSurveyList,
						enabled: user.enabled,
						info: user.info,
						research: user.research,
						createdAt: user.createdAt,
						createdBy: user.createdBy,
						updatedAt: user.updatedAt,
						modifiedBy: user.modifiedBy,
						request: {
							type: 'GET',
							url:
								config.server.protocol +
								'://' +
								config.server.hostname +
								':' +
								config.server.port +
								config.server.extension +
								'/users/' +
								user._id
						}
					};
				})
			};

			res.status(200).json({ response });
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({
				message: error.message
			});
		});
};
// ====================================================
// Query
// ====================================================
exports.query = (req, res, next) => {
	const query = req.body;

	log.info('Incoming query');
	log.info(query);

	User.find(query)
		.exec()
		.then(users => {
			const response = {
				count: users.length,
				users: users.map(user => {
					if (user.info.name.length > 60) {
						return {
							_id: user._id,
							email: user.email,
							role: user.role,
							enabled: user.enabled,
							info: {
								pastAddresses: user.info.pastAddresses,
								name: key_private.decrypt(user.info.name, 'utf8'),
								gender: key_private.decrypt(user.info.gender, 'utf8'),
								dateOfBirth: user.info.dateOfBirth,
								language: user.info.language,
								currentAddress: user.info.currentAddress
							},
							patients: user.patients,
							workers: user.workers,
							projectList: user.projectList,
							collectionList: user.collectionList,
							memberCollectionList: user.memberCollectionList,
							memberSurveyList: user.memberSurveyList,
							workers: user.workers,
							createdAt: user.createdAt,
							updatedAt: user.updatedAt,
							request: {
								type: 'GET',
								url:
									config.server.protocol +
									'://' +
									config.server.hostname +
									':' +
									config.server.port +
									config.server.extension +
									'/users/' +
									user._id
							}
						};
					}
					return {
						_id: user._id,
						email: user.email,
						role: user.role,
						enabled: user.enabled,
						info: user.info,
						patients: user.patients,
						workers: user.workers,
						projectList: user.projectList,
						collectionList: user.collectionList,
						memberCollectionList: user.memberCollectionList,
						memberSurveyList: user.memberSurveyList,
						workers: user.workers,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
						request: {
							type: 'GET',
							url:
								config.server.protocol +
								'://' +
								config.server.hostname +
								':' +
								config.server.port +
								config.server.extension +
								'/users/' +
								user._id
						}
					};
				})
			};

			res.status(200).json({ response });
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({
				message: error.message
			});
		});
};

// ====================================================
// Update
// ====================================================
exports.update = (req, res, next) => {
	const id = req.params.userID;
	const query = req.body;

	log.info('Incoming update query');
	log.info(query);

	User.findById(id, (error, user) => {
		if (error) {
			log.error(error.message);

			return res.status(404).json({
				message: error.message
			});
		} else {
			if ('password' in query) {
				bcrypt.hash(config.server.default.admin.password, 10, (hashError, hash) => {
					if (hashError) {
						log.error('There was an error hashing a signup password');

						return res.status(401).json({
							message: hashError
						});
					}

					Object.assign(query, { password: hash });

					user.set(query);
					user.save((saveError, updatedUser) => {
						if (saveError) {
							log.error(saveError.message);

							return res.status(500).json({
								message: saveError.message
							});
						}

						log.info('User with id ' + id + ' updated');

						return res.status(200).json({
							user: updatedUser,
							request: {
								type: 'GET',
								url:
									config.server.protocol +
									'://' +
									config.server.hostname +
									':' +
									config.server.port +
									config.server.extension +
									'/users/' +
									updatedUser._id
							}
						});
					});
				});
			} else {
				user.set(query);
				user.save((saveError, updatedUser) => {
					if (saveError) {
						log.error(saveError.message);

						return res.status(500).json({
							message: saveError.message
						});
					}

					log.info('User with id ' + id + ' updated');

					return res.status(200).json({
						user: updatedUser,
						request: {
							type: 'GET',
							url:
								config.server.protocol +
								'://' +
								config.server.hostname +
								':' +
								config.server.port +
								config.server.extension +
								'/users/' +
								updatedUser._id
						}
					});
				});
			}
		}
	});
};

// ====================================================
// Delete
// ====================================================
exports.delete = (req, res, next) => {
	const id = req.params.userID;

	User.findByIdAndDelete(id)
		.exec()
		.then(result => {
			if (result) {
				log.info('User with id ' + id + ' deleted');

				res.status(200).json({
					message: 'User deleted'
				});
			} else {
				log.warn('Unable to delete user with id ' + id);

				res.status(401).json({
					message: 'Unable to delete user'
				});
			}
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({
				message: error.message
			});
		});
};

// ====================================================
// Full Read (Retrieves 1 extra Layer)
// ----------------------------------------------------
// This read will retrieve additional information
// 1 extra layer deep, retrieving anything with a
// mongoID in the user document.
// ====================================================
exports.fullread = (req, res, next) => {
	const id = req.params.userID;

	log.info('Incoming layer read (1) for user with id ' + id);

	User.findById(id)
		.select('-password')
		.populate('info.currentAddress', '_id street city state code country createdAt updatedAt')
		.populate('patients', '_id email role info research enabled facilityId patients workers createdAt updatedAt')
		.populate('workers', '_id email role info research enabled facilityId patients workers createdAt updatedAt')
		.exec()
		.then(user => {
			if (user) {
				if (user.role === 'Patient') {
					return StickyNote.find({ patientId: user._id })
						.populate('createdBy', '_id info.name')
						.populate('modifiedBy', '_id info.name')
						.exec()
						.then(stickyNotes => {
							return MemberSurvey.find({ patientId: user._id })
								.exec()
								.then(memberSurveys => {
									res.status(200).json({
										user: user,
										stickyNotes: stickyNotes.map(stickyNote => {
											return {
												_id: stickyNote._id,
												patientId: stickyNote.patientId,
												level: stickyNote.level,
												message: stickyNote.message,
												open: stickyNote.open,
												createdBy: stickyNote.createdBy,
												modifiedBy: stickyNote.modifiedBy,
												createdAt: stickyNote.createdAt,
												updatedAt: stickyNote.updatedAt,
												request: {
													type: 'GET',
													url:
														config.server.protocol +
														'://' +
														config.server.hostname +
														':' +
														config.server.port +
														config.server.extension +
														'/stickynotes/' +
														stickyNote._id
												}
											};
										}),
										memberSurveys: memberSurveys.map(memberSurvey => {
											return {
												_id: memberSurvey._id,
												patientId: memberSurvey.patientId,
												name: memberSurvey.name,
												surveyJSON: memberSurvey.surveyJSON,
												responseJSON: memberSurvey.responseJSON,
												completeStatus: memberSurvey.completeStatus,
												approved: memberSurvey.approved,
												approvedBy: memberSurvey.approvedBy,
												createdBy: memberSurvey.createdBy,
												modifiedBy: memberSurvey.modifiedBy,
												createdAt: memberSurvey.createdAt,
												updatedAt: memberSurvey.updatedAt,
												request: {
													type: 'GET',
													url:
														config.server.protocol +
														'://' +
														config.server.hostname +
														':' +
														config.server.port +
														config.server.extension +
														'/membersurveys/' +
														memberSurvey._id
												}
											};
										}),
										request: {
											type: 'GET',
											url:
												config.server.protocol +
												'://' +
												config.server.hostname +
												':' +
												config.server.port +
												config.server.extension +
												'/users/' +
												user._id
										}
									});
								})
								.catch(error => {
									log.error(error.message);

									res.status(500).json({
										message: error.message
									});
								});
						})
						.catch(error => {
							log.error(error.message);

							res.status(500).json({
								message: error.message
							});
						});
				} else {
					res.status(200).json({
						user: user,
						request: {
							type: 'GET',
							url:
								config.server.protocol +
								'://' +
								config.server.hostname +
								':' +
								config.server.port +
								config.server.extension +
								'/users/' +
								user._id
						}
					});
				}
			} else {
				res.status(404).json({
					error: 'User not found.'
				});
			}
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({
				message: error.message
			});
		});
};

// ====================================================
// Research ID Controllers
// ----------------------------------------------------
// 1) Create Research ID
// 2) Check Research ID
// 3) Enable / Disable
// ====================================================
exports.createResearchID = (req, res, next) => {
	const id = req.params.userID;

	log.info('Incoming research creation for user with ID ' + id);

	User.findById(id)
		.select('_id info email role info research enabled facilityId patients workers createdAt updatedAt')
		.populate('facilityId', '_id name prefix')
		.exec()
		.then(user => {
			if (user) {
				if (user.research.full === '' || user.research.full === undefined || user.research.full === null) {
					let _now = Date.now();

					var research = {
						research: {
							full: user.facilityId.prefix + '-' + _now,
							prefix: user.facilityId.prefix,
							u_no: _now
						}
					};

					user.set(research);
					user
						.save()
						.then(updatedUser => {
							log.info('User with id ' + id + ' updated.  New research ID: ' + user.facilityId.prefix + '-' + _now);

							return res.status(200).json({
								user: updatedUser,
								request: {
									type: 'GET',
									url:
										config.server.protocol +
										'://' +
										config.server.hostname +
										':' +
										config.server.port +
										config.server.extension +
										'/users/' +
										updatedUser._id
								}
							});
						})
						.catch(error => {
							log.error(error.message);

							res.status(500).json({
								message: error.message
							});
						});
				} else {
					log.warn('User with ID ' + id + ' already has a Research ID.');

					res.status(401).json({
						message: 'This user already has a Research ID.'
					});
				}
			} else {
				res.status(404).json({
					message: 'User not found.'
				});
			}
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({
				message: error.message
			});
		});
};

// =========================================================================
// Checks inside the database to see if a client has completed their surveys
// -------------------------------------------------------------------------
// Input:
// - Client id
// Get only user id and name, Exclude the other data.
// =========================================================================
exports.findClientSurveys = (req, res, next) => {
	// Look for the client:
	const id = req.params.userID;
	let surveysNotCompleted = [];
	log.info('Incoming find surveys request for client with ID ' + id);

	User.findById(id)
		.select('_id info email role memberSurveyList')
		.populate('memberSurveyList')
		.exec()
		.then(user => {
			if (user.role === 'Patient') {
				if (!user) throw new Error('Client does not exist');

				const clientSurveys = user.memberSurveyList;

				// Checking if the user has any surveys
				if (clientSurveys.length === 0 && user.info.name.length < 60) {
					return res.status(200).json({ message: `${user.info.name} has no surveys at the moment` });
				}
				if (clientSurveys.length === 0 && user.info.name.length > 60) {
					return res
						.status(200)
						.json({ message: `${key_private.decrypt(user.info.name, 'utf8')} has no surveys at the moment` });
				}

				for (let surveyIndex in clientSurveys) {
					log.info(`${surveyIndex}: Completeness score: ${clientSurveys[surveyIndex].completeness}`);

					const userSurveyCompleteness = clientSurveys[surveyIndex].completeness;

					if (userSurveyCompleteness != 100) {
						surveysNotCompleted.push(clientSurveys[surveyIndex]); // add the survey to the not completed survey list
					}
				}

				if (surveysNotCompleted.length === 0 && user.info.name.length < 60) {
					return res.status(200).json({ message: `${user.info.name} has completed all of their surveys.` });
				} else if (surveysNotCompleted.length === 0 && user.info.name.length > 60) {
					return res
						.status(200)
						.json({ message: `${key_private.decrypt(user.info.name, 'utf8')} has completed all of their surveys.` });
				}

				// otherwise the user has to complete their surveys
				return res.status(200).json({
					message: `Pending... ${user.info.name} needs to complete ${surveysNotCompleted.length} survey(s).`,
					surveys: surveysNotCompleted,
					info: user.info,
					id: id
				});
			}

			return res.status(401).json({ message: 'Unauthorized!' });
		})
		.catch(error => {
			log.error(error.message);

			res.status(500).json({ message: error.message });
		});
};

// ==================================================================================
// Get all users for that particular user (patient, volunteer, coordinator, admin...)
// ----------------------------------------------------------------------------------
// Input:
// - userId
// ==================================================================================
exports.getAllUsers = (req, res, next) => {
	const userID = req.params.userID;

	// Validate the user id to ensure it is an object id:
	if (!userID.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(400).json({ message: 'Invalid user id. Please check the user id!' });
	}

	// Find user
	User.findById(userID)
		.select('_id info.name role')
		.populate({ path: 'patients', select: 'info.name role' })
		.populate({ path: 'workers', select: 'info.name role' })
		.exec((err, foundUser) => {
			log.info(`Role: ${foundUser.role}`);
			if (err) return res.status(400).json({ message: err.message });

			if (!foundUser) return res.status(404).json({ message: 'User does not exist' });

			// Check the role first:
			if (foundUser.role === 'Admin') {
				// Admin: can send notes to everyone (staff, volunteer, patient).
				// Find all users except for the one sending the request
				User.find({ _id: { $nin: [userID] } })
					.select('_id info.name role')
					.exec((err, foundAll) => {
						const patientsList = [];
						const coordinatorsList = [];
						const adminsList = [];
						const volunteersList = [];

						if (err) return res.status(400).json({ message: err.message });

						if (foundAll.length === 0) return res.status(404).json({ message: 'Not found' });

						foundAll.forEach(currentUser => {
							switch (currentUser.role) {
								case 'Admin':
									currentUser.info.name =
										currentUser.info.name.length > 60
											? key_private.decrypt(currentUser.info.name, 'utf8')
											: currentUser.info.name;
									adminsList.push(currentUser);
									break;
								case 'Coordinator':
									currentUser.info.name =
										currentUser.info.name.length > 60
											? key_private.decrypt(currentUser.info.name, 'utf8')
											: currentUser.info.name;
									coordinatorsList.push(currentUser);
									break;
								case 'Volunteer':
									currentUser.info.name =
										currentUser.info.name.length > 60
											? key_private.decrypt(currentUser.info.name, 'utf8')
											: currentUser.info.name;
									volunteersList.push(currentUser);
									break;
								case 'Patient':
									currentUser.info.name =
										currentUser.info.name.length > 60
											? key_private.decrypt(currentUser.info.name, 'utf8')
											: currentUser.info.name;
									patientsList.push(currentUser);
									break;
								default:
									break;
							}
						});

						const dataToSend = {
							_id: foundUser._id,
							name:
								foundUser.info.name.length > 60
									? key_private.decrypt(foundUser.info.name, 'utf8')
									: foundUser.info.name,
							role: foundUser.role,
							admins: adminsList,
							coordinators: coordinatorsList,
							volunteers: volunteersList,
							patients: patientsList
						};

						return res.status(200).json({ user: dataToSend });
					});
			} else if (foundUser.role === 'Coordinator') {
				// Staff/Coordinator: can send notes to admin and corresponding volunteer.
				User.find({ role: 'Admin' })
					.select('_id info.name')
					.exec((err, foundAdmins) => {
						if (err) return res.status(400).json({ message: err.message });

						if (foundAdmins.length === 0) return res.status(404).json({ message: 'No admins exists!' });

						const dataToSend = {
							_id: foundUser._id,
							name:
								foundUser.info.name.length > 60
									? key_private.decrypt(foundUser.info.name, 'utf8')
									: foundUser.info.name,
							role: foundUser.role,
							admins: foundAdmins,
							volunteers: foundUser.workers,
							patients: foundUser.patients,
							coordinators: []
						};

						return res.status(200).json({ user: dataToSend });
					});
			} else if (foundUser.role === 'Volunteer') {
				// Volunteer: can send notes to their corresponding client and staff
				const dataToSend = {
					_id: foundUser._id,
					name:
						foundUser.info.name.length > 60 ? key_private.decrypt(foundUser.info.name, 'utf8') : foundUser.info.name,
					role: foundUser.role,
					coordinators: foundUser.workers,
					patients: foundUser.patients,
					volunteers: [],
					admins: []
				};

				return res.status(200).json({ user: dataToSend });
			} else if (foundUser.role === 'Patient') {
				// Client/Patient: can only send notes to their assigned volunteer.'
				const dataToSend = {
					_id: foundUser._id,
					name:
						foundUser.info.name.length > 60 ? key_private.decrypt(foundUser.info.name, 'utf8') : foundUser.info.name,
					role: foundUser.role,
					volunteers: foundUser.workers,
					coordinators: [],
					admins: [],
					patients: []
				};

				return res.status(200).json({ user: dataToSend });
			}
		});
};
