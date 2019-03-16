import actionTypes from '../Constant/Constant'
import firebase from '../../config/Firebase'
import { StackActions, NavigationActions } from 'react-navigation';
const firestore = require("firebase");

require("firebase/firestore");

const db = firebase.firestore()



// current User
export function current_User(currentUser) {
    return dispatch => {
        const UID = currentUser.uid
        var arr = [];

        dispatch({ type: actionTypes.UID, payload: UID })

        db.collection('UserData').where('UID', '==', currentUser.uid).onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((docs) => {
                if (docs.type === 'added') {
                    dispatch({ type: actionTypes.USER, payload: docs.doc.data() })
                }
                if (docs.type === 'modified') {
                    dispatch({ type: actionTypes.USER, payload: docs.doc.data() })
                }
            })
        })

        db.collection('UserData').onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((docs) => {
                if (docs.type === 'added') {
                    // if (docs.doc.data().UID !== UID) {
                    arr.push(docs.doc.data())
                    dispatch({ type: actionTypes.ALLUSER, payload: arr })
                    // }
                }
            })
        })

        var circlesArr = []
        var flag = false
        db.collection("circles")
            .onSnapshot(function (querySnapshot) {
                querySnapshot.docChanges().forEach(function (doc) {
                    if (doc.type === 'added') {
                        flag = flag ? null : 'flag'
                        var obj = {
                            key: doc.doc.id,
                            data: doc.doc.data()
                        }
                        // console.log('object***', obj)
                        circlesArr.push(obj)
                        dispatch({ type: actionTypes.CIRCLES, payload: circlesArr })
                        dispatch({ type: actionTypes.FLAG, payload: flag })
                        console.log('circlesArr******', circlesArr)
                    }
                    if (doc.type === 'modified') {
                        flag = flag ? null : 'flag'
                        var obj = {
                            key: doc.doc.id,
                            data: doc.doc.data()
                        }
                        circlesArr.map((item, index) => {
                            if (item.key === doc.doc.id) {
                                circlesArr.splice(index, 1, obj)
                            }
                        })
                        dispatch({ type: actionTypes.CIRCLES, payload: circlesArr })
                        dispatch({ type: actionTypes.FLAG, payload: flag })
                        // console.log('Addedreciever', arr)
                    }
                    if (doc.type === 'removed') {
                        flag = flag ? null : 'flag'
                        circlesArr.map((item, index) => {
                            if (item.key === doc.doc.id) {
                                circlesArr.splice(index, 1)
                            }
                        })
                        dispatch({ type: actionTypes.CIRCLES, payload: circlesArr })
                        dispatch({ type: actionTypes.FLAG, payload: flag })
                    }
                })
            })
    }
}


export function addUser(obj) {
    return dispatch => {
        db.collection('UserData').doc(obj.UID).set(obj)
    }
}

export function addMyData(obj, user) {
    return dispatch => {
        db.collection('UserData').doc(user).update(obj)
    }
}

export function addMyCircle(obj) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            db.collection('circles').add(obj).then(() => {
                resolve()
            })
        })
    }
}

export function expoToken(token, user) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            db.collection('UserData').where('UID', '==', user).get().then((querySnapshot) => {
                querySnapshot.forEach((docs) => {
                    db.collection('UserData').doc(docs.id).update({
                        expoToken: token
                    })
                })
            })
        })
    }
}

export function addEmail(obj, email) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            db.collection('UserData').where('email', '==', email).get().then((querySnapshot) => {
                querySnapshot.forEach((docs) => {
                    if (docs.data().email === email) {
                        fetch('https://exp.host/--/api/v2/push/send', {
                            mode: 'no-cors',
                            method: 'POST',
                            headers: {
                                "Accept": 'application/json',
                                "Content-Type": 'application/json'
                            },
                            body: JSON.stringify({
                                to: docs.data().expoToken,
                                title: obj.circleName,
                                body: obj.joinCode,
                            })
                        });
                    }
                    db.collection('UserData').doc(docs.id).update({})
                })
            })
        })
    }
}

export function enterCircleCode(uid, code) {
    return function (dispatch) {
        return new Promise(function (resolve, reject) {
            console.log('Object***', uid, code)
            db.collection("circles").where('joinCode', '==', code).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            console.log(`${doc.id} => ${doc.data().circleName}`);
                            if (doc.data().members.indexOf(uid) === -1) {
                                if (doc.data().userUid === uid) {
                                    reject('admin')
                                } else {
                                    db.collection('circles').doc(doc.id).update({ members: [...doc.data().members, uid] })
                                        .then(() => {
                                            resolve()
                                        })
                                }
                            }
                            else {
                                reject('exists')
                            }
                        });
                    }
                })
                .catch(() => {
                    // resolve('Empty')
                })
        })
    }
}

export function leaveCircle(uid, code) {
    return function (dispatch) {
        return new Promise(function (resolve, reject) {
            console.log('Object***', uid, code)
            db.collection("circles").where('joinCode', '==', code).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            console.log(`${doc.id} => ${doc.data().circleName}`);
                            if (doc.data().members.indexOf(uid) !== -1) {
                                var index = doc.data().members.indexOf(uid)
                                console.log('Index', index)
                                var arr = doc.data().members.slice(0)
                                var membersArr = arr.splice(index, 1)
                                console.log('Hello Worrld', arr)
                                db.collection('circles').doc(doc.id).update({ members: arr })
                                    .then(() => {
                                        resolve()
                                    })
                            }
                            else {
                                reject()
                            }
                        });
                    }
                })
                .catch(() => {
                })
        })
    }
}


export function deleteCircle(code) {
    return function (dispatch) {
        return new Promise(function (resolve, reject) {
            db.collection("circles").where('joinCode', '==', code).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach((doc) => {
                            db.collection('circles').doc(doc.id).delete()
                                .then(() => {
                                    resolve()
                                })
                        });
                    }
                })
                .catch(() => {
                })
        })
    }
}