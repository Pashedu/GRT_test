angular.module('chatApp',[])
    .controller('MessageController',function () {
        var mList=this;
        mList.messages = [
            {
                user:'Robot',
                message:'Enter room'
            }]
    });