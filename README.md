![GetFit](http://res.cloudinary.com/daksh/image/upload/v1497383724/GetFit/logo_dark.png)

# GetFit

A simple app to track activities, fitness levels and find others like you. [Try it out](https://getfitapp.herokuapp.com/)!

## Table of Contents

1. [Screenshots](#screenshots)
2. [Live Demo](#live-demo)
3. [Tech Stack](#tech-stack)
4. [Roadmap](#roadmap)
5. [Contributions & Questions](#contributions--questions)

---

### Screenshots

#### Landing Page
![GetFit](http://res.cloudinary.com/daksh/image/upload/c_scale,w_1000/v1498070596/GetFit/landing.png)

#### Profiles
![GetFit](http://res.cloudinary.com/daksh/image/upload/c_scale,w_1000/v1498070597/GetFit/profiles.png)

#### User Profile
![GetFit](http://res.cloudinary.com/daksh/image/upload/c_scale,w_1000/v1498070598/GetFit/profile.png)

#### Fitness Data
![GetFit](http://res.cloudinary.com/daksh/image/upload/c_scale,w_1000/v1498070596/GetFit/fitness.png)

#### Hearting Profiles
![GetFit](http://res.cloudinary.com/daksh/image/upload/v1498070597/GetFit/heart-demo.gif)


### Live Demo

https://getfitapp.herokuapp.com/

Use these demo credentials to log in if you don't want to create an account:
* **Username**: test@example.com
* **Password**: test

---

### Tech Stack

1. **Front-end**: Pug (previously Jade), SASS
2. **Back-end**: Node.js, Express
3. **Database**: MongoDB, Mongoose
4. **Module bundler**: Webpack

#### The Devil's in the Details

##### Database Model

The app uses three models to handle all its data. This flowchart explains it better.

[![GetFit hearting profiles](https://res.cloudinary.com/daksh/image/upload/v1497901463/GetFit/db_pattern.png)](#)

##### Basic Features

* User accounts with authentication
* User profiles
* Fitness activity and goals

##### Interesting Features

For those who are interested, here is a note on how some of the most critical and hard to implement functionalities of this app were handled. Feel free to skip ahead if you don't feel like it.

* All authentication for GetFit is handled using the awesome [Passport](http://passportjs.org/) project.
* Passwords are stored in the database in ~~plain text~~ salted hashes.
* The password reset links truly work! This isn't just some demo project. I implemented those using [SendGrid's Email API for Node.js](https://sendgrid.com/solutions/sendgrid-api/).
* GetFit is hosted on Heroku's free plan whose dynos use an [ephemeral filesystem](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem) — any files written to the filesystem will be discarded the moment the dyno is stopped or restarted. What about the user uploaded profile pictures then? For those, I used [Cloudinary's Node.js API](http://cloudinary.com/documentation/node_integration).
* The account picture shown in the top right corner of the navigation bar is fetched from [Gravatar — Globally Recognized Avatars](https://en.gravatar.com/).

### Roadmap

> Without continual growth and progress, such words as improvement, achievement, and success have no meaning.
>
> ~ Benjamin Franklin

I've done a lot but the work on this project isn't over yet. It is far from perfect. Here are some of the things I have in mind for the future. These might be caveats you might have already noticed and if not, time for an aha moment.

Check out the [v2.0 milestone page](https://github.com/dakshshah96/getfit/milestone/1) for all planned changes, bug fixes and features coming soon.

### Contributions & Questions

I know it can be difficult for a beginner to wade through the web development learning process. Trust me, I'm going through it right now. But there's nothing that can't be achieved by asking the right questions. Feel free to open an issue if you have any questions about GetFit's development process and I'll try my best to help you.

That being said, I'm an absolute beginner too. Issues and pull requests for bug fixes and feature requests are most welcome.
