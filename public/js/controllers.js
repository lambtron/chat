chatView.controller('mainController', ['$scope', '$http', 'socket', function($scope, $http, socket)
{
    // Initialize variables needed.
    $scope.newUser = {};
    $scope.newMessage = {};

    // When landing on the page, get all chats and a few pieces of each chat history.
    // You need to access the Nodejs API here.
    // Load only the Messages where your number is either the 'to' or the 'from'.
    $http.get('/api/users')
        .success(function(data) {
            $scope.users = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Adding a new user.
    $scope.addUser = function() {
        var postLoad = {}
        postLoad.firstName = $scope.newUser.firstName;
        postLoad.lastName = $scope.newUser.lastName;
        postLoad.phoneNumber = $scope.newUser.phoneNumber;
        $http.post('/api/user', postLoad)
            .success(function(data) {
                $('input').val('');
                $scope.users = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // When submitting a chat message, send the text to the node API
    // Node API will then send call function to send it via Twilio
    // and to save it to MongoDB.
    $scope.sendMessage = function() {
        var postLoad = {};
        // postLoad.from = newMessage.from;
        postLoad.to = $('#user').attr('data-phone-number');
        postLoad.body = $scope.newMessage.body;
        $http.post('/api/message', postLoad)
            .success(function(data) {
                $('input').val('');
                $scope.messages = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteMessage = function(id) {
        $http.delete('/api/message/' + id)
            .success(function(data) {
                $scope.messages = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Receiving data from server and pushing to front-end.
    socket.on('message', function(data) {
        // $scope.messages = data;
        console.log('we are receiving an inbound SMS from Twilio.');
        console.log(data);
    });
}]);