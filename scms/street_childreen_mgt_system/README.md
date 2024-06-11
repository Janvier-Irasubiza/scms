# API Doc

# Getting user accounts

GET /api/users HTTP/1.1 <br>

# Creating user account

POST /api/users HTTP/1.1 <br>
Content-Type: application/json 

{<br>
  "first_name": "akm",<br/>
  "last_name": "msc",<br/>
  "email": "akm1@gmail.com",<br/>
  "username": "akm",<br/>
  "phone": "123456",<br/>
  "identity": 1234567,<br/>
  "gender": "male",<br/>
  "responsability": "exec",<br/>
  "is_superuser": 1,<br/>
  "is_staff": true,<br/>
  "privilege": "superuser",<br/>
  "residential_address": "Kigali",<br/>
  "password": "Hello"<br/>
}

# Adding cases:

POST /api/cases HTTP/1.1 <br>
Content-Type: application/json

   {<br/>
    "child_id": 1,<br/>
    "reason_of_capture": "Robber",<br/>
    "district_of_capture": "Nyarugenge",<br/>
    "village_of_capture": "Cyahafi",<br/>
    "date_of_capture": "2024-05-05T14:14:38Z",<br/>
    "orientation": "In transit",<br/>
    "case_desc": "Lorem",<br/>
    "sector_of_capture": 1,<br/>
    "cell_of_capture": 1,<br/>
    "reported_by_id": 1<br/>
  }

# Adding child


POST /api/children HTTP/1.1 <br>
Content-Type: application/json <br>

{ <br>
    "family_id": 1, <br>
    "firstname": "John", <br>
    "lastname": "Doe", <br>
    "identity": "23456789", <br>
    "gender": "Male", <br>
    "age": 23, <br>
    "created_at": "2024-05-07T14:08:00.675465Z", <br>
    "update_at": "2024-05-07T14:07:57Z", <br>
    "status": "In street", <br>
    "behavior": "Good", <br>
    "profile_picture": null <br>
  }

# Posting opportunities

POST /api/opps HTTP/1.1 <br>
Content-Type: application/json <br>

{ <br>
    "id": 1, <br>
    "posted_by": null, <br>
    "title": "Mastercard", <br>
    "description": "ms", <br>
    "poster": "http://127.0.0.1:8000/media/posts/images/Screenshot_2024-04-05_160114_tWjngQc.png", <br>
    "priority": "RQRE", <br>
    "posted_on": "2024-05-07T14:57:59.384608Z", <br>
    "updated_on": "2024-05-18T16:57:00Z", <br>
    "status": "available" <br>
}

# Posting testimonials

POST /api/testmonials HTTP/1.1 <br>
Content-Type: application/json <br>

{ <br>
    "id": 1, <br>
    "posted_by": null, <br>
    "title": "Mastercard", <br>
    "description": "ms", <br>
    "poster": "http://127.0.0.1:8000/media/posts/images/Screenshot_2024-04-05_160114_tWjngQc.png", <br>
    "video": "http://127.0.0.1:8000/media/posts/videos/Screenshot_2024-04-20_205707.png",  <br>
    "priority": "general", &nbsp; ## values can be general or recommended <br/>
    "posted_on": "2024-05-07T14:57:59.384608Z", <br>
    "updated_on": "2024-05-18T16:57:00Z", <br>
    "status": "available" <br>
}

