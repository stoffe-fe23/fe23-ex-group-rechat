# Group ReChat


## Firebase access rules

Includes some business login against best practice to allow the app to run on the subscription free version of the Firebase service.

```js
rules_version = '2';

service cloud.firestore {
	match /databases/{database}/documents {
		match /messages/{document=**} {
				allow read: if isInchannel();
				allow delete: if (isInchannel() && isCreator(resource.data));
				allow update: if (isCreator(resource.data) && isValidEditMessageData(request.resource.data));
				allow create: if (isLoggedIn() && isValidNewMessageData(request.resource.data));
		}
		match /users/{userId} {
				allow read: if isLoggedIn();
				allow update, delete: if (isLoggedIn() && (request.auth.uid == userId));
				allow create: if ((request.auth != null) && isValidUserData(request.resource.data));
		}
		match /channels/{document=**} {
				allow read: if true;
				allow delete: if (isChannelAdmin() && !resource.data.permanent);
				allow update: if (isChannelAdmin() && isValidEditChannelData(request.resource.data));
				allow create: if (isLoggedIn() && isValidNewChannelData(request.resource.data));
		}		
		
		function isLoggedIn() {
			return ((request.auth != null) && request.auth.token.email_verified);
		}
		
		function isInchannel() {
			return isLoggedIn() && (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.channelid == request.resource.data.channelid);
		}
		
		function isCreator(msg) {
			return isLoggedIn() && (request.auth.uid == msg.author);
		}
		
		function isValidNewMessageData(msg) {
			return (msg.keys().hasAll(['content', 'postdate', 'author', 'channelid'])
				&& ('content' in msg) && (msg.content is string) && (msg.content.size() > 0)
				&& ('postdate' in msg) && (msg.postdate is timestamp)
				&& ('author' in msg) && (msg.author is string) && (msg.author == request.auth.uid)
				&& ('channelid' in msg) && (msg.channelid is string) && (msg.channelid == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.channelid)
			);
		}
		
		function isValidEditMessageData(msg) {
			return (
				   ('content' in msg) && (msg.content is string) && (msg.content.size() > 0)
				&& !('postdate' in msg) || (('postdate' in msg) && (msg.postdate is timestamp))
				&& !('author' in msg) || (('author' in msg) && (msg.author is string) && (msg.author == resource.data.author))
				&& !('channelid' in msg) || (('channelid' in msg) && (msg.channelid is string) && (msg.channelid == resource.data.channelid))
			);
		}		
		
		function isValidUserData(usr) {
			return (usr.keys().hasAll(['authid', 'name', 'channelid', 'picture','activity'])
				&& ('name' in usr) && (usr.name is string) && (usr.name.size() > 1)
				&& ('authid' in usr) && (usr.authid is string) && (usr.authid == request.auth.uid)
				&& !('channelid' in usr) || (('channelid' in usr) && (usr.channelid is string) && exists(/databases/$(database)/documents/channels/$(usr.channelid)))
				&& !('picture' in usr) || (('picture' in usr) && (usr.picture is string)) 
				&& ('activity' in usr) && (usr.activity is timestamp)
			);
							
		}
		
		function isValidNewChannelData(chan) {
			return (
				   ('name' in chan) && (chan.name is string) && (chan.name.size() > 2)
				&& ('description' in chan) && (chan.description is string) && (chan.description.size() > 2)
				&& !('permanent' in chan) || (('permanent' in chan) && (chan.permanent is bool))
				&& ('admin' in chan) && (chan.admin is string) && (chan.admin == request.auth.uid)
			);
		}
		
		function isValidEditChannelData(chan) {
			return (isChannelAdmin()
				&& !('name' in chan)
				&& !('description' in chan) || (('description' in chan) && (chan.description is string) && (chan.description.size() > 2))
				&& !('permanent' in chan) || (('permanent' in chan) && (chan.permanent is bool))
				&& !('admin' in chan)
			);
		}		
		
		function isChannelAdmin() {
			return isInchannel() && (request.auth.uid == resource.data.admin)
		}
	}
}
```
