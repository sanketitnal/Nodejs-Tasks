# Simple News and Weather express API

# To Do
- [x] Weather API
- [x] News API
- [x] Adding Signin, Signup, Signout functionality. Temporary User DB
- [x] Making News API protected route (requires logging in for authentication)
- [x] Swagger documentation
- [x] Test cases
- [x] Caching functionality. Temporary Cache DB
- [ ] Add request cookie functionality in swagger for /news api testing
- [ ] Use Redis (currently using object)
- [ ] Use SQL database (currently using object)
- [ ] ...

# Setup
- move to project directory
- install all dependencies including dev dependencies using `npm install`
- create .env file in project directory, add following data in .env file.
```
WEATHER_API_KEY="REAL_WEATHER_API_KEY"
NEWS_API_KEY="REAL_NEWS_API_KEY"
```
- You can get API_KEYs from https://openweathermap.org/ and https://newsapi.org/

# Run
- Start project using `npm run start`
- Run test cases using `npm run test`
- Get api documentation at `http://localhost:3000/api-docs/`
