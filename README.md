# Web
Server, mobile and developer tools for the SocketIO non-local code in the Granite project

# Code Standardisation
* Indent using spaces, not tabs
* 4 space indentation on blocks
* Unix standard LF line terminator

# Rushmore Web app
Includes simple web server module for testing app locally, run with
```http-server -a localhost -p 8000```

#Grunt Commands
Run jshint
```grunt check```

Update Bower
```grunt install```

Run angular server local or prod
```grunt run-angular-local```
```grunt run-angular-prod```

Run the socket server
```grunt run-socket-prod```

