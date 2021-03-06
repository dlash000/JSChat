(function () {
    window.JSChat = {}
    window.JSChat.deleteMessage = function (id) {
        document.getElementById("message-" + id)
            .getElementsByClassName("action-link")[0].click();
        if(document.getElementById("message-" + id)
            .getElementsByClassName("popup")[0].getElementsByClassName("delete")[0] === undefined) {
            document.getElementById("message-" + id)
                .getElementsByClassName("popup")[0].getElementsByClassName("btn-close")[0].click();
            throw new Error("The message cannot be deleted")
            return
        } else {
            document.getElementById("message-" + id)
                .getElementsByClassName("popup")[0].getElementsByClassName("delete")[0].click()
        }
    }
    window.JSChat.escapeMarkdown = function (string) {
        var replacements = [
             [ /\*/g, '\\*' ],
             [ /#/g, '\\#' ],
             [ /\//g, '\\/' ],
             [ /\(/g, '\\(' ],
             [ /\)/g, '\\)' ],
             [ /\[/g, '\\[' ],
             [ /\]/g, '\\]' ],
             [ /\</g, '&lt;' ],
             [ /\>/g, '&gt;' ],
             [ /_/g, '\\_' ] ]
        return replacements.reduce(
            function(string, replacement) {
                return string.replace(replacement[0], replacement[1])
            },
        string)
    }
    window.JSChat.createMention = function (username) {
        var user = username
        return "@" + user.replace(/ /g, "")
    }
    window.JSChat.send = function (message) {
        document.getElementById("input")
            .value = message;
        document.getElementById("sayit-button")
            .click();
    }
    window.JSChat.run = (handler) => {
        if(typeof handler !== "function") throw new TypeError("The handler is not a function.");
        var io;
        for(io = 0; io !== document.getElementsByClassName("content")
            .length; io++) {
            document.getElementsByClassName("content")[io].innerHTML = "<b>(message handled)</b>"
        }
        return setInterval(() => {
            JSChat.retryMessageSend()
            if(document.getElementById("loading") !== null) return;
            var io;
            for(io = 0; io !== document.getElementsByClassName("content")
                .length; io++) {
                var messageData = {}
                if(0 === document.getElementsByClassName("content")[io].parentElement.getElementsByClassName("reply-info")
                    .length) {
                    messageData.replyMessageId = ""
                } else {
                    messageData.replyMessageId = document.getElementsByClassName("content")[io].parentElement.getElementsByClassName("reply-info")[0].href.split("#")[1]
                }
                messageData.node = document.getElementsByClassName("content")[io]
                messageData.username = document.getElementsByClassName("content")[io].parentElement.parentElement.parentElement.getElementsByClassName("signature")[0].getElementsByClassName("username")[0].innerHTML;
                messageData.rawHtml = document.getElementsByClassName("content")[io].innerHTML
                messageData.visibleText = document.getElementsByClassName("content")[io].innerText
                messageData.userId = document.getElementsByClassName("content")[io].parentElement.parentElement.parentElement.getElementsByClassName("signature")[0].classList[1].split("-")[1]
                messageData.messageId = document.getElementsByClassName("content")[io].parentElement.id.split("-")[1]
                messageData.send = function (message) {
                    document.getElementById("input")
                        .value = message;
                    document.getElementById("sayit-button")
                        .click();
                }
                messageData.reply = function (message) {
                    document.getElementById("input")
                        .value = ":" + messageData.messageId + " " + message;
                    document.getElementById("sayit-button")
                        .click();
                }
                if(document.getElementsByClassName("content")[io].parentElement.classList.contains("pending")) {
                    messageData.pending = true
                } else {
                    messageData.pending = false
                }
                // moderator check
                if(document.getElementsByClassName("content")[io].parentElement.parentElement.parentElement.getElementsByClassName("signature")[0].getElementsByClassName("moderator")
                    .length === 0) {
                    messageData.isModerator = false
                } else {
                    messageData.isModerator = true
                }
                if(document.getElementsByClassName("content")[io].parentElement.parentElement.parentElement.getElementsByClassName("signature")[0].getElementsByClassName("owner")
                    .length === 0) {
                    messageData.isRoomOwner = false
                } else {
                    messageData.isRoomOwner = true
                }
                if('<span class="deleted">(removed)</span>' === messageData.rawHtml) {
                    messageData.deleted = true
                } else {
                    messageData.deleted = false
                }
                messageData.deleteMessage = function (id) {
                    document.getElementById("message-" + id)
                        .getElementsByClassName("action-link")[0].click();
                    if(document.getElementById("message-" + id)
                        .getElementsByClassName("popup")[0].getElementsByClassName("delete")[0] === undefined) {
                        document.getElementById("message-" + id)
                            .getElementsByClassName("popup")[0].getElementsByClassName("btn-close")[0].click();
                        throw new Error("The message cannot be deleted")
                        return
                    } else {
                        document.getElementById("message-" + id)
                            .getElementsByClassName("popup")[0].getElementsByClassName("delete")[0].click()
                    }
                }
                if("<b>(message handled)</b>" === messageData.rawHtml) continue;
                handler(messageData)
                document.getElementsByClassName("content")[io].innerHTML = "<b>(message handled)</b>"

            }
        }, 1000)
    }
    window.JSChat.getUserList = function () {
        if(document.getElementById("loading") !== null) throw new Error("The chatroom is in the loading state.");
        var returnValue = []
        document.getElementById("present-users")
            .getElementsByClassName("more")[0].click()
        for(var i = 0; i !== document.getElementById("present-users")
            .querySelectorAll("li")
            .length; i++) {
            if("more" === document.getElementById("present-users")
                .querySelectorAll("li")[i].className) continue;
            returnValue[returnValue.length] = {}
            returnValue[returnValue.length - 1].username = document.getElementById("present-users")
                .querySelectorAll("li")[i].getElementsByClassName("user-gravatar32")[0].alt
            returnValue[returnValue.length - 1].userId = document.getElementById("present-users")
                .querySelectorAll("li")[i].id.split("present-user-")[1]
            var a = Number(document.getElementById("present-users")
                .querySelectorAll("li")[i].style.opacity)
            var num = a * 100;
            var n = num.toFixed(2)
            returnValue[returnValue.length - 1].activityPercentage = Number(n)
        }
        document.getElementById("present-users")
            .getElementsByClassName("more")[0].click()
        return returnValue
    }
    window.JSChat.stop = function (instanceId) {
        clearInterval(instanceId)
    }
    window.JSChat.retryMessageSend = function () {
        var i;
        for(i = 0; document.getElementsByTagName("a")
            .length !== i; i++) {
            if(document.getElementsByTagName("a")[i].innerHTML === "retry") {
                document.getElementsByTagName("a")[i].click()
            }
        }
    }
    window.JSChat.botUsername = function () {
        return document.getElementById("active-user")
            .getElementsByTagName("img")[0].alt
    }
    window.JSChat.botUserId = function () {
        return document.getElementById("active-user")
            .className.split(" ")
            .filter(function (a) {
                return /(user\-)[0-9]+/g.test(a)
            })[0].split("-")[1]
    }
})()
