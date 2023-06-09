import {Injectable} from '@angular/core';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import * as config from "../../firebaseconfig.js";
import {MessageDTO} from "../dto";


@Injectable({
  providedIn: 'root'
})
export class FireService {

  mockDocument = {
    timestamp: new Date(),
    messageContent: "hello world",
    userid: 0,
    user: "me"
  }

  firebaseApplication;
  firestore: firebase.firestore.Firestore;
  messages: any[] = [];
  auth: firebase.auth.Auth;
  specificMessage: any;

  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.Firebaseconfig);
    this.firestore = firebase.firestore();
    this.getMessages();
    this.auth = firebase.auth();


    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getMessages();
      }
    })
  }

  async sendMessage(sendThisMessage: any, id: any) { // ex1
    this.mockDocument.messageContent = sendThisMessage;
    this.mockDocument.userid = id;
    return await this.firestore
      .collection("helloworld")
      .add(this.mockDocument);
  }

  async getMessages() { // ex2
    const ex2withGet = await this.firestore
      .collection("helloworld")
      .get();

    this.firestore
      .collection("helloworld")
      .onSnapshot(snapshot => {
        this.messages.push(snapshot.docs);
      })
  }

  getMessageById(findThisId: any): any { // ex3
    return this.firestore
      .collection("helloworld")
      .doc(findThisId);
  }

  async filterByUserId() { //ex4
    var q = this.firestore.collection("helloworld").orderBy("userid");

    await q.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.messages.push(doc.data());
      })
    })
  }


  async getNested() { //ex5
    return this.firestore
      .collection("helloworld")
      .doc("docpath")
      .collection("helloworld2")
      .doc("thisdoc");
  }

  async findAndFilterByUserid(filter: any) { //ex6
    return this.firestore
      .collection('helloworld')
      .where('someNumber', '>', filter.toString())
      .orderBy('someNumber');
  }

  updateField(path, fieldRep) { //ex7
    var q = this.firestore
      .collection("helloworld")
      .doc(path);

    q.set({
      userid: fieldRep,
    })
      .then(() => {
        console.log("Doc updated")
      })
  }

  addNewField(path, value, newField) { //ex8
    var q = this.firestore
      .collection("helloworld")
      .doc(path);

    q.set({
      newField: value,
    })
      .then(() => {
        console.log("Doc updated")
      })
  }

  async replaceDoc() { //ex9
    const someDocumentToDelete = (await (await this.sendMessage("something", 20)).get()).id;
    this.firestore
      .collection('helloworld')
      .doc(someDocumentToDelete)
      .delete().then(async onSccessfullDelete => {
      await this.firestore.collection('helloworld')
        .doc(someDocumentToDelete)
        .set({
          messageContent: "bla bla"
        });
    })
  }



  async deleteByTimeStamp() { //ex10
    const docs = (await this.firestore
      .collection('helloworld')
      .where('timestamp', '<', new Date())
      .get()).docs;
    docs.forEach(doc => {
      this.firestore
        .collection('helloworld')
        .doc(doc.id)
        .delete()
    })
  }



  async subscribeToChange() { //ex 11
    (await this.firestore
      .collection('helloworld')
      .get())
      .docChanges().forEach(change => {
      if (change.type == 'added') {
        //append
      } else if (change.type == 'removed') {
        //filter
      } else if (change.type == 'modified') {
        //edit doc
      }
    })
  }

  async paginate() { //ex12
    const someDocToStartAfter = await this.firestore.collection('helloworld')
      .orderBy('timestamp').limit(1).get(); //this is just to find a document if there is any in firestore

    return this.firestore
      .collection('helloworld')
      .orderBy('timestamp')
      .startAfter((someDocToStartAfter.docs[0])//always pick document references to start after
      ).limit(20 //results per page
      );
  }

  async indexQuery() { //ex13
    return this.firestore
      .collectionGroup('helloworld')
      .where('someProp', '==', 'something');
    //this is going to ask you if you want an index(in the console), just accept the offer
  }

  async atomicQueries() { //ex14
    return this.firestore.runTransaction(async (transaction) => {
      const someReference = (await (await this.getMessageById(1).get()).ref);
      return transaction.get(someReference).then((document) => {
        if (!document.exists) {
          throw "Err";
        }
        transaction.update(someReference, {someProperty: "someValue"});
      });
    })
  }


  register(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    this.auth.signOut();
  }
}

export interface MessageDTOI {
  messageContent: string;
  timestamp: Date;
  user: string;
  userid: any;
}
