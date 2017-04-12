export default {
  "id": 1,
  "name": "Day 1",
  "tracks": [
    {
      "id": 11,
      "name": "Track 1",
      "slots": [
        {
          "id": 111,
          "start": "09:00",
          "end": "10:00",
          "contents": { 
            "id": 1, 
            "type": "TALK", 
            "title":"Title for talk 1","description":"Description talk 1","creationDate":1435663557878,"authors":[{"id":31404001,"uuid":"icoloma","name":"Nacho Coloma","avatar":"//storage.googleapis.com/k-avatars/31404001-caa3596b","description":"Description speaker 1."}],"comments":"Comments 1","tags":{"Type of Proposal":["Workshop"],"Language of the talk/workshop":["Spanish"],"Technology":["Other"],"Language ":["JAVA and JVM languages"],"Level ":["Intermediate"]},"totalVotes":3
          }
        },
        {
          "id": 112,
          "start": "10:00",
          "end": "11:00",
          "contents": {
            "id":2,
            "type": "TALK",
            "title":"Title for talk 2",
            "description":"Description talk 2","creationDate":1435663557878,"authors":[{"id":31404001,"uuid":"icoloma","name":"Nacho Coloma","avatar":"//storage.googleapis.com/k-avatars/31404001-caa3596b","description":"Description speaker 1."}],"comments":"Comments 1","tags":{"Type of Proposal":["Workshop"],"Language of the talk/workshop":["Spanish"],"Technology":["Other"],"Language ":["JAVA and JVM languages"],"Level ":["Intermediate"]},"totalVotes":3
          }
        },
        {
          "id": 113,
          "start": "11:00",
          "end": "11:15",
          "contents": {
            "type": "BREAK",
            "title": "Tea time like it's 1999"
          }
        }

      ]
    },
    {
      "id": 12,
      "name": "Track 2",
      "slots": [
        {
          "id": 121,
          "start": "09:00",
          "end": "11:00",
          "contents": {
            "type": "TALK",
            "id": 243,
            "title": "barbaz"
          }
        },
        {
          "id": 122,
          "start": "11:00",
          "end": "11:15",
          "contents": {
            "type": "EXTEND",
            "trackId": 11
          }
        }

      ]
    }
  ]
};
