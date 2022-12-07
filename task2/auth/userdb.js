/**
 * Temporarily using object,
 * Will use SQL database in production
 */

let usersArr = [
	{
		email: "sanket@gmail.com",
		name: "Sanket Itnal",
		password:
			"sanket@123" /** Temporarily password is stored directly. Should hash+salt the password in production. */,
	},
];
// Initial value present only for testing purpose

userDB = {
	signUpUser: function (newUser) {
		// returns {message: "", status: xxx} in case of error
		let exists = usersArr.find((user) => {
			return user.email === newUser.email;
		});
		if (exists) {
			return {
				message: "User already exists",
				status: 400,
			};
		}
		usersArr.push(newUser);
	},
	signInUser: function (userDt) {
		// returns true if valid user, else false
		let exists = usersArr.find((user) => {
			return user.email === userDt.email && user.password === userDt.password;
		});
		if (exists) {
			return true;
		}
		return false;
	},
};

module.exports = userDB;
