import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDfYTGW_ttT1xAQlFhHGCY5JIj3DTuAm74",
  authDomain: "family-gps-tracker-8e9ed.firebaseapp.com",
  databaseURL: "https://family-gps-tracker-8e9ed.firebaseio.com",
  projectId: "family-gps-tracker-8e9ed",
  storageBucket: "family-gps-tracker-8e9ed.appspot.com",
  messagingSenderId: "999986515973"
};
firebase.initializeApp(config);
export default firebase