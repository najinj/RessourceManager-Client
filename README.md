## Minty Resource Manager Application
This Repo represents the backend project for the Minty Resource Manager Application, which allow users 
to search and eventually book custom resources defined by the admin in the back-office part of the application.
The reason why it's called minty is because I love mint :herb:.

## Motivation
The main reason why I wanted to create this app is that I have previously done a similar one two years ago back 
when I was still in college :school:, and  I wanted to know how much I have matured since :grin:.

So you can call it a remaster version :sparkles: if you like, it still needs some additional work and improvements but overall I'm happy with it 😄 . The first application was made using (MVC Pattern with PHP, JQuery, HTML).
you can find it here.

This Version is built using .NET Core, MongoDB, and React for the client-side.

## Tech/frameworks used (only for the back-end)
- [.NET Core](https://www.microsoft.com/net/core)
-  [MongoDb](https://www.mongodb.com/)
-  [Swagger](https://swagger.io/) for API documentation

## Features 
#### Access to the application :
- :traffic_light: Token-based authentication and authorization.
- :mailbox: Rest passwords enabled for users using an email link.
- :lock: User Accounts require activation from the admin.

#### Features available to a normal user :  
- :heavy_check_mark: As a user, I can search :mag: for available resources using a set of criteria.
- :heavy_check_mark: As a user, I  can book available resources.
- :heavy_check_mark: As a user, I  can book available resources periodiclly (eg: on Mondays,Wensdays starting 01/01/2020 to 01/03/2020 from 10:00 to 13:00).
- :heavy_check_mark: As a user, I  can view my reservations.
- :heavy_check_mark: As a user, I  cancel my reservations.
- :heavy_check_mark: As a user, I  can filter my reservations (based on resource name, resource type, date, or time).
- :heavy_check_mark: As a user, I  have a calendar view that allows me to see the availability of a resource in a calendar. 
- :heavy_check_mark: As a user, I  can book a resource using the calendar view.


#### Features available to an admin : 
- :heavy_check_mark: An admin can create, update, delete custom resource types (eg  resource type: Room)
- :heavy_check_mark: An admin can create, update, delete instances of those resource types  (eg Room N°15 which is an instance of Room )
- :heavy_check_mark: An admin can search for available resources using a set of criteria.
- :heavy_check_mark: An admin can book available resources.
- :heavy_check_mark: An admin can view his reservations.
- :heavy_check_mark: An admin can view all reservations
- :heavy_check_mark: An admin can filter reservations (based on resource name, resource type, date, or time).
- :heavy_check_mark: An admin can cancel his reservations
- :heavy_check_mark: An admin can cancel any reservation
- :heavy_check_mark: An admin can manager users accounts (Activate/deactivate)
- :heavy_check_mark: An admin can set settings for the applications 

###### Application Settings :
An admin has access to three main application settings 
1. Email settings: which is the configuration for the email server that would be used to send emails to users 
2. Reservation settings: which is a set of rules that applies when a user tries to book a resource 
     (eg: An admin can define the maximum duration that a user can book, 
      he can define the maximum date in the future :calendar: that a user is allowed to book ... and so on)
3. Calendar Settings: which controls the display of the calendar (things like min/max hour :clock730:, first day of the week :date:,12/24h hours format)

## Screenshots
### Login Page
![image](https://user-images.githubusercontent.com/29644684/80315360-90376a00-87e6-11ea-812c-c658dcc6c64e.png)
### Landing Page / Availability Page
![Availability](https://user-images.githubusercontent.com/29644684/80323163-39975380-8819-11ea-992f-454633a6de79.gif)
### Resource Management 
#### Resource Types

![ResourceType](https://user-images.githubusercontent.com/29644684/80322074-01404700-8812-11ea-8514-751c8b4fc96d.gif)

#### Spaces 

![space](https://user-images.githubusercontent.com/29644684/80322853-2f745580-8817-11ea-90e8-b79efdcbb96c.gif)

#### Assets 
![Asset](https://user-images.githubusercontent.com/29644684/80322819-0653c500-8817-11ea-9c85-39fe2eb2f035.gif)

### Reservations 
#### My Reservations 
![Reservations](https://user-images.githubusercontent.com/29644684/80323310-29cc3f00-881a-11ea-9b83-90cbfdb25697.gif)


#### Calendar View

![calendar](https://user-images.githubusercontent.com/29644684/80317418-37ba9980-87f3-11ea-9ebc-ade741b1882e.gif)

### User Managment
![image](https://user-images.githubusercontent.com/29644684/80317476-88ca8d80-87f3-11ea-9e89-61942d327573.png)

### Application Settings
![image](https://user-images.githubusercontent.com/29644684/80317507-bca5b300-87f3-11ea-8e7f-4c70e123360a.png)

## Installation

1. Clone the repo 
```
 $ git clone https://github.com/najinj/RessourceManager-Client.git
```
2. install dependencies
  ```
 $ yarn install 
```
Or
```
 $ npm install
```
3. execute command to run the application
```
 $ npm run dev-server
```
Or 
```
 $ yarn dev-server
```
## License

MIT © [najinj](https://github.com/najinj)

