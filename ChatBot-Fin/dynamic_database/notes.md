# FinGPT-Search-Agent

This portion is to document changes and development of the dynamic databse holding user data to hold for analysis between requests
https://dbdiagram.io/d/FinGPT-Search-Agent-Dynamic-Database-671c61fa97a66db9a35341b6

mongodb+srv://christian-sandoval:RCOS2024@fingpt-search-agent.rw0u7.mongodb.net/?retryWrites=true&w=majority&appName=FinGPT-Search-Agent

Data format:
[
    {
        "_id" : [int],
        "webpage" : [string],
        "button" : [string],
        "query" : [boolean],
        "query_data" : [null or string],
        "response_data" : [null or string],
        "response_time" : [null or string],
        "created_at" : [datetime]
    }
]

Database call under /ChatBot-Fin/chat_server/chat_server_app/views.py or /ChatBot-Fin/Extension-ChatBot-Fin/content_archive.js
I am more familiar with usage in Python so I will write the code there.

Extra installations required: pymongo